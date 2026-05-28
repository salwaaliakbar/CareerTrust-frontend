"use client";

import React from "react";
import {
  Building2,
  Calendar,
  Trash,
  Pencil,
  File,
  Upload,
  AlertCircle,
  FileText,
  Eye,
  Download,
  X,
} from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import { getVerificationBadge, formatFileSize, calculateDuration } from "@/lib/utils";

interface EmploymentCardProps {
  employment: EmploymentRecord;
  onDelete: (id: string) => void;
  onDocumentUpload: (
    empId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onDocumentRemove: (empId: string, docId: string) => void;
  onUpdate: (updatedEmployment: EmploymentRecord) => void;
  documentInputRef: (el: HTMLInputElement | null) => void;
  disabled?: boolean;
}

export default function EmploymentCard({
  employment,
  onDelete,
  onDocumentUpload,
  onDocumentRemove,
  onUpdate,
  documentInputRef,
  disabled = false,
}: EmploymentCardProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<EmploymentRecord>(employment);
  const [editError, setEditError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDraft(employment);
    setIsEditing(false);
    setEditError(null);
  }, [employment]);

  const canEditCard = employment.verificationStatus !== "verified" && !disabled;
  const canManageDocuments =
    employment.verificationStatus !== "verified" && !disabled;

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

  const monthYearToIndex = (value: string) => {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (!match) return null;

    const month = Number(match[1]);
    const year = Number(match[2]);
    return year * 12 + month;
  };

  const saveCardChanges = () => {
    const startIndex = monthYearToIndex(draft.startDate);
    const endIndex = draft.currentlyWorking ? null : monthYearToIndex(draft.endDate);
    const now = new Date();
    const currentMonthIndex = now.getFullYear() * 12 + (now.getMonth() + 1);

    if (!startIndex) {
      setEditError("Please provide a valid start date in MM/YYYY format.");
      return;
    }

    if (startIndex > currentMonthIndex) {
      setEditError("Start date cannot be in the future.");
      return;
    }

    if (!draft.currentlyWorking && draft.endDate && !endIndex) {
      setEditError("Please provide a valid end date in MM/YYYY format.");
      return;
    }

    if (!draft.currentlyWorking && startIndex && endIndex && endIndex < startIndex) {
      setEditError("End date cannot be before start date.");
      return;
    }

    onUpdate({
      ...draft,
      endDate: draft.currentlyWorking ? "" : draft.endDate,
    });
    setIsEditing(false);
    setEditError(null);
  };

  const cancelCardEditing = () => {
    setDraft(employment);
    setIsEditing(false);
    setEditError(null);
  };

