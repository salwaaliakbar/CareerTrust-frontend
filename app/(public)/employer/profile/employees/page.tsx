"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  MapPin,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getCurrentEmployees,
  type CurrentEmployee,
} from "@/services/api/employerCompany.service";

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function EmployerEmployeesPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [employees, setEmployees] = useState<CurrentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        const data = await getCurrentEmployees(user.id, getToken);
        setCompanyName(data.company?.name || null);
        setEmployees(data.employees || []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load employees",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [getToken, isLoaded, user]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/employer/profile"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Company Profile
            </Link>
          </div>

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Employees
                </p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">
                  Current Employees
                </h1>
                <p className="mt-2 text-slate-600">
                  {companyName
                    ? `Employees currently working at ${companyName}.`
                    : "Employees with active employment records."}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Visible Employees
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {employees.length}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">Loading employees...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Unable to load employees
              </h2>
              <p className="mt-2 text-slate-600">{error}</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Users className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                No current employees found
              </h2>
              <p className="mt-2 text-slate-600">
                Only jobseekers with active employment records for this company
                are shown here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {employees.map((employee) => (
                <Link
                  key={employee.jobseekerId}
                  href={`/profile/${employee.clerkId}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      {employee.profilePicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={employee.profilePicUrl}
                          alt={employee.fullName || "Employee"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="h-7 w-7 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-bold text-slate-900 group-hover:text-blue-700">
                          {employee.fullName || "Unnamed employee"}
                        </h2>
                        {employee.currentEmployment?.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      {employee.headline && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {employee.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    {employee.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {employee.location}
                      </div>
                    )}
                    {employee.currentEmployment && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {employee.currentEmployment.company}
                      </div>
                    )}
                    {employee.currentEmployment?.position && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-400" />
                        {employee.currentEmployment.position}
                      </div>
                    )}
                    {employee.currentEmployment?.startDate && (
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400" />
                        Working since{" "}
                        {formatDate(employee.currentEmployment.startDate)}
                      </div>
                    )}
                  </div>

                  {employee.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {employee.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 4 && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          +{employee.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
