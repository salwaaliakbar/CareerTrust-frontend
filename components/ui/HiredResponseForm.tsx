"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Briefcase,
  Building2,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { API_ENDPOINTS } from "@/constants/api";

interface HiredResponseFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  jobTitle: string;
  companyName: string;
  onSubmit: (response: "accept" | "decline", reason?: string) => Promise<void>;
}

const HiredResponseForm: React.FC<HiredResponseFormProps> = ({
  isOpen,
  onClose,
  jobTitle,
  companyName,
  onSubmit,
}) => {
  const { user } = useUser();
  const [response, setResponse] = useState<"accept" | "decline" | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setResponse(null);
      setReason("");
      setValidationError(null);
    }
  }, [isOpen]);

  // Fetch employment status when the form opens
  useEffect(() => {
    if (!isOpen || !user?.id) return;
    fetch(
      `${API_ENDPOINTS.JOBSEEKER_PROFILE_GET}?clerkId=${encodeURIComponent(user.id)}`,
    )
      .then((r) => r.json())
      .then((body) => {
        const data = body?.data ?? body;
        setIsCurrentlyEmployed(!!data?.isCurrentlyEmployed);
      })
      .catch(() => {
        /* silently ignore – default remains false */
      });
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!response) {
      setValidationError("Please select your response before submitting.");
      return;
    }

    if (response === "decline" && !reason.trim()) {
      setValidationError("Please provide a reason for declining this offer.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(response, reason);
      onClose();
    } catch (error) {
      console.error("Failed to submit response:", error);
      setValidationError("Failed to submit your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 sm:p-6">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-[0_24px_70px_-18px_rgba(15,23,42,0.55)] border border-blue-100">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-[#0E2A5A] via-[#123C76] to-[#18508F] text-white px-5 sm:px-6 py-4 sm:py-5 rounded-t-3xl flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Offer Decision
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
              Job Offer Response
            </h2>
            <p className="text-blue-100/90 text-sm mt-1">
              Review the offer details and submit your final decision.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-white/85 hover:text-white transition-colors p-2 rounded-full hover:bg-white/15"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 sm:space-y-6">
          {/* Job Details */}
          <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-slate-600 mb-2 font-medium">
              You&apos;ve been offered:
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-start gap-2.5">
              <Briefcase className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" />
              <span>{jobTitle}</span>
            </h3>
            <p className="text-slate-700 font-medium mt-2 flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-slate-500" />
              <span>{companyName}</span>
            </p>
          </div>

          {/* Currently-employed warning */}
          {isCurrentlyEmployed && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">You are currently employed</p>
                <p>
                  You must leave your current job before accepting a new offer.
                  Please submit an{" "}
                  <Link
                    href="/jobseeker/exit-request"
                    className="underline font-semibold hover:text-amber-900"
                    onClick={onClose}
                  >
                    Exit Request
                  </Link>{" "}
                  first. Once your exit is approved and your employment status
                  is updated, you can return here to accept this offer.
                </p>
              </div>
            </div>
          )}

          {/* Response Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Your Response *
            </label>

            {/* Accept Option */}
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-2xl transition-all ${
                isCurrentlyEmployed
                  ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                  : response === "accept"
                    ? "border-emerald-500 bg-emerald-50 cursor-pointer shadow-[0_10px_24px_-18px_rgba(5,150,105,0.9)]"
                    : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="response"
                value="accept"
                checked={response === "accept"}
                onChange={() => !isCurrentlyEmployed && setResponse("accept")}
                disabled={isCurrentlyEmployed}
                className="w-5 h-5 text-green-600"
              />
              <div className="flex items-center gap-3 flex-1">
                <CheckCircle
                  className={`w-6 h-6 ${response === "accept" ? "text-emerald-600" : "text-gray-400"}`}
                />
                <div>
                  <p className="font-semibold text-slate-900">Accept Offer</p>
                  <p className="text-sm text-slate-600">
                    {isCurrentlyEmployed
                      ? "Leave your current job first to accept"
                      : "I'm excited to join the team!"}
                  </p>
                </div>
              </div>
            </label>

            {/* Decline Option */}
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                response === "decline"
                  ? "border-rose-500 bg-rose-50 shadow-[0_10px_24px_-18px_rgba(225,29,72,0.9)]"
                  : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/30"
              }`}
            >
              <input
                type="radio"
                name="response"
                value="decline"
                checked={response === "decline"}
                onChange={() => setResponse("decline")}
                className="w-5 h-5 text-red-600"
              />
              <div className="flex items-center gap-3 flex-1">
                <XCircle
                  className={`w-6 h-6 ${response === "decline" ? "text-rose-600" : "text-gray-400"}`}
                />
                <div>
                  <p className="font-semibold text-slate-900">Decline Offer</p>
                  <p className="text-sm text-slate-600">
                    I appreciate the offer, but...
                  </p>
                </div>
              </div>
            </label>
          </div>

          {validationError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {validationError}
            </div>
          )}

          {/* Reason Field (shown when declining) */}
          {response === "decline" && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-sm font-semibold text-slate-700">
                Reason for Declining *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all resize-none"
                rows={4}
                placeholder="Please provide a brief reason for declining this offer..."
                required
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">
                This feedback helps companies improve their hiring process
                </p>
                <span className="text-xs text-slate-400">{reason.length}/500</span>
              </div>
            </div>
          )}

          {/* Message Field (optional for accepting) */}
          {response === "accept" && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-sm font-semibold text-slate-700">
                Message to Employer (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
                rows={3}
                placeholder="Express your excitement or ask any questions..."
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2 ${
                response === "accept"
                  ? "bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  : response === "decline"
                    ? "bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={
                !response ||
                isSubmitting ||
                (response === "accept" && isCurrentlyEmployed)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {response === "accept" && <CheckCircle className="w-5 h-5" />}
                  {response === "decline" && <XCircle className="w-5 h-5" />}
                  {response === "accept"
                    ? "Accept Offer"
                    : response === "decline"
                      ? "Decline Offer"
                      : "Submit Response"}
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Note: Your response will be sent directly to the employer
          </p>
        </form>
      </div>
    </div>
  );
};

export default HiredResponseForm;
