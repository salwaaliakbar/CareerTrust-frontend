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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-2">
              <Link
                href="/jobseeker/profile"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Profile
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Submit Exit Request
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Request to end your current employment
                </p>
              </div>
            </div>
          </div>

          {/* Submitted Exit Requests */}
          {exitRequests.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                My Submitted Requests
              </h2>
              <div className="space-y-3">
                {exitRequests.map((req) => {
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
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-slate-500" />
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
            </div>
          )}

          {/* Submit new exit request */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
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
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Select a current (active) employment below to submit an exit
                request.
              </p>

              {employments.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-blue-600" />
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
                            {new Date(emp.startDate).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    {emp.currentlyWorking ? (
                      <button
                        onClick={() => setSelectedEmployment(emp)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow hover:from-red-600 hover:to-orange-600 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Request Exit
                      </button>
                    ) : (
                      <span className="flex-shrink-0 px-4 py-2 text-xs text-slate-400 border border-slate-200 rounded-xl bg-slate-50">
                        Not active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Exit Request Modal */}
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
