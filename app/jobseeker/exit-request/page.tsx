"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExitRequestModal from "@/components/jobseekerDashboard/ExitRequestModal";
import { EmploymentRecord } from "@/types/jobseeker.types";
import { API_ENDPOINTS } from "@/constants/api";
import {
  LogOut,
  Building2,
  Briefcase,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ShieldCheck,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import {
  getMyExitRequests,
  ExitRequest,
} from "@/services/api/exitRequest.service";

const ExitRequestPage = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();

  const [employments, setEmployments] = useState<EmploymentRecord[]>([]);
  const [exitRequests, setExitRequests] = useState<ExitRequest[]>([]);
  const staggerClass = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
  ];
  const [loading, setLoading] = useState(true);
  const [selectedEmployment, setSelectedEmployment] =
    useState<EmploymentRecord | null>(null);

  const isReady = isAuthLoaded && isUserLoaded;

  useEffect(() => {
    if (!isReady || !user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(
          `${API_ENDPOINTS.JOBSEEKER_PROFILE_GET}?clerkId=${encodeURIComponent(user.id)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          },
        );

        if (!res.ok) {
          setEmployments([]);
          return;
        }

        const json = await res.json();
        const allEmployments: EmploymentRecord[] =
          json?.data?.employmentHistory ?? [];
        setEmployments(allEmployments);

        // Also fetch submitted exit requests
        const requests = await getMyExitRequests(getToken);
        setExitRequests(requests);
      } catch (err) {
        console.error("[ExitRequestPage] Error fetching profile:", err);
        setEmployments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isReady, user, getToken]);

  return (
    <>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <main className="min-h-screen bg-[#F4F6FB] py-8 sm:py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 smooth-enter space-y-8">
          {/* Page Header */}
          <div className="mb-2 fade-in-up">
            <Link
              href="/jobseeker/profile"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white">
                ←
              </span>
              Back to Profile
            </Link>
          </div>

          <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)] fade-in-up animation-delay-100">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Employment Workflow
                  </div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                    Submit Exit Request
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-blue-100/85 sm:text-base">
                    Start your formal offboarding request for active employment records and track approval updates in one place.
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:min-w-84">
                  <div className="rounded-xl border border-blue-300/30 bg-blue-500/15 px-3 py-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-100">
                      Employments
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{employments.length}</p>
                  </div>
                  <div className="rounded-xl border border-amber-300/30 bg-amber-500/15 px-3 py-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-100">
                      Requests
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{exitRequests.length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 inline-flex items-start gap-2 rounded-xl border border-blue-300/30 bg-blue-500/20 px-4 py-2.5 text-sm text-blue-100">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Requests can only be submitted for currently active employment records.
              </div>
            </div>
          </section>

          {/* Submitted Exit Requests */}
          {exitRequests.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 fade-in-up animation-delay-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">My Submitted Requests</h2>
                  <p className="text-sm text-slate-500">Track approval status and employer notes</p>
                </div>
              </div>
              <div className="space-y-3">
                {exitRequests.map((req, idx) => {
                  const statusConfig = {
                    pending: {
                      icon: <Clock className="w-4 h-4 text-amber-500" />,
                      label: "Pending",
                      cls: "bg-amber-100 text-amber-700",
                    },
                    approved: {
                      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
                      label: "Approved",
                      cls: "bg-green-100 text-green-700",
                    },
                    rejected: {
                      icon: <XCircle className="w-4 h-4 text-red-500" />,
                      label: "Rejected",
                      cls: "bg-red-100 text-red-700",
                    },
                  }[req.status];
                  return (
                    <div
                      key={req.id}
                      className={`bg-linear-to-br from-white via-blue-50/20 to-white rounded-2xl border border-slate-200 shadow-sm p-5 fade-in-up ${staggerClass[idx % staggerClass.length]}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {req.company}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {req.position}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              Requested end:{" "}
                              {new Date(
                                req.requestedEndDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {req.employerNote && (
                              <p className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                                <span className="font-medium">
                                  Employer note:
                                </span>{" "}
                                {req.employerNote}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shrink-0 ${statusConfig.cls}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Submit new exit request */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 flex flex-col items-center justify-center gap-4 shadow-sm">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">
                Loading your employment records…
              </p>
            </div>
          ) : employments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-700">
                No employment history found
              </p>
              <p className="text-slate-400 max-w-sm text-sm">
                You don&apos;t have any employment records on your profile yet.
                Add your work history on your profile page first.
              </p>
              <Link
                href="/jobseeker/profile"
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Go to Profile
              </Link>
            </div>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 fade-in-up animation-delay-200">
              <p className="text-sm text-slate-500 mb-5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Select a current (active) employment below to submit an exit request.
              </p>

              <div className="space-y-4">
                {employments.map((emp, idx) => (
                  <div
                    key={emp.id}
                    className={`bg-linear-to-br from-white via-blue-50/20 to-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_18px_35px_-22px_rgba(15,23,42,0.4)] hover:border-blue-200 transition-all duration-200 p-6 fade-in-up ${staggerClass[idx % staggerClass.length]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] rounded-xl flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-slate-900 text-base">
                              {emp.company}
                            </h3>
                            {emp.currentlyWorking ? (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                Current
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-500">
                                Past
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{emp.position}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Since{" "}
                              {new Date(emp.startDate).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      {emp.currentlyWorking ? (
                        <button
                          onClick={() => setSelectedEmployment(emp)}
                          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-[0_10px_24px_-12px_rgba(239,68,68,0.55)] hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          Request Exit
                        </button>
                      ) : (
                        <span className="shrink-0 px-4 py-2 text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
                          Not active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      {selectedEmployment && (
        <ExitRequestModal
          isOpen={selectedEmployment !== null}
          onClose={() => setSelectedEmployment(null)}
          employment={selectedEmployment}
          getToken={getToken}
          onSuccess={() => {
            setSelectedEmployment(null);
            // Remove submitted employment from the list to prevent double-submission
            setEmployments((prev) =>
              prev.filter((e) => e.id !== selectedEmployment.id),
            );
            // Refresh exit requests to show the new one
            getMyExitRequests(getToken).then(setExitRequests);
          }}
        />
      )}
    </>
  );
};

export default ExitRequestPage;
