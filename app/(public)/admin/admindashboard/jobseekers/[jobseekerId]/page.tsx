"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Download,
  Shield,
  Award,
  RefreshCw,
} from "lucide-react";
import { AdminService } from "@/services/api/admin.service";
import Swal from "sweetalert2";
import { useSocket } from "@/hooks/useSocket";

interface JobseekerDetailData {
  jobseekerId: number;
  clerkId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  location: string | null;
  totalExperience: string | null;
  totalExperienceYears: number;
  summary: string | null;
  highestDegree: string | null;
  profilePicUrl: string | null;
  resumeUrl: string | null;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  employmentHistory: EmploymentRecord[];
  educationHistory: EducationRecord[];
  skills: SkillRecord[];
  applications: ApplicationRecord[];
}

interface EmploymentDocumentRecord {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

interface EmploymentRecord {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currentlyWorking?: boolean;
  description?: string | null;
  verified?: boolean;
  verificationStatus?: string | null;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  documents?: EmploymentDocumentRecord[];
}

interface EducationRecord {
  id: number;
  institution: string;
  degree: string;
  startDate?: string | null;
  endDate?: string | null;
  verified?: boolean;
  verificationStatus?: string | null;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  documents?: EmploymentDocumentRecord[];
}

interface SkillRecord {
  id: number;
  skillName: string;
}

interface ApplicationRecord {
  id: number;
}

interface JobseekerHistoryUpdatedEvent {
  jobseekerId?: number;
  clerkId?: string;
  employmentHistoryChanged?: boolean;
  educationHistoryChanged?: boolean;
  updatedAt?: string;
}

function toMonthIndex(value?: string | null): number {
  const raw = (value || "").trim();
  if (!raw) return 0;

  const monthYear = raw.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
  if (monthYear) {
    return Number(monthYear[2]) * 12 + Number(monthYear[1]);
  }

  const yearMonth = raw.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (yearMonth) {
    return Number(yearMonth[1]) * 12 + Number(yearMonth[2]);
  }

  if (/^\d{4}$/.test(raw)) {
    return Number(raw) * 12 + 1;
  }

  return 0;
}

function getStatusRank(status?: string | null, verified?: boolean): number {
  const normalized = status || (verified ? "verified" : "pending");
  if (normalized === "pending") return 0;
  if (normalized === "verified") return 1;
  if (normalized === "rejected") return 2;
  return 3;
}

function sortByVerificationPriorityAndDate<T extends {
  startDate?: string | null;
  verificationStatus?: string | null;
  verified?: boolean;
}>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const rankA = getStatusRank(a.verificationStatus, a.verified);
    const rankB = getStatusRank(b.verificationStatus, b.verified);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return toMonthIndex(b.startDate) - toMonthIndex(a.startDate);
  });
}

