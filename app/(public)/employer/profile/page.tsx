"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
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
import ReputationScoreCard from "@/components/companies/ReputationScoreCard";
import {
  checkCompanyStatus,
  getEmployerCompanyProfileDetails,
  type EmployerCompanyProfileDetails,
} from "@/services/api/employerCompany.service";
import { fetchEmployerJobs } from "@/services/api/employer.service";
import { EmployerJob } from "@/types/application.types";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getCompanyReputationById } from "@/redux/store/slices/companiesSlice";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EmployerProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<EmployerCompanyProfileDetails | null>(
    null,
  );
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reputationById = useAppSelector((state) => state.companies.reputationById);

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
  const companyReputation = company ? reputationById[String(company.id)] : null;

  useEffect(() => {
    if (!company?.id) return;
    dispatch(getCompanyReputationById(String(company.id)));
  }, [dispatch, company?.id]);

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
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />
      <main className="relative min-h-screen overflow-hidden bg-[#f4f7fb] pb-16 pt-10">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
              <p className="text-slate-500">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-[0_22px_55px_-30px_rgba(239,68,68,0.35)]">
              <h1 className="text-2xl font-bold text-slate-900">
                Unable to load profile
              </h1>
              <p className="mt-2 text-slate-600">{error}</p>
            </div>
          ) : !company ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-10 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
              <h1 className="text-2xl font-bold text-slate-900">
                No company profile yet
              </h1>
              <p className="mt-2 text-slate-600">
                Set up your company profile to make it visible to candidates and
                manage your team view.
              </p>
              <Link
                href="/employer/company/setup"
                className="mt-6 inline-flex rounded-full bg-linear-to-r from-[#0C2B4E] to-[#1D546C] px-5 py-3 text-sm font-semibold text-white transition hover:from-[#1A3D64] hover:to-[#2A5A7F]"
              >
                Complete Company Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="relative overflow-hidden rounded-3xl shadow-2xl shadow-[#0b1f45]/25">
                <div className="absolute inset-0 bg-[#0B1F45]" />
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_12%_45%,#1e40af40_0%,transparent_60%),radial-gradient(ellipse_at_88%_18%,#4f46e540_0%,transparent_55%),radial-gradient(ellipse_at_70%_85%,#0ea5e930_0%,transparent_50%)]" />
                <div className="absolute inset-0 opacity-[0.06] bg-size-[38px_38px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

                <div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/25 bg-white/10 shadow-lg shadow-black/20 backdrop-blur-sm sm:h-28 sm:w-28">
                      {company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-11 w-11 text-blue-100/80" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                          {company.name}
                        </h1>
                        {company.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/50 bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-50 backdrop-blur-sm">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                        {company.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-50 backdrop-blur-sm">
                            <Star className="h-3.5 w-3.5" />
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-lg font-semibold text-blue-100/85">
                        {company.industry}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2.5 text-base text-blue-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-medium backdrop-blur-sm">
                          <MapPin className="h-4 w-4 text-blue-200" />
                          {company.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-medium backdrop-blur-sm">
                          <Briefcase className="h-4 w-4 text-blue-200" />
                          {activeJobs.length} active job
                          {activeJobs.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-7 text-blue-50/90 sm:text-lg">
                        {company.description ||
                          "Add a company description to showcase your mission, values, and culture to top candidates."}
                      </p>
                    </div>

                    </div>

                    <div className="shrink-0">
                      <Link
                        href="/employer/profile/employees"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-white/20"
                      >
                        <Users className="h-4 w-4" />
                        View Employees
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <h2 className="text-xl font-bold text-slate-900">Employer Details</h2>
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

                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      Current Listed Jobs
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
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

                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      Past Listed Jobs
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
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

                <aside className="space-y-8 lg:col-span-1">
                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <h2 className="text-xl font-bold text-slate-900">
                    Company Reputation
                  </h2>
                  <div className="mt-5">
                    <ReputationScoreCard
                      reputation={companyReputation || null}
                      variant="employer"
                    />
                  </div>
                </section>

                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-500">
                    Snapshot
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                      <span className="text-base font-medium text-slate-600">Employees</span>
                      <span className="text-base font-bold text-slate-900">
                        {profile?.currentEmployeesCount ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                      <span className="text-base font-medium text-slate-600">Active jobs</span>
                      <span className="text-base font-bold text-slate-900">{activeJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                      <span className="text-base font-medium text-slate-600">Past jobs</span>
                      <span className="text-base font-bold text-slate-900">{pastJobs.length}</span>
                    </div>
                  </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-500">
                    Quick Actions
                  </h3>
                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      href="/employer/dashboard"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Go to Dashboard
                    </Link>
                    <Link
                      href="/employer/profile/employees"
                      className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#0B1F45] to-[#1d4ed8] px-4 py-2.5 text-base font-semibold text-white transition hover:from-[#0A1A38] hover:to-[#1e40af]"
                    >
                      Manage Employees
                    </Link>
                  </div>
                  </section>
                </aside>
              </div>
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
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 transition hover:border-blue-200 hover:bg-white">
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {href && value !== "N/A" ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 block break-all text-base font-semibold text-[#1d4ed8] hover:text-[#0B1F45]"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 break-all text-base font-semibold text-slate-900">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function JobRow({ job }: { job: EmployerJob }) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    closed: "bg-slate-100 text-slate-600 border border-slate-200",
    draft: "bg-amber-100 text-amber-700 border border-amber-200",
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 transition hover:border-blue-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-slate-900">
          {job.title}
        </p>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
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
        <span className="text-sm text-slate-500">
          {job.applicationsCount} application
          {job.applicationsCount !== 1 ? "s" : ""}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-sm font-semibold capitalize ${statusColors[job.status] ?? "border border-slate-200 bg-slate-100 text-slate-600"}`}
        >
          {job.status}
        </span>
      </div>
    </div>
  );
}
