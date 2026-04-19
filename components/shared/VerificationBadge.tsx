// components/shared/VerificationBadge.tsx
import React from "react";
import { CheckCircle2, Clock, X, AlertCircle } from "lucide-react";
import { VerificationStatus } from "@/types/jobseeker.types";

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export default function VerificationBadge({ status }: VerificationBadgeProps) {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-linear-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-linear-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
          <Clock className="w-3.5 h-3.5" /> Pending Review
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-linear-to-r from-rose-50 to-rose-100 px-3 py-1.5 rounded-full border border-rose-200 shadow-sm">
          <X className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-linear-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" /> Draft
        </span>
      );
    default:
      return null;
  }
}