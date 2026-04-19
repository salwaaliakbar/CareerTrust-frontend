"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmployerJobsList from "@/components/employer/EmployerJobsList";
import ExitRequestsPanel from "@/components/employer/ExitRequestsPanel";
import EmployerStats from "@/components/employer/EmployerStats";
import ReputationScoreCard from "@/components/companies/ReputationScoreCard";
import {
  Briefcase,
  Plus,
  Users,
  Building2,
  AlertCircle,
  Lock,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { fetchEmployerJobs } from "@/services/api/employer.service";
import {
  checkCompanyStatus,
  getCompanyProfile,
} from "@/services/api/employerCompany.service";
import { EmployerJob } from "@/types/application.types";
import { EMPLOYER } from "@/constants/constant";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getCompanyReputationById } from "@/redux/store/slices/companiesSlice";

const EmployerDashboard = () => {
  const dispatch = useAppDispatch();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReputationOnly = searchParams.get("showReputation") === "true";

  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const reputationById = useAppSelector((state) => state.companies.reputationById);
  const companyReputation = companyId ? reputationById[companyId] || null : null;

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string;
      if (userRole !== EMPLOYER) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only employers can access this dashboard",
        }).then(() => {
          router.push("/");
        });
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const checkCompany = async () => {
      if (!user?.id) return;

      try {
        setIsRefreshing(true);
        setEmployerId(user.id);

        const status = await checkCompanyStatus(user.id, getToken);
        const company = await getCompanyProfile(user.id, getToken);
        setNeedsSetup(status.needsSetup || false);
        setCompanyName(status.companyName);
        setIsVerified(status.isVerified || false);
        setCompanyId(company?.id ? String(company.id) : null);
      } catch (error) {
        console.error("[Dashboard] Error checking company status:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    if (user?.id) {
      checkCompany();
    }
  }, [user?.id, getToken, refreshKey]);

  useEffect(() => {
    if (!isReputationOnly || !companyId) return;

    dispatch(getCompanyReputationById(companyId));
  }, [dispatch, companyId, isReputationOnly]);

  useEffect(() => {
    const loadJobs = async () => {
      if (!employerId) return;
      if (isReputationOnly) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const employerJobs = await fetchEmployerJobs(employerId.toString(), getToken);
        setJobs(employerJobs);
      } catch (error) {
        console.error("[Dashboard] Error loading jobs:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Jobs",
          text: "Please refresh the page to try again",
        });
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      loadJobs();
    }
  }, [employerId, getToken, isReputationOnly, refreshKey]);

  useEffect(() => {
    const handleEmployerDashboardUpdated = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener(
      "careertrust:employer-dashboard-updated",
      handleEmployerDashboardUpdated,
    );

    return () => {
      window.removeEventListener(
        "careertrust:employer-dashboard-updated",
        handleEmployerDashboardUpdated,
      );
    };
  }, []);

  const visibleJobs = jobs.slice(0, 4);
  const hasMoreJobs = jobs.length > 4;

  const handleJobDeleted = (jobId: string | number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleJobUpdated = (updatedJob: EmployerJob) => {
    setJobs((prev) => prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
  };

  if (!isLoaded || (!isReputationOnly && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-semibold text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isReputationOnly ? "min-h-screen bg-linear-to-br from-slate-100 via-blue-50/40 to-indigo-100/70" : "min-h-screen bg-[#F4F6FB]"}>
      <Header />
      {!isReputationOnly && <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />}

      {isReputationOnly ? (
        <main className="min-h-[calc(100vh-88px)] bg-slate-50 px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
          <section className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/employer/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Live Sentiment View
              </span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Company Reputation
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  Reputation Intelligence
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Monitor anonymous workforce feedback in one clean view and track how your company perception is evolving across key aspects.
                </p>
              </div>

              {companyReputation && (
                <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-[0_12px_30px_-18px_rgba(30,58,138,0.5)] ring-1 ring-blue-50">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Overall Score
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-slate-900">
                    {companyReputation.reputationScore.toFixed(1)}
                    <span className="ml-1 text-sm font-semibold text-slate-500">/5</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8">
              <ReputationScoreCard reputation={companyReputation} variant="employer" />
            </div>
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-size-[40px_40px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

            <div className="relative z-10 px-7 py-12 sm:px-10 sm:py-17">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-blue-300/80" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                      Employer Dashboard
                    </span>
                  </div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    Employer Command Center
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-200/85 sm:text-base">
                    {companyName ? (
                      <span className="flex flex-wrap items-center gap-2">
                        <span>Managing hiring for</span>
                        <Link
                          href={isVerified ? "/employer/company/setup" : "#"}
                          onClick={(e) => {
                            if (!isVerified) {
                              e.preventDefault();
                              Swal.fire({
                                icon: "warning",
                                title: "Verification Required",
                                text: "Your company must be verified before you can edit the profile. Please wait for admin approval.",
                              });
                            }
                          }}
                          className={`inline-flex items-center gap-2 font-semibold ${isVerified ? "text-white underline-offset-4 hover:text-blue-200 hover:underline" : "cursor-not-allowed text-blue-200/70"}`}
                        >
                          {!isVerified && <Lock className="h-3 w-3" />}
                          {companyName}
                        </Link>
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-50">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-50">
                            <AlertCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                        <button
                          onClick={() => setRefreshKey((prev) => prev + 1)}
                          disabled={isRefreshing}
                          className="rounded-lg p-1 text-blue-200 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                          title="Refresh verification status"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        </button>
                      </span>
                    ) : (
                      "Manage your job postings and find the perfect candidates"
                    )}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3.5 sm:flex-row lg:w-auto lg:flex-col">
                  <Link
                    href={isVerified ? "/employer/post-job" : "#"}
                    onClick={(e) => {
                      if (!isVerified) {
                        e.preventDefault();
                        Swal.fire({
                          icon: "warning",
                          title: "Verification Required",
                          text: "Your company must be verified before you can post jobs. Please wait for admin approval.",
                        });
                      }
                    }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold shadow-lg transition-all duration-200 ${isVerified ? "bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 text-white hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 hover:shadow-xl hover:scale-[1.02]" : "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60"}`}
                  >
                    {!isVerified && <Lock className="h-5 w-5" />}
                    <Plus className="h-5 w-5" />
                    Post New Job
                  </Link>
                  <Link
                    href="/employer/candidates"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
                  >
                    <Users className="h-5 w-5" />
                    Browse Candidates
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {needsSetup && (
            <div className="animate-fade-in-up mb-8 rounded-2xl border-2 border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Complete Your Company Profile
                  </h3>
                  <p className="mb-4 text-slate-700">
                    Your company profile was created automatically! Please complete it with your company details. This helps candidates learn about your company and builds trust.
                  </p>
                  <Link
                    href={isVerified ? "/employer/company/setup" : "#"}
                    onClick={(e) => {
                      if (!isVerified) {
                        e.preventDefault();
                        Swal.fire({
                          icon: "warning",
                          title: "Verification Required",
                          text: "Your company must be verified before you can complete the profile. Please wait for admin approval.",
                        });
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${isVerified ? "cursor-pointer bg-amber-600 text-white hover:bg-amber-700" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
                  >
                    {!isVerified && <Lock className="h-5 w-5" />}
                    <Building2 className="h-5 w-5" />
                    Complete Company Profile
                  </Link>
                </div>
              </div>
            </div>
          )}

          <EmployerStats jobs={jobs} />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Posted Jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing top 4 jobs from your postings.
                </p>
              </div>
              {hasMoreJobs && (
                <Link
                  href="/employer/postedJob"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  View All Jobs
                </Link>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg">
                <Briefcase className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  No Jobs Posted Yet
                </h3>
                <p className="mb-6 text-slate-600">
                  Start by creating your first job posting to attract top talent.
                </p>
                <Link
                  href={isVerified ? "/employer/post-job" : "#"}
                  onClick={(e) => {
                    if (!isVerified) {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Verification Required",
                        text: "Your company must be verified before you can post jobs. Please wait for admin approval.",
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all duration-200 ${isVerified ? "bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white hover:from-[#1A3D64] hover:to-[#2A5A7F] hover:shadow-xl hover:scale-105" : "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60"}`}
                >
                  {!isVerified && <Lock className="h-5 w-5" />}
                  <Plus className="h-5 w-5" />
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <EmployerJobsList
                jobs={visibleJobs}
                onJobDeleted={handleJobDeleted}
                onJobUpdated={handleJobUpdated}
                getToken={getToken}
              />
            )}
          </section>

          <div className="mt-10">
            <ExitRequestsPanel getToken={getToken} refreshKey={refreshKey} />
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default EmployerDashboard;
