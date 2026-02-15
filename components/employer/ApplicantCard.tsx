"use client";

import React, { useState } from "react";
import { JobApplication, ApplicationStatus } from "@/types/application.types";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  Phone,
  Linkedin,
  Globe,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { updateApplicationStatus } from "@/services/api/employer.service";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";

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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
  interviewed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  hired: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function ApplicantCard({
  application,
  onStatusUpdate,
  getToken,
  style,
}: ApplicantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { applicant } = application;

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
      className="group bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden animate-smooth-enter"
      style={style}
    >
      {/* Main Info */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <Link
            href={`/profile/${applicant.id}`}
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
                {/* Quick Action Buttons */}
                {application.status !== "hired" &&
                  application.status !== "rejected" && (
                    <>
                      <button
                        onClick={() => handleStatusChange("hired")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title="Accept Candidate"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange("rejected")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title="Reject Candidate"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                {/* Status Dropdown */}
                <select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as ApplicationStatus)
                  }
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    statusColors[application.status]
                  }`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <a
                  href={`mailto:${applicant.email}`}
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Globe className="w-4 h-4" />
                  Portfolio
                </a>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-6 bg-slate-50 animate-fade-in-up">
          {application.coverLetter && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Cover Letter
              </h4>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {applicant.skills && applicant.skills.length > 5 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                All Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.notes && (
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Notes</h4>
              <p className="text-slate-600 italic">{application.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
