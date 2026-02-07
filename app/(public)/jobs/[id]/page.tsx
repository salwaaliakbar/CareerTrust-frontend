"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ApplyModal from "@/components/jobs/ApplyModal";
import type { ApplicationData } from "@/types/application.types";
import {
  Star,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getJobById } from "@/src/store/slices/jobsSlice";
import {
  fetchJobseekerProfile,
  selectJobseekerProfile,
  selectProfileLoading,
} from "@/src/store/slices/jobseeker/profileSlice";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import Swal from "sweetalert2";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] =
    useState(false);
  const {
    selectedJob: job,
    items: allJobs,
    loading,
    lastFetchTimeById,
  } = useAppSelector((state) => state.jobs);
  const jobseekerProfile = useAppSelector(selectJobseekerProfile);
  const isProfileLoading = useAppSelector(selectProfileLoading);
  const profileFetchRef = useRef<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    const lastFetchTime = lastFetchTimeById?.[id];
    const isCached =
      lastFetchTime &&
      now - lastFetchTime < CACHE_DURATION &&
      String(job?.id) === String(id);

    if (!isCached) {
      dispatch(getJobById(id));
    }
  }, [id, dispatch, job?.id, lastFetchTimeById]);

  useEffect(() => {
    if (!user?.id || isProfileLoading) return;
    if (profileFetchRef.current === user.id) return;
    if (!jobseekerProfile?.resumeUrl) {
      profileFetchRef.current = user.id;
      dispatch(fetchJobseekerProfile(user.id));
    } else {
      profileFetchRef.current = user.id;
    }
  }, [dispatch, isProfileLoading, jobseekerProfile?.resumeUrl, user?.id]);

  // Handle job application submission
  const handleApplySubmit = async (data: ApplicationData) => {
    if (!user?.id || !job?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to process application. Please try again.",
      });
      return;
    }

    try {
      setIsSubmittingApplication(true);

      // Build form data for file upload support
      const formData = new FormData();
      formData.append("jobId", String(job.id));
      formData.append("userId", user.id);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("coverLetter", data.coverLetter || "");
      formData.append("resumeOption", data.resumeOption);

      // Add resume file if uploading new one
      if (data.resumeOption === "new" && data.resumeFile) {
        formData.append("resumeFile", data.resumeFile);
      } else if (data.resumeOption === "existing") {
        // Use existing resume from profile
        formData.append("resumeUrl", jobseekerProfile?.resumeUrl || "");
      }

      // Submit application to API
      const response = await axios.post(
        API_ENDPOINTS.SUBMIT_APPLICATION || "/api/applications/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsApplyModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your job application has been submitted successfully. We'll notify you soon!",
          confirmButtonColor: "#0C2B4E",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          axiosError?.response?.data?.message ||
          "Failed to submit application. Please try again.",
        confirmButtonColor: "#0C2B4E",
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  // Helper to safely extract company name
  const getCompanyName = (companyData: string | { name?: string; id?: string | number } | null): string => {
    if (!companyData) return "Company";
    return typeof companyData === "object"
      ? companyData.name || "Company"
      : companyData;
  };

  const getCompanyId = (companyData: string | { name?: string; id?: string | number } | null): string | number => {
    if (!companyData) return "unknown";
    return typeof companyData === "object"
      ? companyData.id || "unknown"
      : "unknown";
  };

  const getDisplayCompany = (companyData: string | { name?: string; id?: string | number } | null): string => {
    if (!companyData) return "Company";
    return typeof companyData === "object"
      ? companyData.name || "Company"
      : companyData;
  };

  const companyName = job ? getCompanyName(job.company) : "Company";
  const companyId = job ? getCompanyId(job.company) : "unknown";

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-330-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-[#0C2B4E]"></div>
            <p className="mt-6 text-gray-600 font-medium">
              Loading job details...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-linear-330-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The job you{"'"}re looking for doesn{"'"}t exist or has been
              removed.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-linear-330-to-r from-[#0C2B4E] to-[#1D546C] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const normalizedCompany = companyName;
  const currentSkills = Array.isArray(job?.skills)
    ? job.skills.map((skill: string) => skill.toLowerCase())
    : [];

  // Rank jobs by similarity to the current job.
  const similarJobs = allJobs
    .filter((j) => String(j.id) !== String(job.id))
    .map((j) => {
      const jobCompany = getDisplayCompany(j.company);
      const jobSkills = Array.isArray(j.skills)
        ? j.skills.map((skill: string) => skill.toLowerCase())
        : [];
      const skillOverlap = currentSkills.length
        ? jobSkills.filter((skill: string) => currentSkills.includes(skill))
            .length
        : 0;

      let score = 0;
      if (job.jobType && j.jobType === job.jobType) score += 3;
      if (job.location && j.location === job.location) score += 2;
      if (normalizedCompany && jobCompany === normalizedCompany) score += 2;
      if (skillOverlap) score += Math.min(skillOverlap, 3);

      return { job: j, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.job)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-indigo-100 to-sky-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-[#0C2B4E] hover:text-[#1D546C] font-bold mb-8 smooth-enter-left animation-delay-100 transition-all duration-300 hover:-translate-x-1 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="card-base bg-white p-8 rounded-3xl shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 border-2 border-blue-100 smooth-enter animation-delay-200 relative overflow-hidden group">
              {/* Animateg-linearbg-linear-330 background with shine effect */}
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-100/30 via-indigo-50/20 to-purple-50/20 group-hover:from-blue-200/50 group-hover:via-indigo-100/40 group-hover:to-purple-100/40 transition-all duration-500 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-330-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-linear-330-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Building2 className="w-8 h-8 text-sky-700" />
                    </div>

                    <div className="smooth-enter animation-delay-300">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-[#0C2B4E] transition-colors duration-300">
                        {job.title}
                      </h1>
                      <p className="text-xl text-gray-600 font-semibold group-hover:text-[#1D546C] transition-colors duration-300">
                        {companyName}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 smooth-enter-right animation-delay-400">
                    <button
                      type="button"
                      aria-label="Save job"
                      title="Save job"
                      className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-rose-50 hover:border-rose-400 transition-all duration-300 group/btn shadow-sm hover:shadow-lg hover:scale-105"
                    >
                      <Heart className="w-5 h-5 text-gray-600 group-hover/btn:text-rose-600 group-hover/btn:fill-rose-500 transition-all duration-300" />
                    </button>
                    <button
                      type="button"
                      aria-label="Share job"
                      title="Share job"
                      className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-blue-50 hover:border-[#0C2B4E] transition-all duration-300 group/btn shadow-sm hover:shadow-lg hover:scale-105"
                    >
                      <Share2 className="w-5 h-5 text-gray-600 group-hover/btn:text-[#0C2B4E] transition-all duration-300" />
                    </button>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="fade-in animation-delay-400 p-4 rounded-xl bg-linear-330-to-br from-blue-50/50 to-blue-50/30 hover:from-blue-100/50 hover:to-blue-100/30 transition-all duration-300 border border-blue-100/50 group/card">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600 group-hover/card:scale-110 transition-transform duration-300" />
                      <p className="text-xs text-gray-500 font-medium">
                        Salary
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {job.salary || "Not specified"}
                    </p>
                  </div>

                  <div className="fade-in animation-delay-500 p-4 rounded-xl  transition-all duration-300 border border-green-100/50 group/card">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600 group-hover/card:scale-110 transition-transform duration-300" />
                      <p className="text-xs text-gray-500 font-medium">
                        Location
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">{job.location}</p>
                  </div>

                  <div className="fade-in animation-delay-600 p-4 rounded-xl  transition-all duration-300 border border-purple-100/50 group/card">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-purple-600 group-hover/card:scale-110 transition-transform duration-300" />
                      <p className="text-xs text-gray-500 font-medium">
                        Job Type
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">{job.jobType}</p>
                  </div>

                  <div className="fade-in animation-delay-700 p-4 rounded-xl bg-linear-330-to-br from-orange-50/50 to-orange-50/30 hover:from-orange-100/50 hover:to-orange-100/30 transition-all duration-300 border border-orange-100/50 group/card">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-600 group-hover/card:scale-110 transition-transform duration-300" />
                      <p className="text-xs text-gray-500 font-medium">
                        Experience
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">{job.experience}</p>
                  </div>
                </div>

                {/* Rating and Posted Time */}
                <div className="flex flex-wrap gap-6 fade-in animation-delay-800">
                  <div className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1 group/rating">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover/rating:scale-110 transition-transform duration-300" />
                    <span className="text-gray-900 font-bold">
                      {job.rating || "4.5"}
                    </span>
                    <span className="text-gray-500">
                      ({job.reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 transition-all duration-300 hover:translate-x-1 group/time">
                    <Clock className="w-5 h-5 text-blue-600 group-hover/time:scale-110 transition-transform duration-300" />
                    <span className="font-medium">
                      Posted {job.postedDaysAgo || "recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="card-base bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100 fade-in animation-delay-900 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10 ">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-330-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-sky-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    About the Role
                  </h2>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line hover:text-gray-700 transition-colors duration-300">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            {Array.isArray(job.responsibilities) &&
              job.responsibilities.length > 0 && (
                <div className="card-base bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100 fade-in animation-delay-950 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-linear-330-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-indigo-700" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Responsibilities
                      </h2>
                    </div>
                    <ul className="space-y-3 text-gray-600">
                      {job.responsibilities.map((item: string, idx: number) => (
                        <li
                          key={`${item}-${idx}`}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#0C2B4E]" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            {/* Required Skills */}
            <div className="card-base bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100  fade-in animation-delay-1000 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-330-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Required Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, idx) => (
                    <div
                      key={skill}
                      className="bg-linear-330-to-r from-[#0C2B4E]/10 to-[#1D546C]/10 text-[#0C2B4E] px-5 py-2.5 rounded-full font-bold border-2 border-[#0C2B4E]/20 fade-in transition-all duration-300 hover:shadow-md hover:scale-105 hover:from-[#0C2B4E]/20 hover:to-[#1D546C]/20 hover:border-[#0C2B4E]/40 cursor-default"
                      style={{ animationDelay: `${1000 + idx * 50}ms` }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="card-base bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100 fade-in animation-delay-1100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-linear-330-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    About {companyName}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Learn more about this {job.jobType} position and explore other
                  opportunities at {companyName}.
                </p>
                <Link
                  href={`/companies/${companyId}`}
                  className="inline-flex items-center gap-2 text-[#0C2B4E] hover:text-[#1D546C] font-bold transition-all duration-300 hover:translate-x-1 group/link"
                >
                  View Company Profile
                  <ArrowLeft className="w-5 h-5 rotate-180 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <div className="smooth-enter-right animation-delay-300">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                disabled={isSubmittingApplication}
                className="w-full bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white font-black py-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-linear-330-to-r from-[#1A3D64] to-[#0C2B4E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Briefcase className="w-6 h-6 group-hover:animate-bounce" />
                  {isSubmittingApplication ? "Submitting..." : "Apply for This Job"}
                </span>
              </button>
            </div>

            {/* Quick Facts */}
            <div className="card-base bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100 fade-in animation-delay-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-linear-330-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-sky-700" />
                  </div>
                  Quick Facts
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-linear-330-to-br from-gray-50/50 to-gray-50/30 rounded-xl hover:from-gray-100/50 hover:to-gray-100/30 transition-all duration-300 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      Job Type
                    </p>
                    <p className="font-bold text-gray-900">{job.jobType}</p>
                  </div>
                  <div className="p-4 bg-linear-330-to-br from-gray-50/50 to-gray-50/30 rounded-xl hover:from-gray-100/50 hover:to-gray-100/30 transition-all duration-300 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      Posted
                    </p>
                    <p className="font-bold text-gray-900">
                      {job.postedDaysAgo || "Recently"}
                    </p>
                  </div>
                  <div className="p-4 bg-linear-330-to-br from-gray-50/50 to-gray-50/30 rounded-xl hover:from-gray-100/50 hover:to-gray-100/30 transition-all duration-300 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      Applicants
                    </p>
                    <p className="font-bold text-gray-900">
                      {job.reviews || 0}+ interested
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="card-base bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-blue-100 fade-in animation-delay-600 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-330-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/30 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-linear-330-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-green-700" />
                  </div>
                  Similar Jobs
                </h3>
                <div className="space-y-3">
                  {similarJobs.map((similarJob, idx) => (
                    <Link
                      key={similarJob.id}
                      href={`/jobs/${similarJob.id}`}
                      className="block p-4 border-2 border-gray-200 rounded-xl hover:border-[#0C2B4E] hover:bg-linear-330-to-br hover:from-blue-50/30 hover:to-blue-50/50 transition-all duration-300 group/card fade-in relative overflow-hidden"
                      style={{ animationDelay: `${600 + idx * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-linear-330-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3">
                          <Briefcase className="w-5 h-5 text-sky-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover/card:text-[#0C2B4E] transition-colors duration-300 truncate">
                            {similarJob.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 font-medium">
                            {getDisplayCompany(similarJob.company)}
                          </p>
                          <p className="text-xs text-[#0C2B4E]/80 font-semibold group-hover/card:text-[#0C2B4E] transition-colors duration-300">
                            {similarJob.salary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        jobTitle={job?.title || ""}
        companyName={companyName}
        resumeUrl={jobseekerProfile?.resumeUrl || null}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        profileData={{
          fullName: jobseekerProfile?.profile?.fullName || user?.fullName || "",
          email: jobseekerProfile?.profile?.email || user?.primaryEmailAddress?.emailAddress || "",
          phone: "",
        }}
      />

      <Footer />
    </div>
  );
}
