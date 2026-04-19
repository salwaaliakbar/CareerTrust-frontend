"use client";
import React from "react";
import { Plus, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import EmploymentCard from "./EmploymentCard";
import AddEmploymentForm from "./AddEmploymentForm";

interface WorkExperienceProps {
  employmentHistory: EmploymentRecord[];
  showAddEmployment: boolean;
  newEmployment: Partial<EmploymentRecord>;
  onToggleAddForm: () => void;
  onNewEmploymentChange: (
    field: keyof EmploymentRecord,
    value: Partial<EmploymentRecord>[keyof EmploymentRecord],
  ) => void;
  onAddEmployment: () => void;
  onUpdateEmployment: (employment: EmploymentRecord) => void;
  onDeleteEmployment: (id: string) => void;
  onDocumentUpload: (
    empId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onDocumentRemove: (empId: string, docId: string) => void;
  documentInputRefs: React.MutableRefObject<{
    [key: string]: HTMLInputElement | null;
  }>;
  disabled?: boolean;
}

export default function WorkExperience({
  employmentHistory,
  showAddEmployment,
  newEmployment,
  onToggleAddForm,
  onNewEmploymentChange,
  onAddEmployment,
  onUpdateEmployment,
  onDeleteEmployment,
  onDocumentUpload,
  onDocumentRemove,
  documentInputRefs,
  disabled = false,
}: WorkExperienceProps) {
  const DEFAULT_VISIBLE_EXPERIENCE = 2;
  const [showAllExperience, setShowAllExperience] = React.useState(false);

  const toMonthIndex = (value?: string) => {
    if (!value) return 0;
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (!match) return 0;
    return Number(match[2]) * 12 + Number(match[1]);
  };

  const sortedEmploymentHistory = [...employmentHistory].sort((a, b) => {
    if (a.currentlyWorking && !b.currentlyWorking) return -1;
    if (!a.currentlyWorking && b.currentlyWorking) return 1;
    return toMonthIndex(b.startDate) - toMonthIndex(a.startDate);
  });

  const shouldShowToggle =
    sortedEmploymentHistory.length > DEFAULT_VISIBLE_EXPERIENCE;

  const visibleEmploymentHistory = showAllExperience
    ? sortedEmploymentHistory
    : sortedEmploymentHistory.slice(0, DEFAULT_VISIBLE_EXPERIENCE);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full shadow-lg"></div>
              Work Experience
            </h2>
            <p className="text-sm text-slate-500 mt-2 ml-5 font-medium">
              Add and verify your employment history
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleAddForm}
            disabled={disabled}
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add Experience
          </button>
        </div>

        {/* Add Employment Form */}
        {showAddEmployment && !disabled && (
          <AddEmploymentForm
            newEmployment={newEmployment}
            onChange={onNewEmploymentChange}
            onAdd={onAddEmployment}
            onCancel={onToggleAddForm}
          />
        )}

        {/* Employment History List */}
        <div className="space-y-4">
          {employmentHistory.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-linear-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold">
                No work experience yet. Add your first record!
              </p>
            </div>
          ) : (
            visibleEmploymentHistory.map((emp) => (
              <EmploymentCard
                key={emp.id}
                employment={emp}
                onDelete={onDeleteEmployment}
                onUpdate={onUpdateEmployment}
                onDocumentUpload={onDocumentUpload}
                onDocumentRemove={onDocumentRemove}
                documentInputRef={(el) => {
                  documentInputRefs.current[emp.id] = el;
                }}
                disabled={disabled}
              />
            ))
          )}
        </div>

        {shouldShowToggle && (
          <div className="mt-6 rounded-xl border border-slate-200/80 bg-linear-to-r from-slate-50 to-blue-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {showAllExperience
                    ? `Showing all ${sortedEmploymentHistory.length} experiences`
                    : `Showing latest ${DEFAULT_VISIBLE_EXPERIENCE} of ${sortedEmploymentHistory.length} experiences`}
                </p>
                <p className="text-xs text-slate-500">
                  {showAllExperience
                    ? "Use collapse to keep the profile concise."
                    : "Expand to view your complete work history."}
                </p>
              </div>
              <div className="shrink-0">
            <button
              type="button"
              onClick={() => setShowAllExperience((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-[#0C2B4E] to-[#1D546C] px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            >
              {showAllExperience ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show all ({sortedEmploymentHistory.length})
                </>
              )}
            </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
