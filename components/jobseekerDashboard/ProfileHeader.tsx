"use client";

import React, { useRef } from "react";
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
              <div className="relative group/avatar shrink-0">
                {/* Animated ring when editing */}
                {isEditing ? (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur opacity-75 animate-pulse" />
                ) : (
                  <div
                    className="absolute -inset-1 rounded-full border border-white/10"
                    aria-hidden="true"
                  />
                )}

                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border-4 border-white/30 shadow-2xl overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
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
