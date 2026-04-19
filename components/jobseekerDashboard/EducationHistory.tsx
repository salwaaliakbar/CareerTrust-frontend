"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Trash2,
  Plus,
  Calendar,
  Pencil,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock3,
  Upload,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { EducationRecord } from "@/types/jobseeker.types";
import Swal from "sweetalert2";
import { formatFileSize } from "@/lib/utils";

interface EducationHistoryProps {
  educationHistory: EducationRecord[];
  showAddEducation: boolean;
  onToggleAdd: () => void;
  onDelete: (id: string | number) => void;
  onUpdate: (education: EducationRecord) => void;
  onDocumentUpload: (
    educationId: string | number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onDocumentRemove: (educationId: string | number, docId: string) => void;
  documentInputRef: (educationId: string | number, el: HTMLInputElement | null) => void;
  disabled?: boolean;
}

export default function EducationHistory({
  educationHistory,
  showAddEducation,
  onToggleAdd,
  onDelete,
  onUpdate,
  onDocumentUpload,
  onDocumentRemove,
  documentInputRef,
  disabled = false,
}: EducationHistoryProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [draft, setDraft] = useState<EducationRecord | null>(null);

  const toEducationIndex = (value: string) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return null;

    if (/^\d{4}$/.test(trimmed)) {
      return Number(trimmed) * 12 + 1;
    }

    const monthYear = trimmed.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (monthYear) {
      return Number(monthYear[2]) * 12 + Number(monthYear[1]);
    }

    return null;
  };

  const sortedEducationHistory = [...educationHistory].sort((a, b) => {
    const aIndex = toEducationIndex(a.startDate || "") || 0;
    const bIndex = toEducationIndex(b.startDate || "") || 0;
    return bIndex - aIndex;
  });

  const getStatusBadge = (edu: EducationRecord) => {
    const status = edu.verificationStatus || "pending";

    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-bold">
          <CheckCircle className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold">
        <Clock3 className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  const startEdit = (edu: EducationRecord) => {
    setEditingId(edu.id);
    setDraft({ ...edu, documents: edu.documents || [] });
  };

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

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!draft) return;

    if (!draft.institution.trim() || !draft.degree.trim() || !draft.startDate.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Institution, degree, and start date are required.",
      });
      return;
    }

    const startIndex = toEducationIndex(draft.startDate);
    const endIndex = toEducationIndex(draft.endDate);

    if (!startIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Start Date",
        text: "Use YYYY or MM/YYYY format for start date.",
      });
      return;
    }

    if (draft.endDate && !endIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid End Date",
        text: "Use YYYY or MM/YYYY format for end date.",
      });
      return;
    }

    if (startIndex && endIndex && endIndex < startIndex) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "End date cannot be before start date.",
      });
      return;
    }

    const previousStatus = draft.verificationStatus;
    onUpdate({
      ...draft,
      institution: draft.institution.trim(),
      degree: draft.degree.trim(),
      startDate: draft.startDate.trim(),
      endDate: draft.endDate.trim(),
      documents: draft.documents || [],
      verificationStatus: previousStatus === "rejected" ? "pending" : previousStatus,
      verified: previousStatus === "verified",
    });
    cancelEdit();
  };

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
            {sortedEducationHistory.map((edu) => (
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
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getStatusBadge(edu)}
                        </div>

                        {editingId === edu.id && draft ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={draft.institution}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev ? { ...prev, institution: e.target.value } : prev,
                                )
                              }
                              className="w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              value={draft.degree}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev ? { ...prev, degree: e.target.value } : prev,
                                )
                              }
                              className="w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="month"
                                max={currentMonth}
                                value={toMonthInputValue(draft.startDate)}
                                onChange={(e) =>
                                  setDraft((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          startDate: fromMonthInputValue(e.target.value),
                                        }
                                      : prev,
                                  )
                                }
                                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                              />
                              <input
                                type="month"
                                value={toMonthInputValue(draft.endDate)}
                                onChange={(e) =>
                                  setDraft((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          endDate: fromMonthInputValue(e.target.value),
                                        }
                                      : prev,
                                  )
                                }
                                className="w-full rounded-lg border-2 border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-black text-slate-800 mb-1">
                              {edu.institution}
                            </h3>
                            <p className="text-[#0C2B4E] font-bold text-base mb-2">
                              {edu.degree}
                            </p>
                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                              <Calendar className="w-4 h-4 text-[#0C2B4E]" />
                              <span>
                                {edu.startDate}
                                {edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                              </span>
                            </div>
                          </>
                        )}

                        {(edu.verificationStatus === "rejected" ||
                          edu.verificationStatus === "pending") &&
                          edu.rejectionReason && (
                          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-xs font-bold text-red-900 mb-1">
                              {edu.verificationStatus === "pending"
                                ? "Previous Rejection Reason"
                                : "Rejection Reason"}
                            </p>
                            <p className="text-xs text-red-700">{edu.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === edu.id ? (
                      <>
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={disabled}
                          className={`p-2.5 text-green-700 hover:bg-green-50 rounded-lg transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
                          title="Save changes"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={disabled}
                          className={`p-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-all ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(edu)}
                          disabled={disabled || edu.verificationStatus === "verified"}
                          className={`p-2.5 rounded-lg transition-all ${
                            disabled || edu.verificationStatus === "verified"
                              ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                              : "text-indigo-700 hover:bg-indigo-50"
                          }`}
                          title="Edit education"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(edu.id)}
                          disabled={disabled || edu.verificationStatus === "verified"}
                          className={`p-2.5 rounded-lg transition-all ${
                            disabled || edu.verificationStatus === "verified"
                              ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50 hover:scale-110"
                          }`}
                          title="Delete education"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Supporting Documents ({edu.documents?.length || 0})
                    </p>
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(`education-file-input-${edu.id}`)
                            ?.click()
                        }
                        disabled={disabled || edu.verificationStatus === "verified"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          disabled || edu.verificationStatus === "verified"
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </button>
                      <input
                        id={`education-file-input-${edu.id}`}
                        ref={(el) => documentInputRef(edu.id, el)}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => onDocumentUpload(edu.id, e)}
                        className="hidden"
                        disabled={disabled || edu.verificationStatus === "verified"}
                      />
                    </>
                  </div>

                  {!edu.documents || edu.documents.length === 0 ? (
                    <p className="text-xs text-slate-500">No documents uploaded.</p>
                  ) : (
                    <div className="space-y-2">
                      {edu.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{doc.name}</p>
                            <p className="text-[11px] text-slate-500">{formatFileSize(doc.size)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {doc.url && (
                              <>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={doc.url}
                                  download={doc.name}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => onDocumentRemove(edu.id, doc.id)}
                              disabled={disabled || edu.verificationStatus === "verified"}
                              title="Remove document"
                              className={`p-1.5 rounded ${
                                disabled || edu.verificationStatus === "verified"
                                  ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-100"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