  return (
    <div className="group/card relative p-6 bg-linear-to-br from-white via-slate-50 to-blue-50/30 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-100 to-transparent rounded-full blur-3xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-500"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {isEditing ? (
              <input
                type="text"
                value={draft.position}
                onChange={(e) => setDraft((prev) => ({ ...prev, position: e.target.value }))}
                className="text-lg font-black text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-full"
              />
            ) : (
              <h3 className="text-xl font-black text-slate-800">{employment.position}</h3>
            )}
            {getVerificationBadge(employment.verificationStatus)}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 mb-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            {isEditing ? (
              <input
                type="text"
                value={draft.company}
                onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))}
                className="font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-full"
              />
            ) : (
              <span className="font-bold">{employment.company}</span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Calendar className="w-5 h-5 text-blue-500" />
            {isEditing ? (
              <div className="flex items-center gap-2 flex-wrap w-full">
                <input
                  type="month"
                  max={currentMonth}
                  value={toMonthInputValue(draft.startDate)}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      startDate: fromMonthInputValue(e.target.value),
                    }))
                  }
                  className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                />
                <span>-</span>
                <input
                  type="month"
                  value={toMonthInputValue(draft.endDate)}
                  disabled={draft.currentlyWorking}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      endDate: fromMonthInputValue(e.target.value),
                    }))
                  }
                  className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white disabled:bg-slate-100"
                />
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={draft.currentlyWorking}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        currentlyWorking: e.target.checked,
                        endDate: e.target.checked ? "" : prev.endDate,
                      }))
                    }
                  />
                  Currently working
                </label>
              </div>
            ) : (
              <span className="font-semibold">
                {employment.startDate} - {employment.currentlyWorking ? "Present" : employment.endDate}
              </span>
            )}
            {!isEditing && employment.startDate && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {calculateDuration(
                  employment.startDate,
                  employment.endDate,
                  employment.currentlyWorking
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={!canEditCard}
              className={`p-2.5 rounded-xl transition-all opacity-0 group-hover/card:opacity-100 duration-200 ${
                canEditCard
                  ? "text-indigo-700 hover:bg-indigo-50 hover:scale-110"
                  : "text-slate-400 bg-slate-100 cursor-not-allowed opacity-100"
              }`}
              title="Edit experience"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(employment.id)}
            disabled={disabled || employment.verificationStatus === "verified"}
            className={`p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover/card:opacity-100 hover:scale-110 duration-200 ${
              disabled || employment.verificationStatus === "verified"
                ? "opacity-40 pointer-events-none"
                : ""
            }`}
            title="Delete Employment Record"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={draft.description}
          onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="text-sm text-slate-600 mt-4 leading-relaxed relative z-10 font-medium w-full bg-white border border-slate-300 rounded-lg px-3 py-2"
          placeholder="Describe your role"
        />
      ) : (
        employment.description && (
          <p className="text-sm text-slate-600 mt-4 leading-relaxed relative z-10 font-medium">
            {employment.description}
          </p>
        )
      )}

      {editError && (
        <p className="text-xs text-rose-600 font-semibold mt-2">{editError}</p>
      )}

      {isEditing && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={saveCardChanges}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={cancelCardEditing}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Documents Section */}
      <div className="mt-6 pt-6 border-t-2 border-slate-200 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-black text-slate-700 flex items-center gap-2">
            <File className="w-4 h-4 text-indigo-600" />
            Supporting Documents
          </h4>
          <button
            type="button"
            onClick={() =>
              document.getElementById(`file-input-${employment.id}`)?.click()
            }
            disabled={!canManageDocuments}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              canManageDocuments
                ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </button>
          <input
            id={`file-input-${employment.id}`}
            ref={documentInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => onDocumentUpload(employment.id, e)}
            className="hidden"
            placeholder="upload documents"
            disabled={!canManageDocuments}
          />
        </div>

        {employment.documents.length === 0 ? (
          <div className="text-center py-6 bg-linear-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-dashed border-amber-200">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-xs font-bold text-amber-700 mb-1">
              No documents uploaded
            </p>
            <p className="text-xs text-amber-600 font-medium">
              Upload offer letter, termination letter, or salary slips
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {employment.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-indigo-300 transition-all group/doc"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.url && (
                    <>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all ${
                          disabled ? "opacity-40 pointer-events-none" : ""
                        }`}
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={doc.url}
                        download={doc.name}
                        className={`p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all ${
                          disabled ? "opacity-40 pointer-events-none" : ""
                        }`}
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  {!doc.url && (
                    <span className="text-xs text-amber-600 font-semibold px-2 py-1 bg-amber-50 rounded">
                      Not uploaded yet
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onDocumentRemove(employment.id, doc.id)}
                    disabled={!canManageDocuments}
                    className={`p-2 rounded-lg transition-all ${
                      canManageDocuments
                        ? "text-rose-600 hover:bg-rose-100"
                        : "text-slate-400 bg-slate-100 cursor-not-allowed"
                    }`}
                    title="Remove document"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {employment.verificationStatus === "draft" && (
        <div className="mt-4 pt-4 border-t-2 border-slate-200 relative z-10">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
            <p className="text-sm text-amber-700 font-bold flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              Action Required
            </p>
            <p className="text-xs text-amber-600 font-semibold">
              {employment.documents.length > 0 
                ? "Don't forget to click 'Save Profile' at the top to upload your documents and submit for verification!"
                : "Upload supporting documents (offer letter, termination letter, or salary slips), then save your profile to submit for verification."}
            </p>
          </div>
        </div>
      )}

      {employment.verificationStatus === "pending" && (
        <div className="mt-4 pt-4 border-t-2 border-slate-200 relative z-10">
          <p className="text-xs text-blue-700 font-bold flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Documents submitted - Awaiting admin verification
          </p>
        </div>
      )}

      {employment.verificationStatus === "rejected" &&
        employment.rejectionReason && (
          <div className="mt-4 pt-4 border-t-2 border-slate-200 relative z-10">
            <div className="bg-rose-50 px-4 py-3 rounded-lg border border-rose-200">
              <p className="text-xs text-rose-700 font-black mb-1 flex items-center gap-2">
                <X className="w-4 h-4" />
                Verification Rejected
              </p>
              <p className="text-xs text-rose-600 font-semibold">
                Reason: {employment.rejectionReason}
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Re-upload Documents
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
