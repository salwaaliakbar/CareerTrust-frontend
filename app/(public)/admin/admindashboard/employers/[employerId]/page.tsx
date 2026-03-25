"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  Award
} from "lucide-react";
import { EmployerDetailData } from "@/types/admin.types";
import { AdminService } from "@/services/api/admin.service";
import Swal from "sweetalert2";

export default function EmployerDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employerId = params?.employerId as string;

  const [employer, setEmployer] = useState<EmployerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (employerId) {
      fetchEmployerDetails();
    }
  }, [employerId]);

  const fetchEmployerDetails = async () => {
    try {
      const token = await getToken();
      const response = await AdminService.getEmployerById(token, parseInt(employerId));
      setEmployer(response.data.employer);
    } catch (error) {
      console.error("Error fetching employer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch employer details",
        confirmButtonColor: "#F97316",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const result = await Swal.fire({
      title: "Verify Employer?",
      text: "This will mark the employer's company as verified.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, verify",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.verifyEmployer(token, parseInt(employerId));
        
        await Swal.fire({
          icon: "success",
          title: "Verified!",
          text: "Employer has been verified successfully.",
          confirmButtonColor: "#10B981",
        });

        fetchEmployerDetails();
      } catch (error) {
        console.error("Error verifying employer:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to verify employer",
          confirmButtonColor: "#F97316",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Verification?",
      text: "This will mark the employer's company as not verified.",
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (optional)",
      inputPlaceholder: "Enter reason for rejection...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        return null; // Allow empty reason
      },
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.rejectEmployer(token, parseInt(employerId), result.value);
        
        await Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Verification has been rejected.",
          confirmButtonColor: "#F97316",
        });

        fetchEmployerDetails();
      } catch (error) {
        console.error("Error rejecting employer:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reject verification",
          confirmButtonColor: "#F97316",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Building2 className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">Employer not found</p>
        <button
          onClick={() => router.push("/admin/admindashboard/employers")}
          className="mt-4 text-[#F97316] hover:text-[#EA580C] font-medium"
        >
          ← Back to Employers
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#F97316]/12 via-[#EA580C]/8 to-transparent pointer-events-none" />
      
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/admindashboard/employers")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#F97316] transition-colors fade-in"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Employers</span>
      </button>

      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          <span className="text-sm font-semibold text-[#F97316]">Employer Details</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">
              {employer.company?.name || employer.companyName || "Unnamed Employer"}
            </h1>
            <p className="text-gray-600">Employer ID: {employer.employerId}</p>
          </div>
          
          {/* Verification Badge */}
          {employer.company && (
            <div>
              {employer.company.isVerified ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-xl">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-700">Pending Verification</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          {employer.company && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#F97316]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0C2B4E]">Company Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Company Name</label>
                  <p className="text-lg font-semibold text-gray-900">{employer.company.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Industry</label>
                  <p className="text-lg text-gray-900">{employer.company.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-lg text-gray-900">{employer.company.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Registered</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg text-gray-900">
                      {new Date(employer.company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {employer.linkedinUrl && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">LinkedIn</label>
                  <a
                    href={employer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#0C2B4E] hover:text-[#F97316] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View LinkedIn Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Jobs Posted */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#0C2B4E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C2B4E]">Posted Jobs</h2>
            </div>

            {employer.jobs && employer.jobs.length > 0 ? (
              <div className="space-y-3">
                {employer.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-600">Status: {job.status}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No jobs posted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0C2B4E]" />
              </div>
              <h2 className="text-xl font-bold text-[#0C2B4E]">Contact</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{employer.user.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">User ID</label>
                <p className="text-sm text-gray-900">{employer.user.userId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Clerk ID</label>
                <p className="text-sm text-gray-900 font-mono text-xs">{employer.user.clerkId}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {employer.company && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#F97316]" />
                </div>
                <h2 className="text-xl font-bold text-[#0C2B4E]">Actions</h2>
              </div>

              <div className="space-y-3">
                {!employer.company.isVerified && (
                  <button
                    onClick={handleVerify}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Verify Employer
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      {employer.company.isVerified ? "Revoke Verification" : "Reject"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl p-6 text-white shadow-md fade-in animation-delay-300">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Total Jobs</span>
                <span className="text-2xl font-bold">{employer.jobs?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Active Jobs</span>
                <span className="text-2xl font-bold">
                  {employer.jobs?.filter((j) => j.status === "active").length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Member Since</span>
                <span className="font-semibold">
                  {new Date(employer.createdAt).toLocaleDateString("en-US", { 
                    month: "short", 
                    year: "numeric" 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
