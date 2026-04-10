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
  ArrowLeft,
  Search,
  Filter,
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
  const logo = job?.company?.logo;
  const name = job?.company?.name ?? job?.title ?? "?";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  if (logo && (logo.startsWith("http") || logo.startsWith("/"))) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col smooth-enter">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/jobseeker/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6 transition-colors fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-6 fade-in-up animation-delay-100">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">
            Track the status of all your job applications.
          </p>
        </div>

        {/* Stats strip */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 fade-in-up animation-delay-200">
            {(
              [
                ["Total", applications.length, "bg-blue-50 text-blue-700"],
                [
                  "Active",
                  applications.filter((a) =>
                    [
                      "pending",
                      "reviewing",
                      "shortlisted",
                      "interviewed",
                    ].includes(a.status),
                  ).length,
                  "bg-purple-50 text-purple-700",
                ],
                [
                  "Hired",
                  (statusCounts["hired"] ?? 0) +
                    (statusCounts["offer_accepted"] ?? 0),
                  "bg-green-50 text-green-700",
                ],
                [
                  "Rejected",
                  statusCounts["rejected"] ?? 0,
                  "bg-red-50 text-red-700",
                ],
              ] as [string, number, string][]
            ).map(([label, count, cls], idx) => (
              <div key={label} className={`rounded-xl p-4 ${cls} text-center fade-in-up ${staggerClass[idx % staggerClass.length]}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 fade-in-up animation-delay-300">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter applications by status"
              title="Filter applications by status"
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
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

        {/* Content */}
        {!isLoaded || loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-gray-500 text-sm">Loading your applications…</p>
          </div>
        ) : error ? (
          <div className="card-base p-8 text-center rounded-2xl border border-red-200 bg-red-50">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card-base p-12 text-center rounded-2xl border border-gray-200 bg-white">
            <Briefcase className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No applications yet
            </h2>
            <p className="text-gray-500 mb-6">
              Browse open positions and apply to kick-start your journey.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-base p-10 text-center rounded-2xl border border-gray-200 bg-white">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No results found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app, idx) => (
              <div
                key={app.id}
                className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 fade-in-up ${staggerClass[idx % staggerClass.length]}`}
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo job={app.job} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {app.job?.title ?? `Job #${app.jobId}`}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {app.job?.company?.name ?? "Company"}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
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
                        <span className="font-medium text-gray-700">
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
                    className="shrink-0 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
