"use client";

import React from "react";
import {
  User,
  Briefcase,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react";
import { ProfileData } from "@/types/jobseeker.types";

interface PersonalInformationProps {
  form: ProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export default function PersonalInformation({
  form,
  onChange,
  disabled = false,
}: PersonalInformationProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full shadow-lg"></div>
            Personal Information
          </h2>
          <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                Full Name
              </span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
            </label>

            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Professional Headline
              </span>
              <input
                name="headline"
                value={form.headline}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium disabled:cursor-not-allowed"
                placeholder="Senior Software Engineer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location
              </span>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium disabled:cursor-not-allowed"
                placeholder="New York, USA"
              />
            </label>

            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Award className="w-4 h-4 text-blue-600" />
                Experience
              </span>
              <input
                name="total_experience"
                value={form.total_experience}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium disabled:cursor-not-allowed"
                placeholder="5+ years"
              />
            </label>

            <label className="block group/input">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Skills
              </span>
              <input
                name="skills"
                value={form.skills}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 group-hover/input:border-slate-300 font-medium disabled:cursor-not-allowed"
                placeholder="ReactJS, NodeJS, MongoDB, Python (comma-separated)"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}