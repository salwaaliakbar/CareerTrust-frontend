"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Star,
  User,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  checkCompanyStatus,
  getEmployerCompanyProfileDetails,
  type EmployerCompanyProfileDetails,
} from "@/services/api/employerCompany.service";
import { fetchEmployerJobs } from "@/services/api/employer.service";
import { EmployerJob } from "@/types/application.types";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EmployerProfilePage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<EmployerCompanyProfileDetails | null>(
    null,
  );
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        const status = await checkCompanyStatus(user.id, getToken);

        if (!status.hasCompany) {
          setProfile({
            hasCompany: false,
            company: null,
            employerProfile: null,
            currentEmployeesCount: 0,
          });
          setError(null);
          return;
        }

        const [details, employerJobs] = await Promise.all([
          getEmployerCompanyProfileDetails(user.id, getToken),
          fetchEmployerJobs(user.id, getToken),
        ]);
        setProfile(details);
        setJobs(employerJobs);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load company profile",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [getToken, isLoaded, user]);

  const company = profile?.company;
  const employerMeta = profile?.employerProfile;

  const activeJobs = jobs.filter((j) => j.status === "active");
  const pastJobs = jobs.filter((j) => j.status !== "active");

  const employerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "N/A";
  const employerEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "N/A";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            {company && (
              <Link
                href="/employer/profile/employees"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Users className="h-4 w-4" />
                View Employees
              </Link>
            )}
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                Unable to load profile
              </h1>
              <p className="mt-2 text-slate-600">{error}</p>
            </div>
          ) : !company ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                No company profile yet
              </h1>
              <p className="mt-2 text-slate-600">
                Set up your company profile to make it visible to candidates and
                manage your team view.
              </p>
              <Link
                href="/employer/company/setup"
                className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Complete Company Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Company header */}
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#f8fafc_100%)] px-8 py-10">
                  <div className="flex gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                      {company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-9 w-9 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                          {company.name}
                        </h1>
                        {company.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                        {company.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            <Star className="h-3.5 w-3.5" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-base font-medium text-slate-500">
                        {company.industry}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {company.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4" />
                          {activeJobs.length} active job
                          {activeJobs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {company.description && (
                  <div className="border-t border-slate-100 px-8 py-6">
                    <p className="whitespace-pre-wrap leading-7 text-slate-600">
                      {company.description}
                    </p>
                  </div>
                )}
              </section>

              {/* Employer details */}
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Employer Details
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={<User className="h-4 w-4" />}
                    label="Name"
                    value={employerName}
                  />
                  <DetailItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={employerEmail}
                  />
                  <DetailItem
                    icon={<Globe className="h-4 w-4" />}
                    label="Company URL"
                    value={employerMeta?.companyURL || "N/A"}
                    href={employerMeta?.companyURL || undefined}
                  />
                  <DetailItem
                    icon={<Linkedin className="h-4 w-4" />}
                    label="LinkedIn"
                    value={
                      employerMeta?.linkedinUrl || company.linkedinUrl || "N/A"
                    }
                    href={
                      employerMeta?.linkedinUrl ||
                      company.linkedinUrl ||
                      undefined
                    }
                  />
                  <DetailItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Profile Created"
                    value={formatDate(employerMeta?.createdAt)}
                  />
                </div>
              </section>

              {/* Current (active) jobs */}
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Current Listed Jobs
                  </h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {activeJobs.length} active
                  </span>
                </div>
                {activeJobs.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No active jobs right now.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {activeJobs.map((job) => (
                      <JobRow key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </section>

              {/* Past jobs */}
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Past Listed Jobs
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {pastJobs.length} total
                  </span>
                </div>
                {pastJobs.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No past jobs found.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {pastJobs.map((job) => (
                      <JobRow key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function DetailItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {href && value !== "N/A" ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 block break-all text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 break-all text-sm font-semibold text-slate-900">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function JobRow({ job }: { job: EmployerJob }) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-600",
    draft: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          {job.title}
        </p>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(job.postedDate)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs text-slate-500">
          {job.applicationsCount} application
          {job.applicationsCount !== 1 ? "s" : ""}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[job.status] ?? "bg-slate-100 text-slate-600"}`}
        >
          {job.status}
        </span>
      </div>
    </div>
  );
}
