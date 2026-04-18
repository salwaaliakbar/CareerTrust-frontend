"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Briefcase,
  Filter,
  LayoutDashboard,
  Lock,
  Search,
  Plus,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmployerJobsList from "@/components/employer/EmployerJobsList";
import { fetchEmployerJobs } from "@/services/api/employer.service";
import { checkCompanyStatus } from "@/services/api/employerCompany.service";
import { EmployerJob } from "@/types/application.types";
import { EMPLOYER } from "@/constants/constant";
import Swal from "sweetalert2";

export default function EmployerPostedJobsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed" | "draft">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string;
      if (userRole !== EMPLOYER) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only employers can access this page",
        });
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const loadJobs = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        setError(null);
        const status = await checkCompanyStatus(user.id, getToken);
        setCompanyName(status.companyName);
        setIsVerified(status.isVerified || false);

        const employerJobs = await fetchEmployerJobs(user.id, getToken);
        setJobs(employerJobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [getToken, isLoaded, user]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term) ||
          job.jobType.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [jobs, searchTerm, statusFilter]);

  const handleJobDeleted = (jobId: string | number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleJobUpdated = (updatedJob: EmployerJob) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    );
  };

  return (
    <>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />
      <main className="min-h-screen bg-[#F4F6FB] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
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
                      All Posted Jobs
                    </span>
                  </div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    {companyName ? `${companyName} Jobs` : "All Posted Jobs"}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-200/85 sm:text-base">
                    Search, filter, and manage every job posting from one place.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-10 py-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/85">
                      Total Jobs
                    </p>
                    <p className="mt-1 text-3xl font-black text-white">{jobs.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
              <p className="text-slate-500">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-[0_22px_55px_-30px_rgba(239,68,68,0.35)]">
              <h2 className="text-2xl font-bold text-slate-900">Unable to load jobs</h2>
              <p className="mt-2 text-slate-600">{error}</p>
            </div>
          ) : (
            <>
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(12,43,78,0.35)]">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search jobs by title, location, or type..."
                      aria-label="Search jobs"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 font-medium transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="relative min-w-50">
                    <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value as "all" | "active" | "closed" | "draft",
                        )
                      }
                      aria-label="Filter jobs by status"
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 font-medium transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <option value="all">All Jobs</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    All Posted Jobs
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} shown
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  {isVerified ? "Verified Company" : "Unverified Company"}
                </div>
              </section>

              {filteredJobs.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/90 bg-white p-12 text-center shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <Briefcase className="mx-auto h-16 w-16 text-slate-300" />
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    {jobs.length === 0 ? "No Jobs Posted Yet" : "No Jobs Found"}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    {jobs.length === 0
                      ? "Start by creating your first job posting to attract top talent."
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  {jobs.length === 0 && (
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
                      className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition-all duration-200 ${
                        isVerified
                          ? "bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white hover:from-[#1A3D64] hover:to-[#2A5A7F]"
                          : "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60"
                      }`}
                    >
                      {!isVerified && <Lock className="h-5 w-5" />}
                      <Plus className="h-5 w-5" />
                      Post Your First Job
                    </Link>
                  )}
                </div>
              ) : (
                <EmployerJobsList
                  jobs={filteredJobs}
                  onJobDeleted={handleJobDeleted}
                  onJobUpdated={handleJobUpdated}
                  getToken={getToken}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
