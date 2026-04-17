"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Circle,
  Eye,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { API_ENDPOINTS } from "@/constants/api";

type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "rejected"
  | "hired"
  | "offer_accepted"
  | "offer_declined"
  | "withdrawn";

interface JobDetail {
  id: number;
  title: string;
  location: string;
  jobType: string;
  salary?: string;
  company?: { name: string; logo?: string };
}

interface Application {
  id: number;
  jobId: number;
  status: ApplicationStatus;
  appliedAt: string;
  job?: JobDetail;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  reviewing: {
    label: "Reviewing",
    color: "bg-blue-100 text-blue-700",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-purple-100 text-purple-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  interviewed: {
    label: "Interviewed",
    color: "bg-indigo-100 text-indigo-700",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  hired: {
    label: "Hired",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  offer_accepted: {
    label: "Offer Accepted",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  offer_declined: {
    label: "Offer Declined",
    color: "bg-orange-100 text-orange-700",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-600",
    icon: <Circle className="w-3.5 h-3.5" />,
  },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-600",
    icon: <Circle className="w-3.5 h-3.5" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function CompanyLogo({ job }: { job?: JobDetail }) {
  const [failedLogoSrc, setFailedLogoSrc] = useState("");
  const logo = job?.company?.logo;
  const name = job?.company?.name ?? job?.title ?? "?";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  if (
    logo &&
    (logo.startsWith("http") || logo.startsWith("/")) &&
    failedLogoSrc !== logo
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
        onError={() => setFailedLogoSrc(logo)}
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0C2B4E] to-[#1D546C] flex items-center justify-center shrink-0">
      <span className="text-white text-sm font-bold">{initials}</span>
    </div>
  );
}

export default function ApplicationsPage() {
  const { userId, isLoaded } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const staggerClass = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
  ];

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch applications list
        const appsRes = await fetch(
          API_ENDPOINTS.APPLICATIONS_BY_CLERKID(userId),
        );

        // 404 means the jobseeker profile doesn't exist yet — treat as empty
        if (appsRes.status === 404) {
          setApplications([]);
          setLoading(false);
          return;
        }

        const appsData = await appsRes.json();
        if (!appsData.success) throw new Error("Failed to load applications");

        const rawApps: Application[] = appsData.data ?? [];

        // 2. Enrich each application with job details (parallel)
        const enriched = await Promise.all(
          rawApps.map(async (app) => {
            try {
              const jobRes = await fetch(API_ENDPOINTS.JOB_BY_ID(app.jobId));
              const jobData = await jobRes.json();
              return { ...app, job: jobData.data ?? undefined };
            } catch {
              return app;
            }
          }),
        );

        setApplications(enriched);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoaded, userId]);

  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const title = app.job?.title ?? "";
    const company = app.job?.company?.name ?? "";
    const matchesSearch =
      search.trim() === "" ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = applications.reduce<Record<string, number>>(
    (acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const activeApplications = applications.filter((a) =>
    ["pending", "reviewing", "shortlisted", "interviewed"].includes(a.status),
  ).length;
  const hiredApplications =
    (statusCounts["hired"] ?? 0) + (statusCounts["offer_accepted"] ?? 0);
  const rejectedApplications = statusCounts["rejected"] ?? 0;

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col smooth-enter">
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)] fade-in-up animation-delay-100">
          <div className="absolute inset-0 bg-[#0B1F45]" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

          <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Jobseeker Hub
                </div>
                <h1 className="text-3xl font-black text-white sm:text-4xl">
                  My Applications
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-blue-100/85 sm:text-base">
                  Track progress, monitor interview status, and stay on top of every opportunity.
                </p>
              </div>

              {!loading && applications.length > 0 && (
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto lg:min-w-120">
                  {(
                    [
                      ["Total", applications.length, "border-blue-300/30 bg-blue-500/15 text-blue-100"],
                      ["Active", activeApplications, "border-purple-300/30 bg-purple-500/15 text-purple-100"],
                      ["Hired", hiredApplications, "border-emerald-300/30 bg-emerald-500/15 text-emerald-100"],
                      ["Rejected", rejectedApplications, "border-red-300/30 bg-red-500/15 text-red-100"],
                    ] as [string, number, string][]
                  ).map(([label, count, cls], idx) => (
                    <div
                      key={label}
                      className={`rounded-xl border px-3 py-3 text-center backdrop-blur-sm fade-in-up ${staggerClass[idx % staggerClass.length]} ${cls}`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-90">{label}</p>
                      <p className="mt-1 text-xl font-black text-white">{count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 inline-flex items-start gap-2 rounded-xl border border-blue-300/30 bg-blue-500/20 px-4 py-2.5 text-sm text-blue-100">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Application statuses update in real time as employers move you through the hiring pipeline.
            </div>
          </div>
        </section>

        {/* Filters row */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 fade-in-up animation-delay-200">
          <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300/60 bg-slate-50/40"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter applications by status"
              title="Filter applications by status"
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-blue-300/60 appearance-none"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>
          </div>
        </section>

        {/* Content */}
        {!isLoaded || loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 flex flex-col items-center justify-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-slate-500 text-sm">Loading your applications…</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center rounded-2xl border border-red-200 bg-white shadow-sm">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Briefcase className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No applications yet
            </h2>
            <p className="text-slate-500 mb-6">
              Browse open positions and apply to kick-start your journey.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#0A1F44] via-[#123560] to-[#1A4779] text-white rounded-xl font-semibold hover:brightness-110 transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No results found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {filtered.map((app, idx) => (
              <div
                key={app.id}
                className={`bg-linear-to-br from-white via-blue-50/20 to-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-[0_18px_35px_-22px_rgba(15,23,42,0.4)] hover:border-blue-200 transition-all duration-200 fade-in-up ${staggerClass[idx % staggerClass.length]}`}
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo job={app.job} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base truncate">
                          {app.job?.title ?? `Job #${app.jobId}`}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {app.job?.company?.name ?? "Company"}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      {app.job?.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.job.location}
                        </span>
                      )}
                      {app.job?.jobType && (
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {app.job.jobType}
                        </span>
                      )}
                      {app.job?.salary && (
                        <span className="font-medium text-slate-700">
                          {app.job.salary}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 hover:border-blue-300 transition-all"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
