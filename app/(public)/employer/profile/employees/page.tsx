"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
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
        setError(err instanceof Error ? err.message : "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [getToken, isLoaded, user]);

  return (
    <>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />
      <main className="min-h-screen bg-[#f4f7fb] pt-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl shadow-[#0b1f45]/25">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_12%_45%,#1e40af40_0%,transparent_60%),radial-gradient(ellipse_at_88%_18%,#4f46e540_0%,transparent_55%),radial-gradient(ellipse_at_70%_85%,#0ea5e930_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.06] bg-size-[38px_38px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

            <div className="relative z-10 px-7 py-12 sm:px-10 sm:py-17 lg:px-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Employees
                  </p>
                  <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                    Current Employees
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-blue-100/90">
                    {companyName
                      ? `Employees currently working at ${companyName}.`
                      : "Employees with active employment records."}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/85">
                      Visible Employees
                    </p>
                    <p className="mt-1 text-3xl font-black text-white">{employees.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
              <p className="text-slate-500">Loading employees...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-[0_22px_55px_-30px_rgba(239,68,68,0.35)]">
              <h2 className="text-2xl font-bold text-slate-900">Unable to load employees</h2>
              <p className="mt-2 text-slate-600">{error}</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)]">
              <Users className="mx-auto h-11 w-11 text-slate-300" />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">No current employees found</h2>
              <p className="mt-2 text-slate-600">
                Only jobseekers with active employment records for this company are shown here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {employees.map((employee) => (
                <Link
                  key={employee.jobseekerId}
                  href={`/profile/${employee.clerkId}`}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_22px_55px_-30px_rgba(12,43,78,0.35)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_60px_-28px_rgba(29,78,216,0.35)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
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
                        <h2 className="truncate text-xl font-bold text-slate-900 transition group-hover:text-blue-700">
                          {employee.fullName || "Unnamed employee"}
                        </h2>
                        {employee.currentEmployment?.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      {employee.headline && (
                        <p className="mt-1 line-clamp-2 text-base text-slate-600">{employee.headline}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 text-base text-slate-600">
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
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Working since {formatDate(employee.currentEmployment.startDate)}
                      </div>
                    )}
                  </div>

                  {employee.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {employee.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 4 && (
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">
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
