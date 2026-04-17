"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  FileText,
  Sparkles,
  Calendar,
  Star,
  Tag,
} from "lucide-react";
import { JobFormData } from "@/types/job.types";

interface JobPostFormProps {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead/Manager",
  "Executive",
];

export default function JobPostForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode = false,
}: JobPostFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: initialData || {
      jobType: "Full-time",
      experience: "Mid Level",
      featured: false,
    },
  });

  const skillsInput = watch("skills");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 animate-smooth-enter"
    >
      {/* Basic Information */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full shadow-lg"></div>
              Basic Information
            </h2>
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>

          <div className="space-y-6">
            {/* Job Title */}
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Job Title <span className="text-red-500">*</span>
              </span>
              <input
                {...register("title", {
                  required: "Job title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                placeholder="e.g., Senior Full Stack Developer"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </label>

            {/* Location and Salary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block group/input">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Location <span className="text-red-500">*</span>
                </span>
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                  placeholder="e.g., Lahore, Pakistan / Remote"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </label>

              <label className="block group/input">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <span className="text-blue-600 font-bold text-sm">₨</span>
                  Salary (PKR)
                </span>
                <input
                  {...register("salary")}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                  placeholder="e.g., Rs. 80,000 - Rs. 150,000 / month"
                />
              </label>
            </div>

            {/* Job Type and Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block group/input">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Job Type <span className="text-red-500">*</span>
                </span>
                <select
                  {...register("jobType", {
                    required: "Job type is required",
                  })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block group/input">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Experience Level <span className="text-red-500">*</span>
                </span>
                <select
                  {...register("experience", {
                    required: "Experience level is required",
                  })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-purple-600 to-pink-600 rounded-full shadow-lg"></div>
              Job Description
            </h2>
            <FileText className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>

          <div className="space-y-6">
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </span>
              <textarea
                {...register("description", {
                  required: "Job description is required",
                  minLength: {
                    value: 50,
                    message: "Description must be at least 50 characters",
                  },
                })}
                rows={8}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium resize-y"
                placeholder="Provide a detailed description of the role, responsibilities, requirements, and what makes this opportunity unique..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Skills & Requirements */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-linear-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-green-600 to-teal-600 rounded-full shadow-lg"></div>
              Skills & Requirements
            </h2>
            <Tag className="w-6 h-6 text-green-500 animate-pulse" />
          </div>

          <div className="space-y-6">
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                Required Skills <span className="text-red-500">*</span>
              </span>
              <input
                {...register("skills", {
                  required: "At least one skill is required",
                })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
                placeholder="e.g., JavaScript, React, Node.js, TypeScript (comma-separated)"
              />
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.skills.message}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-2">
                Separate skills with commas
              </p>
            </label>

            {/* Skills Preview */}
            {skillsInput && (
              <div className="flex flex-wrap gap-2">
                {skillsInput.split(",").map((skill, index) => {
                  const trimmedSkill = skill.trim();
                  if (!trimmedSkill) return null;
                  return (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm font-semibold shadow-md"
                    >
                      {trimmedSkill}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-orange-600 to-red-600 rounded-full shadow-lg"></div>
              Additional Details
            </h2>
            <Calendar className="w-6 h-6 text-orange-500 animate-pulse" />
          </div>

          <div className="space-y-6">
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Application Deadline
              </span>
              <input
                type="date"
                {...register("deadline")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium"
              />
            </label>

            {/* Featured Job Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group/check p-4 rounded-xl hover:bg-orange-50 transition-all duration-200">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 rounded border-2 border-slate-300 text-orange-600 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-slate-700">
                  Mark as Featured Job
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-8 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] hover:from-[#1A3D64] hover:to-[#2A5A7F]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {isEditMode ? "Updating Job..." : "Posting Job..."}
            </>
          ) : (
            <>
              <Briefcase className="w-5 h-5" />
              {isEditMode ? "Update Job" : "Post Job"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
