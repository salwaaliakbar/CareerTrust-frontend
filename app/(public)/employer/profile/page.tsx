"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Briefcase,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  checkCompanyStatus,
  getEmployerCompanyProfileDetails,
  type EmployerCompanyProfileDetails,
} from "@/services/api/employerCompany.service";

const formatDate = (value?: string) => {
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

        const details = await getEmployerCompanyProfileDetails(
          user.id,
          getToken,
        );
        setProfile(details);
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
              <p className="text-slate-500">Loading company profile...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                Unable to load company profile
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
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#f8fafc_100%)] px-8 py-10">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-5">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                        {company.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-10 w-10 text-slate-400" />
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
                        <p className="mt-2 text-base font-medium text-slate-600">
                          {company.industry}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {company.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {company.employees} employees
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4" />
                            {company.openJobs ?? 0} open jobs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid min-w-[240px] grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                      <StatCard
                        label="Rating"
                        value={String(company.rating ?? 0)}
                      />
                      <StatCard
                        label="Reviews"
                        value={String(company.reviews ?? 0)}
                      />
                      <StatCard
                        label="Employees"
                        value={String(profile?.currentEmployeesCount ?? 0)}
                      />
                      <StatCard label="Record ID" value={String(company.id)} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-8 py-8">
                  <h2 className="text-lg font-bold text-slate-900">
                    Company Description
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                    {company.description || "No description available."}
                  </p>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <InfoCard title="Company Database Fields">
                  <FieldRow label="Company ID" value={String(company.id)} />
                  <FieldRow label="Name" value={company.name} />
                  <FieldRow label="Industry" value={company.industry} />
                  <FieldRow label="Location" value={company.location} />
                  <FieldRow
                    label="Employees"
                    value={String(company.employees)}
                  />
                  <FieldRow
                    label="Rating"
                    value={String(company.rating ?? 0)}
                  />
                  <FieldRow
                    label="Reviews"
                    value={String(company.reviews ?? 0)}
                  />
                  <FieldRow
                    label="Open Jobs"
                    value={String(company.openJobs ?? 0)}
                  />
                  <FieldRow
                    label="Featured"
                    value={company.featured ? "Yes" : "No"}
                  />
                  <FieldRow
                    label="Verified"
                    value={company.isVerified ? "Yes" : "No"}
                  />
                  <FieldRow
                    label="LinkedIn"
                    value={company.linkedinUrl || "N/A"}
                    href={company.linkedinUrl}
                  />
                  <FieldRow
                    label="Logo URL"
                    value={company.logo || "N/A"}
                    href={company.logo}
                  />
                  <FieldRow
                    label="Employer ID"
                    value={String(company.employerId)}
                  />
                  <FieldRow
                    label="Created At"
                    value={formatDate(company.createdAt)}
                  />
                  <FieldRow
                    label="Updated At"
                    value={formatDate(company.updatedAt)}
                  />
                </InfoCard>

                <InfoCard title="Employer Profile Fields">
                  <FieldRow
                    label="Employer Profile ID"
                    value={String(employerMeta?.employerId ?? "N/A")}
                  />
                  <FieldRow
                    label="Linked User ID"
                    value={String(employerMeta?.userId ?? "N/A")}
                  />
                  <FieldRow
                    label="Has Company"
                    value={employerMeta?.hasCompany ? "Yes" : "No"}
                  />
                  <FieldRow
                    label="Company Name Snapshot"
                    value={employerMeta?.companyName || "N/A"}
                  />
                  <FieldRow
                    label="Company URL"
                    value={employerMeta?.companyURL || "N/A"}
                    href={employerMeta?.companyURL || undefined}
                  />
                  <FieldRow
                    label="LinkedIn URL"
                    value={employerMeta?.linkedinUrl || "N/A"}
                    href={employerMeta?.linkedinUrl || undefined}
                  />
                  <FieldRow
                    label="Profile Created"
                    value={formatDate(employerMeta?.createdAt)}
                  />
                  <FieldRow
                    label="Profile Updated"
                    value={formatDate(employerMeta?.updatedAt)}
                  />

                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">Current Employees</p>
                        <p className="mt-1 text-blue-800/80">
                          View only employees with active employment records for
                          this company.
                        </p>
                      </div>
                      <Link
                        href="/employer/profile/employees"
                        className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Employees
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </InfoCard>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function FieldRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      {href && value !== "N/A" ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {value}
        </a>
      ) : (
        <span className="break-all text-sm font-semibold text-slate-900">
          {value}
        </span>
      )}
    </div>
  );
}
