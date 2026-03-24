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
  Award,
  Star,
  FileText,
  Link,
} from "lucide-react";
import { CompanyDetailData } from "@/types/admin.types";
import { AdminService } from "@/services/api/admin.service";
import Swal from "sweetalert2";

export default function CompanyDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params?.companyId as string;

  const [company, setCompany] = useState<CompanyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (companyId) fetchCompanyDetails();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      const token = await getToken();
      const response = await AdminService.getCompanyById(token, parseInt(companyId));
      setCompany(response.data.company);
    } catch (error) {
      console.error("Error fetching company:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch company details",
        confirmButtonColor: "#F97316",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!company?.employer) return;

    const result = await Swal.fire({
      title: "Verify Company?",
      text: `This will mark ${company.name} as verified.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, verify",
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.verifyEmployer(token, company.employer.employerId);
        await Swal.fire({
          icon: "success",
          title: "Verified!",
          text: `${company.name} has been verified successfully.`,
          confirmButtonColor: "#10B981",
        });
        fetchCompanyDetails();
      } catch (error) {
        console.error("Error verifying:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to verify company", confirmButtonColor: "#F97316" });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!company?.employer) return;

    const result = await Swal.fire({
      title: "Reject Verification?",
      text: "This will mark the company as unverified.",
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (optional)",
      inputPlaceholder: "Enter reason for rejection...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, reject",
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.rejectEmployer(token, company.employer.employerId, result.value);
        await Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Verification has been rejected.",
          confirmButtonColor: "#F97316",
        });
        fetchCompanyDetails();
      } catch (error) {
        console.error("Error rejecting:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to reject verification", confirmButtonColor: "#F97316" });
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Building2 className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">Company not found</p>
        <button
          onClick={() => router.push("/admin/admindashboard/companies")}
          className="mt-4 text-[#0C2B4E] hover:text-[#F97316] font-medium"
        >
          ← Back to Companies
        </button>
      </div>
    );
  }

  const totalApplications = company.jobs?.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  ) || 0;

  const activeJobs = company.jobs?.filter((j) => j.status === "active").length || 0;

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/admindashboard/companies")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#0C2B4E] transition-colors fade-in"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Companies</span>
      </button>

      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">Company Details</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Company Logo */}
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 rounded-2xl object-contain bg-gray-50 border border-gray-200 p-1"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] flex items-center justify-center text-white text-2xl font-bold">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-[#0C2B4E] mb-1">{company.name}</h1>
              <p className="text-gray-600">{company.industry} · ID: {company.id}</p>
            </div>
          </div>

          {/* Verification Badge */}
          <div>
            {company.isVerified ? (
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Company Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#0C2B4E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C2B4E]">Company Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Industry</label>
                <p className="text-base font-semibold text-gray-900">{company.industry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-base text-gray-900">{company.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Employees</label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-base text-gray-900">{company.employees?.toLocaleString() || "—"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Rating</label>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <p className="text-base text-gray-900">{company.rating?.toFixed(1) || "—"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Registered</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-base text-gray-900">
                    {new Date(company.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {company.linkedinUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">LinkedIn</label>
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0C2B4E] hover:text-[#F97316] transition-colors text-sm font-medium"
                  >
                    <Link className="w-4 h-4" />
                    View Profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {company.description && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Description</label>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4">
                  {company.description}
                </p>
              </div>
            )}
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#F97316]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C2B4E]">Job Listings</h2>
              <span className="ml-auto text-sm text-gray-500 font-medium">
                {company.jobs?.length || 0} total
              </span>
            </div>

            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-3">
                {company.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(job.createdAt).toLocaleDateString()} ·{" "}
                        {job.applications?.length || 0} application{job.applications?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No jobs posted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Employer Info */}
          {company.employer && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0C2B4E]" />
                </div>
                <h2 className="text-xl font-bold text-[#0C2B4E]">Employer</h2>
              </div>

              <div className="space-y-4">
                {company.employer.companyName && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Profile Name</label>
                    <p className="text-sm font-semibold text-gray-900">{company.employer.companyName}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-900 truncate">{company.employer.user.email}</p>
                  </div>
                </div>
                {company.employer.companyURL && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Website</label>
                    <a
                      href={company.employer.companyURL.startsWith("http") ? company.employer.companyURL : `https://${company.employer.companyURL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#0C2B4E] hover:text-[#F97316] transition-colors font-medium"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-[160px]">
                        {company.employer.companyURL.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
                {company.employer.linkedinUrl && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">LinkedIn</label>
                    <a
                      href={company.employer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#0C2B4E] hover:text-[#F97316] transition-colors font-medium"
                    >
                      <Link className="w-4 h-4 shrink-0" />
                      View Profile
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/admin/admindashboard/employers/${company.employer!.employerId}`)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#0C2B4E] text-[#0C2B4E] rounded-xl hover:bg-[#0C2B4E] hover:text-white transition-all text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    View Employer Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {company.employer && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#F97316]" />
                </div>
                <h2 className="text-xl font-bold text-[#0C2B4E]">Verification</h2>
              </div>

              <div className="space-y-3">
                {!company.isVerified && (
                  <button
                    onClick={handleVerify}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Verify Company
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      {company.isVerified ? "Revoke Verification" : "Reject"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] rounded-2xl p-6 text-white shadow-md fade-in animation-delay-300">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Total Jobs</span>
                <span className="text-2xl font-bold">{company.jobs?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Active Jobs</span>
                <span className="text-2xl font-bold">{activeJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Applications</span>
                <span className="text-2xl font-bold">{totalApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Employees</span>
                <span className="text-2xl font-bold">{company.employees?.toLocaleString() || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
