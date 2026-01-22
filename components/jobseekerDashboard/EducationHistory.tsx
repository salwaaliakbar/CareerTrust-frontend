"use client";

import React from "react";
import { GraduationCap, Trash2, Plus, Calendar } from "lucide-react";
import { EducationRecord } from "@/types/jobseeker.types";

interface EducationHistoryProps {
  educationHistory: EducationRecord[];
  showAddEducation: boolean;
  onToggleAdd: () => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export default function EducationHistory({
  educationHistory,
  showAddEducation,
  onToggleAdd,
  onDelete,
  disabled = false,
}: EducationHistoryProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-linear-to-r from-[#0C2B4E] to-[#1D546C]s rounded-full shadow-lg"></div>
            Education
          </h2>
          {!showAddEducation && (
            <button
              type="button"
              onClick={onToggleAdd}
              disabled={disabled}
                className={`flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <Plus className="w-5 h-5" />
              Add Education
            </button>
          )}
        </div>

        {educationHistory.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-lg mb-2">
              No education added yet
            </p>
            <p className="text-slate-400 text-sm">
              Click {`'`}Add Education{`'`} to add your educational background
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {educationHistory.map((edu) => (
              <div
                key={edu.id}
                 className="group/edu relative p-6 bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-[#0C2B4E] rounded-lg shadow-md">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                          {edu.institution}
                        </h3>
                          <p className="text-[#0C2B4E] font-bold text-base mb-2">
                          {edu.degree}
                        </p>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-[#0C2B4E]" />
                          <span>
                            {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(edu.id)}
                    disabled={disabled}
                    className={`p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
                    title="Delete education"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
