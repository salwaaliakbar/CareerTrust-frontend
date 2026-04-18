"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Clock, Share2, Heart, ArrowLeft, MapPin, Briefcase, DollarSign, Zap, ChevronRight, Building2, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getJobById } from "@/redux/store/slices/jobsSlice";
import { submitJobApplication } from "@/services/api/applications.service";

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const {
    selectedJob: job,
    items: allJobs,
    loading,
    lastFetchTimeById,
  } = useAppSelector((state) => state.jobs);

  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [saved, setSaved] = useState(false);

  const jobId = id;
  const cacheKey = String(jobId);
  const CACHE_DURATION = 10 * 60 * 1000;
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[cacheKey];
  const isCached =
    Boolean(lastFetchTime) &&
    now - (lastFetchTime as number) < CACHE_DURATION &&
    String(job?.id) === cacheKey;

  useEffect(() => {
    if (!isCached) dispatch(getJobById(cacheKey));
  }, [cacheKey, isCached, dispatch]);

  const handleApply = async () => {
    setApplicationError(null);
    setApplicationSuccess(false);

    if (!isSignedIn || !user) {
      setApplicationError("Please sign in to apply for this job");
      setTimeout(() => { router.push("/sign-in?redirect=/jobs/" + id); }, 2000);
      return;
    }

    setIsApplying(true);
    try {
      const result = await submitJobApplication(user.id, id);
      if (result.success) {
        setApplicationSuccess(true);
        setTimeout(() => { router.push("/jobseeker/applications"); }, 3000);
      } else {
        const errorMsg = result.error || "Failed to submit application";
        if (errorMsg.includes("profile not found") || errorMsg.includes("Jobseeker profile not found")) {
          setApplicationError("Please complete your jobseeker profile first to apply for jobs.");
          setTimeout(() => { router.push("/jobseeker/profile"); }, 3000);
        } else if (errorMsg.includes("already applied")) {
          setApplicationError("You have already applied for this job.");
        } else {
          setApplicationError(errorMsg);
        }
      }
    } catch (error: unknown) {
      setApplicationError(error instanceof Error ? error.message : "An error occurred while submitting the application");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 mx-auto border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 tracking-widest uppercase">Loading position</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Position not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getCompanyLabel = (company: unknown) => {
    if (typeof company === "string") return company;
    if (typeof company === "object" && company !== null && "name" in company) {
      const name = (company as { name?: unknown }).name;
      return typeof name === "string" ? name : "";
    }
    return "";
  };

  const similarJobs = allJobs.filter((j) => String(j.id) !== String(job.id)).slice(0, 3);
  const companyName = getCompanyLabel(job.company);
  const jobSkills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">

        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 mb-8 text-slate-400 hover:text-blue-600 transition-colors duration-200 group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="text-base font-semibold">Back to Jobs</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-linear-to-br from-white via-blue-50/35 to-white rounded-2xl border border-blue-100/80 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.3),0_0_0_1px_rgba(96,165,250,0.18)] overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="p-7">
                {/* Title row */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold tracking-wide uppercase mb-3">
                      <Zap className="w-3 h-3" />
                      {job.jobType}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-600 text-lg font-semibold">{companyName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Save job"
                      onClick={() => setSaved(!saved)}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
                        saved
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "bg-white border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                    </button>
                    <button
                      type="button"
                      aria-label="Share job"
                      className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: <DollarSign className="w-3.5 h-3.5" />, label: "Salary",     value: job.salary || "Not specified" },
                    { icon: <MapPin      className="w-3.5 h-3.5" />, label: "Location",   value: job.location },
                    { icon: <Briefcase  className="w-3.5 h-3.5" />, label: "Type",       value: job.jobType },
                    { icon: <Award      className="w-3.5 h-3.5" />, label: "Experience", value: job.experience },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-200"
                    >
                      <div className="flex items-center gap-1 text-blue-500 mb-1">
                        {icon}
                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                      </div>
                      <p className="text-base font-semibold text-slate-800 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(job.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    ))}
                    <span className="ml-1 text-base font-bold text-slate-800">{job.rating || "4.5"}</span>
                    <span className="text-base text-slate-400 ml-0.5">({job.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-base">{job.postedDaysAgo || "Recently posted"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About the Role */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-4 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">01</span>
                <h2 className="text-xl font-bold text-slate-900">About the Role</h2>
              </div>
              <div className="px-7 py-5 text-base text-slate-600 leading-7 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-4 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">02</span>
                <h2 className="text-xl font-bold text-slate-900">Required Skills</h2>
              </div>
              <div className="px-7 py-5 flex flex-wrap gap-2">
                {jobSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full text-base font-semibold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-150 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-4 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">03</span>
                <h2 className="text-xl font-bold text-slate-900">About the Company</h2>
              </div>
              <div className="px-7 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{companyName}</p>
                    <p className="text-base text-slate-400 mt-0.5">{job.jobType} · {job.location}</p>
                  </div>
                </div>
                {job.companyId && (
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="inline-flex items-center gap-1.5 text-base font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    View Company Profile
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="sticky top-6 space-y-4">

            {/* Apply CTA */}
            <div className="bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] rounded-2xl p-6 shadow-[0_14px_30px_-16px_rgba(15,23,42,0.65)]">
              <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-4">Ready to join?</p>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying || applicationSuccess}
                className={`w-full py-3 rounded-xl font-bold text-base tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 ${
                  applicationSuccess
                    ? "bg-green-400 text-white"
                    : "bg-white text-[#0A1F44] hover:bg-blue-50 shadow-sm hover:shadow"
                }`}
              >
                {isApplying ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : applicationSuccess ? "✓ Application Sent!" : "Apply Now"}
              </button>

              {applicationError && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs leading-relaxed">
                  {applicationError}
                </div>
              )}
              {applicationSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs leading-relaxed">
                  Submitted! Redirecting to your applications…
                </div>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3">Quick Facts</h3>
              <div className="space-y-2">
                {[
                  { label: "Job Type",    value: job.jobType },
                  { label: "Location",    value: job.location },
                  ...(job.salary     ? [{ label: "Salary",     value: job.salary }]     : []),
                  ...(job.experience ? [{ label: "Experience", value: job.experience }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-400 font-medium">{label}</span>
                    <span className="text-sm font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Roles */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3">Similar Roles</h3>
                <div className="space-y-2">
                  {similarJobs.map((sj) => (
                    <Link
                      key={sj.id}
                      href={`/jobs/${sj.id}`}
                      className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 truncate">{sj.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{getCompanyLabel(sj.company)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-blue-600">{sj.salary}</p>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 ml-auto mt-1 transition-colors duration-200" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}