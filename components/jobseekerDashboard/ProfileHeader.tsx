"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  Camera,
  User,
  Trash,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Edit2,
  Mail,
  CheckCircle2,
  XCircle,
  Building2,
  UserX,
} from "lucide-react";
import { ProfileData, EducationRecord } from "@/types/jobseeker.types";

interface ProfileHeaderProps {
  form: ProfileData;
  profileImage: string | null;
  setProfileFile: (file: File | null) => void;
  onImageChange: (image: string | null) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  educationHistory?: EducationRecord[];
  isCurrentlyEmployed?: boolean;
  openForOpportunities?: boolean;
  onToggleOpenForOpportunities?: () => void;
}

export default function ProfileHeader({
  form,
  profileImage,
  setProfileFile,
  onImageChange,
  onSave,
  onReset,
  saving,
  isEditing = false,
  onToggleEdit,
  educationHistory = [],
  isCurrentlyEmployed = false,
  openForOpportunities = true,
  onToggleOpenForOpportunities,
}: ProfileHeaderProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const avatarImageRef = useRef<HTMLImageElement | null>(null);
  const avatarXRef = useRef(50);
  const avatarYRef = useRef(50);
  const avatarViewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingAvatarRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    startAvatarX: 50,
    startAvatarY: 50,
  });

  const avatarPositionStorageKey = React.useMemo(() => {
    const userKeyRaw = form.email || form.fullName || "default-user";
    const userKey = userKeyRaw.trim().toLowerCase().replace(/\s+/g, "-");
    return `ct-avatar-position:${userKey}`;
  }, [form.email, form.fullName]);

  const clampPercent = useCallback((value: number, min = 0, max = 100) => {
    if (Number.isNaN(value)) return 50;
    return Math.min(max, Math.max(min, value));
  }, []);

  const applyAvatarPosition = useCallback((x: number, y: number) => {
    const safeX = clampPercent(x);
    const safeY = clampPercent(y);
    avatarXRef.current = safeX;
    avatarYRef.current = safeY;

    if (avatarImageRef.current) {
      avatarImageRef.current.style.objectPosition = `${safeX}% ${safeY}%`;
    }
  }, [clampPercent]);

  const persistAvatarPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        avatarPositionStorageKey,
        JSON.stringify({ x: clampPercent(x), y: clampPercent(y) }),
      );
    } catch {
      // Best-effort persistence only.
    }
  }, [avatarPositionStorageKey, clampPercent]);

  const handleAvatarDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isEditing || !profileImage) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const viewport = avatarViewportRef.current;
      if (!viewport) return;

      activePointerIdRef.current = e.pointerId;
      isDraggingAvatarRef.current = true;
      viewport.setPointerCapture(e.pointerId);
      dragStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        startAvatarX: avatarXRef.current,
        startAvatarY: avatarYRef.current,
      };
    },
    [isEditing, profileImage],
  );

  const handleAvatarDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingAvatarRef.current) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      // If primary button/finger is no longer active, stop dragging.
      if (e.pointerType === "mouse" && (e.buttons & 1) !== 1) {
        isDraggingAvatarRef.current = false;
        activePointerIdRef.current = null;
        persistAvatarPosition(avatarXRef.current, avatarYRef.current);
        return;
      }

      const viewport = avatarViewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaX = e.clientX - dragStartRef.current.pointerX;
      const deltaY = e.clientY - dragStartRef.current.pointerY;

      const nextX = dragStartRef.current.startAvatarX - (deltaX / rect.width) * 100;
      const nextY = dragStartRef.current.startAvatarY - (deltaY / rect.height) * 100;
      applyAvatarPosition(nextX, nextY);
    },
    [applyAvatarPosition, persistAvatarPosition],
  );

  const handleAvatarDragEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerIdRef.current !== null && activePointerIdRef.current !== e.pointerId) {
        return;
      }
      if (!isDraggingAvatarRef.current) return;
      isDraggingAvatarRef.current = false;
      activePointerIdRef.current = null;
      persistAvatarPosition(avatarXRef.current, avatarYRef.current);
    },
    [persistAvatarPosition],
  );

  useEffect(() => {
    let isCancelled = false;

    async function autoCenterFace(imageUrl: string) {
      try {
        const detectorCtor = (
          globalThis as unknown as {
            FaceDetector?: new (options?: {
              fastMode?: boolean;
              maxDetectedFaces?: number;
            }) => {
              detect: (
                input: CanvasImageSource,
              ) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
            };
          }
        ).FaceDetector;

        if (!detectorCtor) {
          if (!isCancelled) applyAvatarPosition(50, 50);
          return;
        }

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageUrl;

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Image load failed"));
        });

        const detector = new detectorCtor({ fastMode: true, maxDetectedFaces: 1 });
        const faces = await detector.detect(image);

        if (!faces || faces.length === 0) {
          if (!isCancelled) applyAvatarPosition(50, 50);
          return;
        }

        const face = faces[0];
        const faceCenterX = face.boundingBox.x + face.boundingBox.width / 2;
        const faceCenterY = face.boundingBox.y + face.boundingBox.height / 2;

        const xPercent = Math.min(
          80,
          Math.max(20, (faceCenterX / image.naturalWidth) * 100),
        );
        const yPercent = Math.min(
          75,
          Math.max(25, (faceCenterY / image.naturalHeight) * 100),
        );

        if (!isCancelled) {
          applyAvatarPosition(xPercent, yPercent);
        }
      } catch {
        if (!isCancelled) applyAvatarPosition(50, 50);
      }
    }

    if (!profileImage) {
      applyAvatarPosition(50, 50);
      return () => {
        isCancelled = true;
      };
    }

    let hasSavedPosition = false;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(avatarPositionStorageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as { x?: number; y?: number };
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            applyAvatarPosition(parsed.x, parsed.y);
            hasSavedPosition = true;
          }
        }
      } catch {
        hasSavedPosition = false;
      }
    }

    if (hasSavedPosition) {
      return () => {
        isCancelled = true;
      };
    }

    autoCenterFace(profileImage);

    return () => {
      isCancelled = true;
    };
  }, [profileImage, avatarPositionStorageKey, applyAvatarPosition]);

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(f);
    }
    setProfileFile(f || null);
  }

  function removeImage() {
    onImageChange(null);
    applyAvatarPosition(50, 50);
    persistAvatarPosition(50, 50);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  return (
    <div>
      <div className="relative mb-8">
        {/* ── Dark navy card matching dashboard hero ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Base background */}
          <div className="absolute inset-0 bg-[#0B1F45]" />

          {/* Gradient mesh */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 15% 50%, #1e40af44 0%, transparent 60%), radial-gradient(ellipse at 85% 15%, #7c3aed33 0%, transparent 55%), radial-gradient(ellipse at 60% 85%, #0ea5e922 0%, transparent 50%)",
            }}
          />

          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Decorative ping dots */}
          <div className="absolute top-4 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
          <div
            className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"
            style={{ animationDelay: "0.8s" }}
          />

          <div className="relative z-10 px-10 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* ── Avatar ── */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="relative group/avatar">
                {/* Animated ring when editing */}
                {isEditing ? (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur opacity-75 animate-pulse" />
                ) : (
                  <div
                    className="absolute -inset-1 rounded-full border border-white/10"
                    aria-hidden="true"
                  />
                )}

                <div
                  ref={avatarViewportRef}
                  onPointerDown={handleAvatarDragStart}
                  onPointerMove={handleAvatarDragMove}
                  onPointerUp={handleAvatarDragEnd}
                  onPointerCancel={handleAvatarDragEnd}
                  onLostPointerCapture={handleAvatarDragEnd}
                  className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-4 border-white/30 shadow-2xl overflow-hidden select-none ${
                    profileImage && isEditing
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-default"
                  }`}
                  title={
                    profileImage && isEditing
                      ? "Click and drag to adjust photo"
                      : undefined
                  }
                >
                  {profileImage ? (
                    <img
                      ref={avatarImageRef}
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover object-center transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/80 to-indigo-700/80">
                      <User className="w-20 h-20 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isEditing) return;
                    imageInputRef.current?.click();
                  }}
                  aria-disabled={!isEditing}
                  className={`absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-xl transition-all duration-300 border-2 border-white/30 ${
                    !isEditing
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-2xl hover:scale-110 cursor-pointer"
                  }`}
                  aria-label="Upload profile image"
                  title="Upload profile image"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!isEditing) return;
                    handleImagePick(e);
                  }}
                  disabled={!isEditing}
                  className="hidden"
                  aria-label="Upload profile image"
                  title="Upload profile image"
                />

                {/* Remove button */}
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditing) return;
                      removeImage();
                    }}
                    aria-disabled={!isEditing}
                    className={`absolute top-0 right-0 bg-gradient-to-r from-rose-500 to-red-500 text-white p-2 rounded-full shadow-xl transition-all duration-200 border-2 border-white/30 ${
                      !isEditing
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:scale-110"
                    }`}
                    aria-label="Remove profile image"
                    title="Remove profile image"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
                </div>

                {profileImage && isEditing && (
                  <p className="text-[11px] text-blue-100/85 font-semibold bg-white/10 rounded-md px-2 py-1">
                    Drag photo to adjust framing
                  </p>
                )}
              </div>

              {/* ── Profile Info ── */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    {form?.fullName || "Your Professional Profile"}
                  </h1>
                  <p className="text-xl text-blue-200/80 font-semibold flex items-center justify-center md:justify-start gap-2">
                    <Briefcase className="w-5 h-5 text-blue-300/70" />
                    {form.headline || "Add your professional headline"}
                  </p>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                  {/* Employment status */}
                  {isCurrentlyEmployed ? (
                    <span className="inline-flex items-center gap-1.5 bg-orange-500/25 border border-orange-400/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-orange-100 font-semibold text-sm">
                      <Building2 className="w-4 h-4" />
                      Employed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 font-semibold text-sm">
                      <UserX className="w-4 h-4" />
                      Not Employed
                    </span>
                  )}

                  {/* Open for opportunities toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing && onToggleOpenForOpportunities)
                        onToggleOpenForOpportunities();
                    }}
                    disabled={!isEditing}
                    title={isEditing ? "Click to toggle" : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 border ${
                      openForOpportunities
                        ? "bg-green-500/25 border-green-400/40 text-green-100 hover:bg-green-500/35"
                        : "bg-red-500/20 border-red-400/35 text-red-200 hover:bg-red-500/30"
                    } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {openForOpportunities ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Open for Opportunities
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Not Open for Opportunities
                      </>
                    )}
                  </button>

                  {form?.email && (
                    <a
                      href={`mailto:${form.email}`}
                      className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 text-sm hover:bg-white/15 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate max-w-48">{form.email}</span>
                    </a>
                  )}

                  {form?.location && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 text-sm">
                      <MapPin className="w-4 h-4" />
                      {form.location}
                    </span>
                  )}

                  {form?.total_experience && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 text-sm">
                      <Award className="w-4 h-4" />
                      {form.total_experience}
                    </span>
                  )}

                  {educationHistory && educationHistory.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 text-sm">
                      <GraduationCap className="w-4 h-4" />
                      {educationHistory[0].degree ||
                        educationHistory[0].institution}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      onSave();
                    } else {
                      if (onToggleEdit) onToggleEdit();
                    }
                  }}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 text-white text-base font-black shadow-lg shadow-indigo-500/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/50 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Save Profile
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isEditing) {
                      onReset();
                    } else {
                      onReset();
                      if (onToggleEdit) onToggleEdit();
                    }
                  }}
                  disabled={!isEditing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
