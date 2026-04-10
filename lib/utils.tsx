import { CheckCircle2, Clock, X, AlertCircle } from "lucide-react";
import { VerificationStatus } from "@/types/jobseeker.types";

export function getVerificationBadge(status: VerificationStatus) {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-linear-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-linear-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
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

export function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

/**
 * Calculate duration between two MM/YYYY dates.
 * Returns a string like "2 yrs 3 mos" or "8 mos".
 */
export function calculateDuration(
  startDate: string,
  endDate: string,
  currentlyWorking: boolean
): string {
  if (!startDate) return "";

  const parseMMYYYY = (dateStr: string): Date | null => {
    const parts = dateStr.split("/");
    if (parts.length !== 2) return null;
    const month = parseInt(parts[0], 10) - 1;
    const year = parseInt(parts[1], 10);
    if (isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, 1);
  };

  const start = parseMMYYYY(startDate);
  if (!start) return "";

  const end = currentlyWorking ? new Date() : parseMMYYYY(endDate);
  if (!end) return "";

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (totalMonths < 0) return "";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months !== 1 ? "s" : ""}`);
  return parts.length > 0 ? parts.join(" ") : "< 1 mo";
}