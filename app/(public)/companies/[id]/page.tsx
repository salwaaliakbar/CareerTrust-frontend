"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyEditForm from "@/components/companies/CompanyEditForm";
import {
  Users,
  Briefcase,
  MapPin,
  ArrowLeft,
  Edit2,
  Globe,
  Linkedin,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getCompanyById } from "@/redux/store/slices/companiesSlice";
import { Company } from "@/types/company.types";
import { API_ENDPOINTS } from "@/constants/api";
import ReputationScoreCard from "@/components/companies/ReputationScoreCard";
import {
  fetchCompanyReputation,
  type CompanyReputation,
} from "@/services/api/reputation.service";

interface CompanyJob {
  id: number;
  title: string;
  location: string;
  jobType: string;
  salary?: string;
  postedDate: string;
  status: string;
}

export default function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const {
    selectedCompany: company,
    loading,
    lastFetchTimeById,
  } = useAppSelector((state) => state.companies);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [reputation, setReputation] = useState<CompanyReputation | null>(null);

  const companyId = Number(id);
  const CACHE_DURATION = 10 * 60 * 1000;
  const lastFetchTime = lastFetchTimeById?.[companyId];

  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isCompanyOwner = userRole === "employer";

  useEffect(() => {
    const hasFreshCache =
      !!lastFetchTime &&
      Date.now() - lastFetchTime < CACHE_DURATION &&
      company?.id === companyId;

    if (!hasFreshCache) {
      dispatch(getCompanyById(id));
    }
  }, [id, dispatch, lastFetchTime, company?.id, companyId, CACHE_DURATION]);

  // Fetch real jobs for this company
  useEffect(() => {
    if (!companyId) return;

    let isCancelled = false;

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINTS.JOBS}?companyId=${companyId}`);
        const data = await response.json();
        if (!isCancelled && data.success) {
          setCompanyJobs(data.data ?? []);
        }
      } catch {
        if (!isCancelled) {
          setCompanyJobs([]);
        }
      } finally {
        if (!isCancelled) {
          setJobsLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isCancelled = true;
    };
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;

    let disposed = false;

    const loadReputation = async () => {
      const result = await fetchCompanyReputation(companyId);
      if (!disposed) {
        setReputation(result);
      }
    };

    loadReputation();

    return () => {
      disposed = true;
    };
  }, [companyId]);

  // Fetch real jobs for this company
  useEffect(() => {
    if (!companyId) return;
    setJobsLoading(true);
    fetch(`${API_ENDPOINTS.JOBS}?companyId=${companyId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCompanyJobs(data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, [companyId]);

  const handleEditSuccess = (updatedCompany: Company) => {
    setEditedCompany(updatedCompany);
    setIsEditing(false);
    dispatch(getCompanyById(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex items-center justify-center">
          <div className="text-center bg-linear-to-br from-white via-blue-50/35 to-white rounded-2xl border border-blue-100/80 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.3),0_0_0_1px_rgba(96,165,250,0.18)] px-10 py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading company...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentCompany =
    editedCompany && editedCompany.id === companyId
      ? editedCompany
      : (company ?? null);

  if (!currentCompany) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 mb-8 text-slate-400 hover:text-blue-600 transition-colors duration-200 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span className="text-base font-semibold">Back to Companies</span>
          </Link>
          <div className="bg-linear-to-br from-white via-blue-50/35 to-white rounded-2xl border border-blue-100/80 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.3),0_0_0_1px_rgba(96,165,250,0.18)] p-8 text-center">
            <p className="text-slate-600 text-lg font-semibold">Company not found</p>
            <p className="text-slate-500 text-sm mt-2">
              The company you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine if logo is a real URL or just placeholder text
  const isLogoUrl =
    currentCompany.logo &&
    (currentCompany.logo.startsWith("http") ||
      currentCompany.logo.startsWith("/"));

  const companyInitials = currentCompany.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const companyIsVerified = Boolean(
    (currentCompany as { isVerified?: boolean }).isVerified,
  );
  const companyWebsite =
    (currentCompany as { website?: string }).website ?? "";
  const companyLinkedinUrl =
    (currentCompany as { linkedinUrl?: string }).linkedinUrl ?? "";
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-semibold smooth-enter-left animation-delay-100 transition-colors duration-200 group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span className="text-base font-semibold">Back to Companies</span>
          </Link>
          {isCompanyOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#0A1F44] via-[#123560] to-[#1A4779] text-white font-semibold shadow-[0_14px_30px_-16px_rgba(15,23,42,0.65)] hover:brightness-110 transition-all duration-200 smooth-enter animation-delay-100"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <CompanyEditForm
            company={currentCompany}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left / main column ── */}
            <div className="lg:col-span-2 smooth-enter animation-delay-200 space-y-6">
              {/* Company header card */}
              <div className="bg-linear-to-br from-white via-blue-50/35 to-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.3),0_0_0_1px_rgba(96,165,250,0.18)] overflow-hidden">
                <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="p-8">
                  <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-blue-100 bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] flex items-center justify-center shadow-sm">
                    {isLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentCompany.logo}
                        alt={currentCompany.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {companyInitials}
                      </span>
                    )}
                  </div>

                  {/* Name / meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {currentCompany.name}
                      </h1>
                      {companyIsVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                      {currentCompany.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-base sm:text-lg text-slate-600 font-semibold">
                      {currentCompany.industry}
                    </p>
                    <p className="text-base text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {currentCompany.location}
                    </p>

                    {/* Links */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      {companyWebsite && (
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {companyLinkedinUrl && (
                        <a
                          href={companyLinkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                  {/* Stats row */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200">
                    <p className="text-xs text-slate-400 mb-1 font-bold tracking-widest uppercase">Reputation Score</p>
                    <p className="text-lg font-bold text-slate-800">
                      {(reputation?.reputationScore ?? currentCompany.rating ?? 0).toFixed(1)} / 5
                    </p>
                  </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200">
                    <p className="text-xs text-slate-400 mb-1 font-bold tracking-widest uppercase">Employees</p>
                    <p className="text-lg font-bold text-slate-800">
                      {currentCompany.employees.toLocaleString()}
                    </p>
                  </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200">
                    <p className="text-xs text-slate-400 mb-1 font-bold tracking-widest uppercase">Open Positions</p>
                    <p className="text-lg font-bold text-slate-800">
                      {jobsLoading ? "…" : companyJobs.length}
                    </p>
                  </div>
                </div>

                  {/* Description */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-slate-600 text-base leading-7 whitespace-pre-wrap">
                    {currentCompany.description}
                  </p>
                </div>
                </div>
              </div>

              {/* Open Positions */}
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-8">
                <ReputationScoreCard reputation={reputation} />
              </div>

              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                  Open Positions at {currentCompany.name}
                </h2>

                {jobsLoading ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    Loading jobs…
                  </div>
                ) : companyJobs.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4">
                    No open positions at this time.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {companyJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
                      >
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {job.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {job.jobType}
                            </span>
                            {job.salary && (
                              <span className="font-medium text-slate-700">
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-400 group-hover:text-blue-600 shrink-0 ml-4">
                          View →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="smooth-enter-right animation-delay-300 space-y-6">
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-3">
                  Company Facts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-base text-slate-600 p-3 bg-blue-50/50 rounded-lg">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{currentCompany.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-slate-600 p-3 bg-blue-50/50 rounded-lg">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>
                      {currentCompany.employees.toLocaleString()} employees
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-slate-600 p-3 bg-green-50/50 rounded-lg">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>
                      {jobsLoading ? "…" : companyJobs.length} open positions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-slate-600 p-3 bg-purple-50/50 rounded-lg">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{currentCompany.location}</span>
                  </div>
                  {companyWebsite && (
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base text-blue-600 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">{companyWebsite}</span>
                    </a>
                  )}
                  {companyLinkedinUrl && (
                    <a
                      href={companyLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base text-blue-600 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                    >
                      <Linkedin className="w-4 h-4 shrink-0" />
                      <span>LinkedIn Page</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] rounded-2xl p-6 shadow-[0_14px_30px_-16px_rgba(15,23,42,0.65)]">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  Follow {currentCompany.name}
                </h3>
                <p className="text-sm text-blue-200 mb-4">
                  Get updates when {currentCompany.name} posts new jobs.
                </p>
                <button
                  type="button"
                  className="w-full bg-white text-[#0A1F44] font-bold py-2.5 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95"
                >
                  Follow Company
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
