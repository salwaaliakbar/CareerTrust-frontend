"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
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
      alert("Please select your response");
      return;
    }

    if (response === "decline" && !reason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(response, reason);
      onClose();
    } catch (error) {
      console.error("Failed to submit response:", error);
      alert("Failed to submit your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🎊 Job Offer Response</h2>
            <p className="text-blue-100 text-sm mt-1">
              Congratulations on your offer!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Details */}
          <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm text-gray-600 mb-2">
              You&apos;ve been offered:
            </p>
            <h3 className="text-xl font-bold text-gray-900">{jobTitle}</h3>
            <p className="text-gray-700 font-medium mt-1">at {companyName}</p>
          </div>

          {/* Currently-employed warning */}
          {isCurrentlyEmployed && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Response *
            </label>

            {/* Accept Option */}
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                isCurrentlyEmployed
                  ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                  : response === "accept"
                    ? "border-green-500 bg-green-50 cursor-pointer"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50/30 cursor-pointer"
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
                  className={`w-6 h-6 ${response === "accept" ? "text-green-600" : "text-gray-400"}`}
                />
                <div>
                  <p className="font-semibold text-gray-900">Accept Offer</p>
                  <p className="text-sm text-gray-600">
                    {isCurrentlyEmployed
                      ? "Leave your current job first to accept"
                      : "I'm excited to join the team!"}
                  </p>
                </div>
              </div>
            </label>

            {/* Decline Option */}
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                response === "decline"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"
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
                  className={`w-6 h-6 ${response === "decline" ? "text-red-600" : "text-gray-400"}`}
                />
                <div>
                  <p className="font-semibold text-gray-900">Decline Offer</p>
                  <p className="text-sm text-gray-600">
                    I appreciate the offer, but...
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Reason Field (shown when declining) */}
          {response === "decline" && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-sm font-semibold text-gray-700">
                Reason for Declining *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all resize-none"
                rows={4}
                placeholder="Please provide a brief reason for declining this offer..."
                required
              />
              <p className="text-xs text-gray-500">
                This feedback helps companies improve their hiring process
              </p>
            </div>
          )}

          {/* Message Field (optional for accepting) */}
          {response === "accept" && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-sm font-semibold text-gray-700">
                Message to Employer (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all resize-none"
                rows={3}
                placeholder="Express your excitement or ask any questions..."
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
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
