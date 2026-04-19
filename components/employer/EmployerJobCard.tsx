"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EmployerJob } from "@/types/application.types";
import {
  Briefcase,
  MapPin,
  Users,
  Eye,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { deleteJob, updateJobStatus } from "@/services/api/employer.service";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface EmployerJobCardProps {
  job: EmployerJob;
  onJobDeleted: (jobId: string | number) => void;
  onJobUpdated: (job: EmployerJob) => void;
  getToken?: () => Promise<string | null>;
}

export default function EmployerJobCard({
  job,
  onJobDeleted,
  onJobUpdated,
  getToken,
}: EmployerJobCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const statusColors = {
    active: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Job?",
      text: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const success = await deleteJob(job.id, getToken);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Job posting has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
        onJobDeleted(job.id);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not delete the job. Please try again.",
        });
      }
    }
    setShowMenu(false);
  };

  const handleToggleStatus = async () => {
    const newStatus = job.status === "active" ? "closed" : "active";
    const actionText = newStatus === "active" ? "activate" : "close";

    const result = await Swal.fire({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Job?`,
      text: `Do you want to ${actionText} this job posting?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: newStatus === "active" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      const success = await updateJobStatus(job.id, newStatus, getToken);
      setIsUpdating(false);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Job has been ${newStatus === "active" ? "activated" : "closed"}.`,
          timer: 2000,
          showConfirmButton: false,
        });
        onJobUpdated({ ...job, status: newStatus });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not update job status. Please try again.",
        });
      }
    }
    setShowMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Status Badge */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            statusColors[job.status]
          }`}
        >
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            disabled={isUpdating}
            aria-label="Open job actions menu"
            title="Open job actions menu"
          >
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push(`/employer/postedJob/edit/${job.id}`);
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Job
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  {job.status === "active" ? (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      Close Job
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Activate Job
                    </>
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Link href={`/employer/jobs/${job.id}/applications`} className="block">
        {/* Job Header */}
        <div className="mb-4 pr-32">
          <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span className="font-semibold">{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{job.jobType}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold">₨</span>
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-600">
                Applications
              </p>
              <p className="text-xl font-black text-slate-900">
                {job.applicationsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-slate-600">Views</p>
              <p className="text-xl font-black text-slate-900">
                {job.viewsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-slate-600">Posted</p>
              <p className="text-sm font-bold text-slate-900">
                {formatDate(job.postedDate)}
              </p>
            </div>
          </div>

          {job.deadline && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-slate-600">Deadline</p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Click to view applicants
            </span>
            <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
              <span>View Details</span>
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
