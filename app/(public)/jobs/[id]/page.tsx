"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Clock, Users, Share2, Heart, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getJobById } from "@/src/store/slices/jobsSlice";
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

  const jobId = id; // Keep as string for comparison
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[jobId];
  const isCached =
    lastFetchTime && now - lastFetchTime < CACHE_DURATION && job?.id === jobId;

  useEffect(() => {
    if (!isCached) {
      dispatch(getJobById(id));
    }
  }, [id, isCached, dispatch]);

  const handleApply = async () => {
    // Reset states
    setApplicationError(null);
    setApplicationSuccess(false);

    // Check if user is signed in
    if (!isSignedIn || !user) {
      setApplicationError("Please sign in to apply for this job");
      setTimeout(() => {
        router.push("/sign-in?redirect=/jobs/" + id);
      }, 2000);
      return;
    }

    setIsApplying(true);

    try {
      const result = await submitJobApplication(user.id, id);

      if (result.success) {
        setApplicationSuccess(true);
        setTimeout(() => {
          router.push("/jobseeker/applications");
        }, 3000);
      } else {
        const errorMsg = result.error || "Failed to submit application";
        if (
          errorMsg.includes("profile not found") ||
          errorMsg.includes("Jobseeker profile not found")
        ) {
          setApplicationError(
            "Please complete your jobseeker profile first to apply for jobs.",
          );
          setTimeout(() => {
            router.push("/jobseeker/profile");
          }, 3000);
        } else if (errorMsg.includes("already applied")) {
          setApplicationError("You have already applied for this job.");
        } else {
          setApplicationError(errorMsg);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the application";
      setApplicationError(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading job...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Job not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const similarJobs = allJobs
    .filter((j) => String(j.id) !== String(job.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6 smooth-enter-left animation-delay-100 transition-all duration-300 hover:translate-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 smooth-enter animation-delay-200">
            <div className="card-base p-8 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="smooth-enter animation-delay-300">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 font-semibold">
                    {job.company}
                  </p>
                </div>
                <div className="flex gap-2 smooth-enter-right animation-delay-400">
                  <button
                    type="button"
                    aria-label="Save job"
                    title="Save job"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-300 group"
                  >
                    <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500 transition-all duration-300" />
                  </button>
                  <button
                    type="button"
                    aria-label="Share job"
                    title="Share job"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                  >
                    <Share2 className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-all duration-300" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="fade-in animation-delay-300 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors duration-300">
                  <p className="text-sm text-gray-500 mb-1">Salary</p>
                  <p className="font-semibold text-gray-900">
                    {job.salary || "Not specified"}
                  </p>
                </div>
                <div className="fade-in animation-delay-400 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors duration-300">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div className="fade-in animation-delay-500 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors duration-300">
                  <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
                <div className="fade-in animation-delay-600 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors duration-300">
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">
                    {job.experience}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 fade-in animation-delay-700">
                <div className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-semibold">
                    {job.rating || "4.5"}
                  </span>
                  <span className="text-gray-500">
                    ({job.reviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 transition-transform duration-300 hover:translate-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{job.postedDaysAgo || "Recently posted"}</span>
                </div>
              </div>
            </div>

            <div className="card-base p-8 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-800">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About the Role
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line hover:text-gray-700 transition-colors duration-300">
                {job.description}
              </div>
            </div>

            <div className="card-base p-8 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-900">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, idx) => (
                  <div
                    key={skill}
                    className="bg-linear-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full font-semibold fade-in transition-all duration-300 hover:shadow-md hover:scale-105 hover:from-primary/20 hover:to-primary/15"
                    style={{ animationDelay: `${900 + idx * 100}ms` }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-base p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-1000">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this {job.jobType}
              </h2>
              <p className="text-gray-600 mb-4">Company: {job.company}</p>
              <Link
                href={`/companies/1`}
                className="text-primary hover:text-blue-900 font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
              >
                View Company Profile →
              </Link>
            </div>
          </div>

          <div className="smooth-enter-right animation-delay-300">
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying || applicationSuccess}
              className="w-full btn-primary mb-6 bg-linear-to-r from-primary to-primary/80 text-gray-900 font-bold py-3 rounded-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isApplying
                ? "Submitting..."
                : applicationSuccess
                  ? "✓ Applied!"
                  : "Apply for This Job"}
            </button>

            {applicationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm fade-in">
                {applicationError}
              </div>
            )}

            {applicationSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm fade-in">
                ✓ Application submitted successfully! Redirecting...
              </div>
            )}

            <div className="card-base p-6 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors duration-300">
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
              </div>
            </div>

            <div className="card-base p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-600">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-4">
                {similarJobs.map((similarJob, idx) => (
                  <Link
                    key={similarJob.id}
                    href={`/jobs/${similarJob.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-300 group fade-in"
                    style={{ animationDelay: `${600 + idx * 100}ms` }}
                  >
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors duration-300">
                      {similarJob.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {similarJob.company}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-primary/70 transition-colors duration-300">
                      {similarJob.salary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