export default function JobseekerDetailPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const jobseekerId = params?.jobseekerId as string;

  const [jobseeker, setJobseeker] = useState<JobseekerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { on, off } = useSocket({
    clerkId: user?.id,
    role: "admin",
  });

  const fetchJobseekerDetails = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    try {
      const token = await getToken();
      const response = await AdminService.getJobseekerById(token, parseInt(jobseekerId));
      const jobseekerData =
        response.data.jobseeker as unknown as JobseekerDetailData;
      console.log("Jobseeker data:", jobseekerData);
      console.log("Employment history:", jobseekerData?.employmentHistory);
      (jobseekerData?.employmentHistory || []).forEach((emp: EmploymentRecord, idx: number) => {
        console.log(`Employment ${idx + 1} documents:`, emp.documents);
      });
      setJobseeker(jobseekerData);
    } catch (error) {
      console.error("Error fetching jobseeker:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch jobseeker details",
        confirmButtonColor: "#0C2B4E",
      });
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [getToken, jobseekerId]);

  useEffect(() => {
    if (jobseekerId) {
      fetchJobseekerDetails();
    }
  }, [jobseekerId, fetchJobseekerDetails]);

  useEffect(() => {
    const targetJobseekerId = Number.parseInt(jobseekerId, 10);

    const onJobseekerHistoryUpdated = (payload?: JobseekerHistoryUpdatedEvent) => {
      if (!payload?.jobseekerId) return;
      if (Number(payload.jobseekerId) !== targetJobseekerId) return;

      fetchJobseekerDetails();
    };

    on("jobseeker_profile_history_updated", onJobseekerHistoryUpdated);

    return () => {
      off("jobseeker_profile_history_updated", onJobseekerHistoryUpdated);
    };
  }, [on, off, fetchJobseekerDetails, jobseekerId]);

  const handleVerifyEmployment = async (employmentId: string, company: string) => {
    const result = await Swal.fire({
      title: "Verify Employment?",
      text: `This will mark employment at ${company} as verified.`,
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
        await AdminService.verifyEmployment(token, employmentId);

        await Swal.fire({
          icon: "success",
          title: "Verified!",
          text: "Employment has been verified successfully.",
          confirmButtonColor: "#10B981",
        });

        fetchJobseekerDetails();
      } catch (error) {
        console.error("Error verifying employment:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to verify employment",
          confirmButtonColor: "#0C2B4E",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRejectEmployment = async (employmentId: string, company: string) => {
    const result = await Swal.fire({
      title: "Reject Employment?",
      html: `
        <p>This will mark employment at <strong>${company}</strong> as rejected.</p>
        <p class="text-gray-600 text-sm mt-2">The jobseeker will see your reason and can update their details.</p>
      `,
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (Required)",
      inputPlaceholder: "e.g., Documents are unclear, dates don't match, need more proof...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Please provide a reason for rejection!";
        }
        return null;
      },
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.rejectEmployment(token, employmentId, result.value);

        await Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Employment has been rejected. Jobseeker will be notified.",
          confirmButtonColor: "#0C2B4E",
        });

        fetchJobseekerDetails();
      } catch (error) {
        console.error("Error rejecting employment:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reject employment",
          confirmButtonColor: "#0C2B4E",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleVerifyEducation = async (educationId: number, degree: string) => {
    const result = await Swal.fire({
      title: "Verify Education?",
      text: `This will mark ${degree} as verified.`,
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
        await AdminService.verifyEducation(token, educationId);

        await Swal.fire({
          icon: "success",
          title: "Verified!",
          text: "Education has been verified successfully.",
          confirmButtonColor: "#10B981",
        });

        fetchJobseekerDetails();
      } catch (error) {
        console.error("Error verifying education:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to verify education",
          confirmButtonColor: "#0C2B4E",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRejectEducation = async (educationId: number, degree: string) => {
    const result = await Swal.fire({
      title: "Reject Education?",
      html: `
        <p>This will mark <strong>${degree}</strong> as rejected.</p>
        <p class="text-gray-600 text-sm mt-2">The jobseeker will see your reason and can update the record.</p>
      `,
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (Required)",
      inputPlaceholder: "e.g., Degree name mismatch, incomplete details, invalid date range...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Please provide a reason for rejection!";
        }
        return null;
      },
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const token = await getToken();
        await AdminService.rejectEducation(token, educationId, result.value);

        await Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Education has been rejected. Jobseeker will be notified.",
          confirmButtonColor: "#0C2B4E",
        });

        fetchJobseekerDetails();
      } catch (error) {
        console.error("Error rejecting education:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reject education",
          confirmButtonColor: "#0C2B4E",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const getVerificationBadge = (status: string, verified: boolean) => {
    if (status === "verified" && verified) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Verified</span>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 border border-red-200 rounded-lg">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-semibold text-red-700">Rejected</span>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">Pending Review</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Draft</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
      </div>
    );
  }

  if (!jobseeker) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">Jobseeker not found</p>
        <button
          onClick={() => router.push("/admin/admindashboard/jobseekers")}
          className="mt-4 text-[#0C2B4E] hover:text-[#1A3D64] font-medium"
        >
          ← Back to Jobseekers
        </button>
      </div>
    );
  }

  const verifiedCount = jobseeker.employmentHistory.filter(e => e.verified).length;
  const pendingCount = jobseeker.employmentHistory.filter(e => e.verificationStatus === "pending").length;
  const rejectedCount = jobseeker.employmentHistory.filter(e => e.verificationStatus === "rejected").length;
  const verifiedEducationCount = jobseeker.educationHistory.filter((e) => e.verificationStatus === "verified" || e.verified).length;
  const pendingEducationCount = jobseeker.educationHistory.filter((e) => (e.verificationStatus || "pending") === "pending").length;
  const rejectedEducationCount = jobseeker.educationHistory.filter((e) => e.verificationStatus === "rejected").length;
  const sortedEmploymentHistory = sortByVerificationPriorityAndDate(jobseeker.employmentHistory);
  const sortedEducationHistory = sortByVerificationPriorityAndDate(jobseeker.educationHistory);

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -left-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />

      {/* Back Button and Refresh */}
      <div className="mb-6 flex items-center justify-between fade-in">
        <button
          onClick={() => router.push("/admin/admindashboard/jobseekers")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0C2B4E] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Jobseekers</span>
        </button>

        <button
          onClick={() => fetchJobseekerDetails(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">Jobseeker Profile & Verification</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">
              {jobseeker.fullName || "Unnamed Jobseeker"}
            </h1>
            <p className="text-gray-600">{jobseeker.headline || "No headline"}</p>
          </div>

          {/* Profile Status Badge */}
          <div>
            {jobseeker.isProfileComplete ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Profile Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-700">Incomplete Profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 fade-in animation-delay-100">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employment</p>
              <p className="text-2xl font-bold text-[#0C2B4E]">{jobseeker.employmentHistory.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-[#0C2B4E]/20" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
            </div>
            <Shield className="w-8 h-8 text-green-600/20" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600/20" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600/20" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Education</p>
              <p className="text-2xl font-bold text-amber-600">{pendingEducationCount}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-amber-600/20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#0C2B4E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C2B4E]">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                <p className="text-lg font-semibold text-gray-900">{jobseeker.fullName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-lg text-gray-900">{jobseeker.email || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-lg text-gray-900">{jobseeker.phone || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-lg text-gray-900">{jobseeker.location || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Total Experience</label>
                <p className="text-lg text-gray-900">{jobseeker.totalExperience || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Highest Degree</label>
                <p className="text-lg text-gray-900">{jobseeker.highestDegree || "N/A"}</p>
              </div>
            </div>

            {jobseeker.summary && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Summary</label>
                <p className="text-gray-700 leading-relaxed">{jobseeker.summary}</p>
              </div>
            )}
          </div>

          {/* Employment History with Verification */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#0C2B4E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C2B4E]">Employment History & Verification</h2>
            </div>

            {jobseeker.employmentHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p>No employment history added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedEmploymentHistory.map((employment) => (
                  <div
                    key={employment.id}
                    className="border border-gray-200 rounded-xl p-5 hover:border-[#0C2B4E]/30 transition-all"
                  >
                    {/* Employment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{employment.position}</h3>
                        <p className="text-[#0C2B4E] font-semibold mb-2">{employment.company}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {employment.location || "Remote"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {employment.startDate} - {employment.currentlyWorking ? "Present" : employment.endDate}
                          </div>
                        </div>
                      </div>
                      {getVerificationBadge(employment.verificationStatus, employment.verified)}
                    </div>

                    {/* Description */}
                    {employment.description && (
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{employment.description}</p>
                    )}

                    {/* Rejection context (kept after resubmission) */}
                    {(employment.verificationStatus === "rejected" ||
                      employment.verificationStatus === "pending") &&
                      employment.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900 mb-1">
                              {employment.verificationStatus === "pending"
                                ? "Previous Rejection Reason:"
                                : "Rejection Reason:"}
                            </p>
                            <p className="text-red-700 text-sm">{employment.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Supporting Documents ({employment.documents?.length || 0})
                      </p>
                      {employment.documents && employment.documents.length > 0 ? (
                        <div className="space-y-2">
                          {employment.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">{doc.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {doc.url && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#0C2B4E]/10 text-[#0C2B4E] hover:bg-[#0C2B4E] hover:text-white transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No documents uploaded for this employment</p>
                        </div>
                      )}
                    </div>

                    {/* Verification Actions */}
                    {employment.verificationStatus !== "verified" && (
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleVerifyEmployment(employment.id, employment.company)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Verify Employment
                        </button>
                        <button
                          onClick={() => handleRejectEmployment(employment.id, employment.company)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Employment
                        </button>
                      </div>
                    )}

                    {employment.verified && employment.verifiedAt && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          Verified on {new Date(employment.verifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-400">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#0C2B4E]" />
              </div>
              <h2 className="text-xl font-bold text-[#0C2B4E]">Skills</h2>
            </div>
            {jobseeker.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {jobseeker.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-[#0C2B4E]/10 text-[#0C2B4E] rounded-lg text-sm font-medium"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#0C2B4E]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0C2B4E]">Education</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Verified: {verifiedEducationCount} • Pending: {pendingEducationCount} • Rejected: {rejectedEducationCount}
                </p>
              </div>
            </div>
            {jobseeker.educationHistory.length > 0 ? (
              <div className="space-y-4">
                {sortedEducationHistory.map((edu) => (
                  <div key={edu.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-[#0C2B4E] text-sm mb-1">{edu.institution}</p>
                        <p className="text-gray-600 text-xs">
                          {edu.startDate || "N/A"} - {edu.endDate || "Present"}
                        </p>
                      </div>
                      <div>
                        {getVerificationBadge(
                          edu.verificationStatus || "pending",
                          Boolean(edu.verified),
                        )}
                      </div>
                    </div>

                    {(edu.verificationStatus === "rejected" ||
                      edu.verificationStatus === "pending") &&
                      edu.rejectionReason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-900 mb-1">
                          {edu.verificationStatus === "pending"
                            ? "Previous Rejection Reason"
                            : "Rejection Reason"}
                        </p>
                        <p className="text-xs text-red-700">{edu.rejectionReason}</p>
                      </div>
                    )}

                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4" />
                        Supporting Documents ({edu.documents?.length || 0})
                      </p>
                      {edu.documents && edu.documents.length > 0 ? (
                        <div className="space-y-2">
                          {edu.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                            >
                              <div>
                                <p className="text-xs font-medium text-gray-900">{doc.name}</p>
                                <p className="text-[11px] text-gray-500">
                                  {(doc.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              {doc.url && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#0C2B4E]/10 text-[#0C2B4E] hover:bg-[#0C2B4E] hover:text-white transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No documents uploaded for this education.</p>
                      )}
                    </div>

                    {edu.verificationStatus !== "verified" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleVerifyEducation(edu.id, edu.degree)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Verify
                        </button>
                        <button
                          onClick={() => handleRejectEducation(edu.id, edu.degree)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}

                    {edu.verified && edu.verifiedAt && (
                      <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-green-600" />
                        Verified on {new Date(edu.verifiedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No education added</p>
            )}
          </div>

          {/* Resume */}
          {jobseeker.resumeUrl && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md fade-in animation-delay-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0C2B4E]" />
                </div>
                <h2 className="text-xl font-bold text-[#0C2B4E]">Resume</h2>
              </div>
              <a
                href={jobseeker.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#0C2B4E] text-white rounded-lg hover:bg-[#1A3D64] transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
