"use client";

import React from "react";
import { EducationRecord } from "@/types/jobseeker.types";

interface AddEducationFormProps {
  newEducation: Partial<EducationRecord>;
  onChange: (field: keyof EducationRecord, value: EducationRecord[keyof EducationRecord]) => void;
  onAdd: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function AddEducationForm({
  newEducation,
  onChange,
  onAdd,
  onCancel,
  disabled = false,
}: AddEducationFormProps) {
  return (
    <div className="mb-6 p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl border-2 border-indigo-200 shadow-inner">
      <h3 className="text-sm font-black text-indigo-900 mb-5 flex items-center gap-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        Add Education
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Institution / School (e.g., Stanford University)"
          value={newEducation.institution || ""}
          onChange={(e) => onChange("institution", e.target.value)}
          disabled={disabled}
           className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
        />
        
        <input
          type="text"
          placeholder="Degree (e.g., Bachelor of Science - Computer Science)"
          value={newEducation.degree || ""}
          onChange={(e) => onChange("degree", e.target.value)}
          disabled={disabled}
           className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-indigo-900 px-1">Start Year</label>
            <input
              type="text"
              placeholder="YYYY (e.g., 2022)"
              value={newEducation.startDate || ""}
              onChange={(e) => onChange("startDate", e.target.value)}
              disabled={disabled}
                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-indigo-900 px-1">End Year (or leave blank if ongoing)</label>
            <input
              type="text"
              placeholder="YYYY (e.g., 2026)"
              value={newEducation.endDate || ""}
              onChange={(e) => onChange("endDate", e.target.value)}
              disabled={disabled}
                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled}
              className={`flex-1 px-6 py-3 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white rounded-xl font-black hover:shadow-xl hover:scale-105 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
          >
            Add Education
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className={`px-6 py-3 bg-white text-slate-700 rounded-xl font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
