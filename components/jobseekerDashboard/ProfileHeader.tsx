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
    <div className="relative mb-8 group">
      <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
      <div className="relative bg-linear-to-r from-[#0A1F44] via-[#1e3a5f] to-[#2d4a6f] rounded-3xl p-10 shadow-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-500"
        ></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Profile Picture Section */}
          <div className="relative group/avatar">
            {isEditing ? (
              <div className="absolute -inset-1 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover/avatar:opacity-100 transition duration-500 animate-pulse"></div>
            ) : (
              <div className="absolute -inset-1 rounded-full border border-white/10 bg-transparent" aria-hidden="true"></div>
            )}

            <div className="relative w-40 h-40 rounded-full bg-linear-to-br from-white/20 to-white/5 backdrop-blur-md border-4 border-white/30 shadow-2xl overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-600/80 to-indigo-700/80">
                  <User className="w-20 h-20 text-white/60" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isEditing) return;
                imageInputRef.current?.click();
              }}
              aria-disabled={!isEditing}
              className={`absolute bottom-2 right-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-xl transition-all duration-300 border-2 border-white/30 ${
                !isEditing ? "opacity-70 cursor-not-allowed" : "hover:shadow-2xl hover:scale-110 cursor-pointer"
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

            {profileImage && (
              <button
                type="button"
                onClick={() => {
                  if (!isEditing) return;
                  removeImage();
                }}
                aria-disabled={!isEditing}
                className={`absolute top-0 right-0 bg-linear-to-r from-rose-500 to-red-500 text-white p-2 rounded-full shadow-xl transition-all duration-200 border-2 border-white/30 ${
                  !isEditing ? "opacity-70 cursor-not-allowed" : "hover:scale-110"
                }`}
                aria-label="Remove profile image"
                title="Remove profile image"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                {form?.fullName || "Your Professional Profile"}
              </h1>
              <p className="text-xl text-blue-100 font-semibold flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-5 h-5" />
                {form.headline || "Add your professional headline"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-blue-200">
                {form?.email && (
                <a href={`mailto:${form.email}`} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Mail className="w-4 h-4" />
                  <span className="truncate max-w-48">{form.email}</span>
                </a>
              )}

              {form?.location && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {form.location}
                </span>
              )}
            
              {form?.total_experience && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Award className="w-4 h-4" />
                  {form.total_experience}
                </span>
              )}

              {educationHistory && educationHistory.length > 0 && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  {educationHistory[0].degree || educationHistory[0].institution}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
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
              className="group relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#1A3D64] to-[#0C2B4E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {saving ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                  <span className="relative z-10">Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Edit2 className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Save Profile</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Edit Profile</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                // If currently editing, clicking Reset should cancel edits (reset fields)
                if (!isEditing) {
                  onReset();
                } else {
                  onReset();
                  if (onToggleEdit) onToggleEdit();
                }
              }}
              disabled={!isEditing}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-200 font-semibold text-sm cursor-pointer"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}