"use client";

import React, { useState } from "react";
import {
  X,
  LogOut,
  Calendar,
  Building2,
  Briefcase,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import { submitExitRequest } from "@/services/api/exitRequest.service";

interface ExitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  employment: EmploymentRecord;
  getToken?: () => Promise<string | null>;
  /** Called after a successful submission so parent can refresh state */
  onSuccess?: () => void;
}

export default function ExitRequestModal({
  isOpen,
  onClose,
  employment,
  getToken,
  onSuccess,
}: ExitRequestModalProps) {
  const [requestedEndDate, setRequestedEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!requestedEndDate) {
      setError("Please select your requested end date.");
      return;
    }

    setSubmitting(true);
    const result = await submitExitRequest(
      {
        employmentHistoryId: employment.id,
        requestedEndDate,
        reason: reason.trim() || undefined,
      },
      getToken,
    );
    setSubmitting(false);

    if (!result.success) {
      setError(result.message ?? "Failed to submit exit request.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setRequestedEndDate("");
      setReason("");
      onSuccess?.();
      onClose();
    }, 2000);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-rose-500 to-red-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Job Exit Request
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Request confirmation of your departure from this employer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Employment info */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold">{employment.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-semibold">{employment.position}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="font-medium">Since {employment.startDate}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Success state */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-sm font-bold text-emerald-700">
                Exit request submitted! Your employer will be notified.
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          )}

          {/* Requested End Date */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              Requested Last Working Day
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={requestedEndDate}
              onChange={(e) => setRequestedEndDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
              required
            />
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              This is the date you would like your employment to end.
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              Reason for Leaving
              <span className="ml-2 text-xs text-slate-400 font-medium">
                (Optional)
              </span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. Pursuing new opportunities, personal reasons, relocation..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-semibold leading-relaxed">
              When your employer approves this request, your employment end date
              will be automatically set and your &quot;Currently Employed&quot;
              status will be updated.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-rose-500 to-red-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
