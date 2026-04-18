"use client";

import React from "react";
import { EducationRecord } from "@/types/jobseeker.types";
import { DocumentFile } from "@/types/jobseeker.types";
import { Upload, FileText, Trash2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface AddEducationFormProps {
  newEducation: Partial<EducationRecord>;
  onChange: (field: keyof EducationRecord, value: EducationRecord[keyof EducationRecord]) => void;
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentRemove: (docId: string) => void;
  documentInputRef: React.RefObject<HTMLInputElement | null>;
  onAdd: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function AddEducationForm({
  newEducation,
  onChange,
  onDocumentUpload,
  onDocumentRemove,
  documentInputRef,
  onAdd,
  onCancel,
  disabled = false,
}: AddEducationFormProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
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
            <label className="text-xs font-bold text-indigo-900 px-1">Start Date</label>
            <input
              type="month"
              max={currentMonth}
              value={toMonthInputValue(newEducation.startDate || "")}
              onChange={(e) =>
                onChange("startDate", fromMonthInputValue(e.target.value))
              }
              disabled={disabled}
                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-indigo-900 px-1">End Date (or leave blank if ongoing)</label>
            <input
              type="month"
              value={toMonthInputValue(newEducation.endDate || "")}
              onChange={(e) =>
                onChange("endDate", fromMonthInputValue(e.target.value))
              }
              disabled={disabled}
                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="rounded-lg border-2 border-indigo-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-indigo-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Supporting Documents ({((newEducation.documents as DocumentFile[]) || []).length})
            </p>
            <button
              type="button"
              onClick={() => documentInputRef.current?.click()}
              disabled={disabled}
              className={`inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <input
              ref={documentInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={onDocumentUpload}
              className="hidden"
              disabled={disabled}
            />
          </div>

          {((newEducation.documents as DocumentFile[]) || []).length === 0 ? (
            <p className="text-xs text-slate-500">No documents selected yet.</p>
          ) : (
            <div className="space-y-2">
              {((newEducation.documents as DocumentFile[]) || []).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{doc.name}</p>
                    <p className="text-[11px] text-slate-500">{formatFileSize(doc.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDocumentRemove(doc.id)}
                    disabled={disabled}
                    className={`rounded p-1.5 text-red-600 hover:bg-red-100 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
