"use client";

import React, { useState } from "react";
import { JobApplication, ApplicationStatus } from "@/types/application.types";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Download,
  Phone,
  Linkedin,
  Globe,
  Award,
} from "lucide-react";
import { updateApplicationStatus } from "@/services/api/employer.service";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ApplicantCardProps {
  application: JobApplication;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
  getToken?: () => Promise<string | null>;
  style?: React.CSSProperties;
}

const statusOptions: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "reviewing", label: "Reviewing", color: "blue" },
  { value: "shortlisted", label: "Shortlisted", color: "purple" },
  { value: "interviewed", label: "Interviewed", color: "indigo" },
  { value: "hired", label: "Hired", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
];

const terminalStatuses: ApplicationStatus[] = [
  "offer_accepted",
  "offer_declined",
];

const statusColors: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  hired: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  offer_accepted: "bg-emerald-100 text-emerald-700 border-emerald-300",
  offer_declined: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ApplicantCard({
  application,
  onStatusUpdate,
  getToken,
  style,
}: ApplicantCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { applicant } = application;
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/profile/${applicant.id}`);
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (newStatus === application.status) return;

    const statusOption = statusOptions.find((opt) => opt.value === newStatus);
    const result = await Swal.fire({
      title: "Update Status?",
      text: `Change application status to "${statusOption?.label}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      const success = await updateApplicationStatus(
        {
          applicationId: application.id,
          status: newStatus,
        },
        getToken,
      );
      setIsUpdating(false);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Application status has been updated.",
          timer: 2000,
          showConfirmButton: false,
        });
        onStatusUpdate(application.id, newStatus);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not update status. Please try again.",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden animate-smooth-enter cursor-pointer"
      style={style}
    >
      {/* Main Info */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <Link
            href={`/profile/${applicant.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 group/profile cursor-pointer"
            title="View Full Profile"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover/profile:shadow-2xl group-hover/profile:scale-110 transition-all duration-300">
              {applicant.profileImage ? (
                <Image
                  src={applicant.profileImage}
                  alt={applicant.fullName}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                applicant.fullName.charAt(0).toUpperCase()
              )}
            </div>
          </Link>

          {/* Applicant Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
              <div>
                <Link
                  href={`/profile/${applicant.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="group/name"
                  title="View Full Profile"
                >
                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover/name:text-blue-600 transition-colors cursor-pointer">
                    {applicant.fullName}
                  </h3>
                </Link>
                {applicant.headline && (
                  <p className="text-slate-600 font-semibold">
                    {applicant.headline}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Employment Status Badge */}
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    applicant.isCurrentlyEmployed
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-orange-100 text-orange-700 border-orange-300"
                  }`}
                  title={
                    applicant.isCurrentlyEmployed
                      ? "Currently Employed"
                      : "Not Currently Employed"
                  }
                >
                  {applicant.isCurrentlyEmployed
                    ? "🔴 Currently Employed"
                    : "✓ Not Currently Employed"}
                </div>

                {/* Status Dropdown */}
                <select
                  value={application.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(e.target.value as ApplicationStatus);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={
                    isUpdating || terminalStatuses.includes(application.status)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed ${
                    terminalStatuses.includes(application.status)
                      ? ""
                      : "cursor-pointer hover:scale-105"
                  } ${statusColors[application.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {application.status === "offer_accepted" && (
                    <option value="offer_accepted">Offer Accepted</option>
                  )}
                  {application.status === "offer_declined" && (
                    <option value="offer_declined">Offer Declined</option>
                  )}
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <a
                  href={`mailto:${applicant.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-600 transition-colors truncate"
                >
                  {applicant.email}
                </a>
              </div>

              {applicant.location && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{applicant.location}</span>
                </div>
              )}

              {applicant.experience && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>{applicant.experience}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Applied {formatDate(application.appliedDate)}</span>
              </div>

              {applicant.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <a
                    href={`tel:${applicant.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {applicant.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Skills */}
            {applicant.skills && applicant.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 5 && (
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold">
                      +{applicant.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Match Score */}
            {applicant.matchScore !== undefined && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-semibold text-slate-600">
                    Match Score:
                  </span>
                  <div className="flex-1 max-w-xs">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all duration-500"
                        style={{ width: `${applicant.matchScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {applicant.matchScore}%
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {applicant.resumeUrl && (
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white font-semibold hover:from-[#0A2442] hover:to-[#18495E] transition-all shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}

              {applicant.linkedIn && (
                <a
                  href={applicant.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077B5] text-white font-semibold hover:bg-[#006399] transition-colors shadow-md hover:shadow-lg"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}

              {applicant.portfolio && (
                <a
                  href={applicant.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  Portfolio
                </a>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
