"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyEditForm from "@/components/companies/CompanyEditForm";
import {
  Star,
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
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const companyId = Number(id);
  const CACHE_DURATION = 10 * 60 * 1000;
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[companyId];
  const isCached =
    lastFetchTime &&
    now - lastFetchTime < CACHE_DURATION &&
    company?.id === companyId;

  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isCompanyOwner = userRole === "employer";

  useEffect(() => {
    if (!isCached) {
      dispatch(getCompanyById(id));
    }
  }, [id, isCached, dispatch]);

  useEffect(() => {
    if (company) {
      setCurrentCompany(company);
    }
  }, [company]);

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
    setCurrentCompany(updatedCompany);
    setIsEditing(false);
    dispatch(getCompanyById(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading company...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Companies
          </Link>
          <div className="card-base p-8 text-center">
            <p className="text-gray-600 text-lg">Company not found</p>
            <p className="text-gray-500 text-sm mt-2">
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold smooth-enter-left animation-delay-100 transition-all duration-300 hover:translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Companies
          </Link>
          {isCompanyOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-all duration-300 smooth-enter animation-delay-100"
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
              <div className="card-base p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-linear-to-br from-[#0C2B4E] to-[#1D546C] flex items-center justify-center shadow-sm">
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
                      <h1 className="text-3xl font-bold text-gray-900">
                        {currentCompany.name}
                      </h1>
                      {currentCompany.isVerified && (
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
                    <p className="text-lg text-gray-600 font-semibold">
                      {currentCompany.industry}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {currentCompany.location}
                    </p>

                    {/* Links */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      {currentCompany.website && (
                        <a
                          href={currentCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {currentCompany.linkedinUrl && (
                        <a
                          href={currentCompany.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="p-4 bg-yellow-50/50 rounded-lg">
                    <p className="text-gray-500 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {currentCompany.rating}
                      </span>
                      <span className="text-gray-500">
                        ({currentCompany.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-lg">
                    <p className="text-gray-500 mb-1">Employees</p>
                    <p className="font-semibold text-gray-900">
                      {currentCompany.employees.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50/50 rounded-lg">
                    <p className="text-gray-500 mb-1">Open Positions</p>
                    <p className="font-semibold text-gray-900">
                      {jobsLoading ? "…" : companyJobs.length}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {currentCompany.description}
                  </p>
                </div>
              </div>

              {/* Open Positions */}
              <div className="card-base p-8 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Open Positions at {currentCompany.name}
                </h2>

                {jobsLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading jobs…
                  </div>
                ) : companyJobs.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">
                    No open positions at this time.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {companyJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {job.jobType}
                            </span>
                            {job.salary && (
                              <span className="font-medium text-gray-700">
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-primary shrink-0 ml-4">
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
              <div className="card-base p-6 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Company Facts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50/50 rounded-lg">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{currentCompany.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50/50 rounded-lg">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>
                      {currentCompany.employees.toLocaleString()} employees
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50/50 rounded-lg">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>
                      {jobsLoading ? "…" : companyJobs.length} open positions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-purple-50/50 rounded-lg">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{currentCompany.location}</span>
                  </div>
                  {currentCompany.website && (
                    <a
                      href={currentCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">{currentCompany.website}</span>
                    </a>
                  )}
                  {currentCompany.linkedinUrl && (
                    <a
                      href={currentCompany.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 shrink-0" />
                      <span>LinkedIn Page</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="card-base p-6 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Follow {currentCompany.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get updates when {currentCompany.name} posts new jobs.
                </p>
                <button
                  type="button"
                  className="w-full btn-primary bg-linear-to-r from-primary to-primary/80 text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
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
