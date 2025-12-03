"use client";

import React from "react";
import {
  Building2,
  Calendar,
  Trash,
  File,
  Upload,
  AlertCircle,
  FileText,
  Eye,
  Download,
  X,
} from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import { getVerificationBadge, formatFileSize } from "@/lib/utils";

interface EmploymentCardProps {
  employment: EmploymentRecord;
  onDelete: (id: string) => void;
  onDocumentUpload: (empId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentRemove: (empId: string, docId: string) => void;
  documentInputRef: (el: HTMLInputElement | null) => void;
  disabled?: boolean;
}

export default function EmploymentCard({
  employment,
  onDelete,
  onDocumentUpload,
  onDocumentRemove,
  documentInputRef,
  disabled = false,
}: EmploymentCardProps) {
  return (
    <div className="group/card relative p-6 bg-linear-to-br from-white via-slate-50 to-blue-50/30 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-100 to-transparent rounded-full blur-3xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-500"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="text-xl font-black text-slate-800">
              {employment.position}
            </h3>
            {getVerificationBadge(employment.verificationStatus)}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 mb-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span className="font-bold">{employment.company}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">
              {employment.startDate} -{" "}
              {employment.currentlyWorking ? "Present" : employment.endDate}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(employment.id)}
          disabled={disabled}
          className={`p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover/card:opacity-100 hover:scale-110 duration-200 ${
            disabled ? "opacity-40 pointer-events-none" : ""
          }`}
          title="Delete Employment Record"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {employment.description && (
        <p className="text-sm text-slate-600 mt-4 leading-relaxed relative z-10 font-medium">
          {employment.description}
        </p>
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
            onClick={() => document.getElementById(`file-input-${employment.id}`)?.click()}
            disabled={disabled}
            className={`inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs font-bold ${
              disabled ? "opacity-40 pointer-events-none" : ""
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
            disabled={disabled}
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
                  <button
                    type="button"
                    className={`p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all ${
                      disabled ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="View document"
                    disabled={disabled}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className={`p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all ${
                      disabled ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Download document"
                    disabled={disabled}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDocumentRemove(employment.id, doc.id)}
                    className={`p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all ${
                      disabled ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Remove document"
                    disabled={disabled}
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
          <p className="text-xs text-amber-700 font-bold flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Upload documents to submit for verification
          </p>
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