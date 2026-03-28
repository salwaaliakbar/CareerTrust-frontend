"use client";

import React from "react";
import { EmploymentRecord } from "@/types/jobseeker.types";

interface AddEmploymentFormProps {
  newEmployment: Partial<EmploymentRecord>;
  onChange: (field: keyof EmploymentRecord, value: EmploymentRecord[keyof EmploymentRecord]) => void;
  onAdd: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function AddEmploymentForm({
  newEmployment,
  onChange,
  onAdd,
  onCancel,
  disabled = false,
}: AddEmploymentFormProps) {
  const toMonthInputValue = (value?: string) => {
    if (!value) return "";

    const monthYearMatch = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (monthYearMatch) {
      return `${monthYearMatch[2]}-${monthYearMatch[1]}`;
    }

    const yearMonthMatch = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
    if (yearMonthMatch) {
      return value;
    }

    return "";
  };

  const fromMonthInputValue = (value: string) => {
    const match = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
    if (!match) return "";
    return `${match[2]}/${match[1]}`;
  };

  return (
    <div className="mb-6 p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl border-2 border-indigo-200 shadow-inner">
      <h3 className="text-sm font-black text-[#0C2A4E] mb-5 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#0C2A4E] rounded-full animate-pulse"></div>
        Add New Work Experience
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={newEmployment.company || ""}
            onChange={(e) => onChange("company", e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-[0C2A4E] focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
          />
          <input
            type="text"
            placeholder="Position/Title"
            value={newEmployment.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-[#0C2A4E] focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[0C2A4E] px-1">Start Date</label>
            <input
              type="month"
              value={toMonthInputValue(newEmployment.startDate || "")}
              onChange={(e) =>
                onChange("startDate", fromMonthInputValue(e.target.value))
              }
              disabled={disabled}
              className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-[#0C2A4E] focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0C2A4E] px-1">End Date</label>
            <input
              type="month"
              value={toMonthInputValue(newEmployment.endDate || "")}
              onChange={(e) =>
                onChange("endDate", fromMonthInputValue(e.target.value))
              }
              disabled={newEmployment.currentlyWorking || disabled}
              aria-disabled={disabled}
              className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-[#0C2A4E] focus:ring-4 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:border-slate-200 transition-all font-medium"
            />
          </div>
        </div>
          <label className={`flex items-center gap-3 text-sm text-[#0C2A4E] font-bold bg-white px-4 py-3 rounded-lg border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
          <input
            type="checkbox"
            checked={newEmployment.currentlyWorking || false}
              onChange={(e) => {
                onChange("currentlyWorking", e.target.checked);
                if (e.target.checked) {
                  onChange("endDate", "");
                }
              }}
            className="w-5 h-5 accent-indigo-500"
          />
          I currently work here
        </label>
        <textarea
          placeholder="Job description and responsibilities..."
          value={newEmployment.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-[#0C2A4E] focus:ring-4 focus:ring-indigo-500/20 resize-none transition-all font-medium"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled}
            className={`flex-1 px-6 py-3 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white rounded-xl font-black hover:shadow-xl hover:scale-105 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
          >
            Add Experience
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