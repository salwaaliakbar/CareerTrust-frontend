"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { AdminService } from "@/services/api/admin.service";
import { AdminExitRequest } from "@/types/admin.types";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";

type StatusFilter = "pending" | "approved" | "rejected";

export default function AdminExitRequestsPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [requests, setRequests] = useState<AdminExitRequest[]>([]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await AdminService.getAdminExitRequests(token, {
        status,
        page: 1,
        limit: 100,
      });
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching admin exit requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const counters = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests],
  );

  const respond = async (id: number, action: "approved" | "rejected") => {
    setSubmittingId(id);
    try {
      const token = await getToken();
      let adminNote: string | undefined;

      if (action === "rejected") {
        const note = window.prompt("Optional rejection reason for jobseeker:", "");
        adminNote = note ?? undefined;
      }

      await AdminService.respondToAdminExitRequest(token, id, action, adminNote);
      await fetchRequests();
    } catch (error) {
      console.error("Error responding to self-exit request:", error);
      alert("Failed to update request. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-20 -right-12 w-105 h-105 rounded-full blur-3xl bg-linear-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />

      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">Admin Review Queue</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">Self Exit Requests</h1>
        <p className="text-gray-600">
          Non-platform company exits are reviewed and finalized by admin here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Visible Requests" value={counters.total} tone="blue" />
        <StatCard title="Pending" value={counters.pending} tone="amber" />
        <StatCard title="Approved" value={counters.approved} tone="green" />
        <StatCard title="Rejected" value={counters.rejected} tone="rose" />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200/60 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["pending", "approved", "rejected"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                status === item
                  ? "bg-[#0C2B4E] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200/60">
        {loading ? (
          <div className="h-56 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0C2B4E]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center gap-2">
            <Clock3 className="w-10 h-10 text-gray-300" />
            <p className="text-lg font-semibold text-gray-700">No {status} self-exit requests</p>
            <p className="text-sm text-gray-500">Requests from non-platform companies will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-gray-200 p-4 bg-linear-to-br from-white via-blue-50/20 to-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0C2B4E]">{req.company}</p>
                    <p className="text-sm text-gray-700">{req.position}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Jobseeker: {req.employment?.jobseekerProfile?.fullName || "Unknown"}
                      {req.employment?.jobseekerProfile?.email
                        ? ` (${req.employment.jobseekerProfile.email})`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested end date: {new Date(req.requestedEndDate).toLocaleDateString("en-US")}
                    </p>
                    {req.reason && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-md p-2 border border-gray-100">
                        Reason: {req.reason}
                      </p>
                    )}
                    {req.employerNote && (
                      <p className="text-xs text-gray-600 mt-2 bg-amber-50 rounded-md p-2 border border-amber-100">
                        Admin note: {req.employerNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => respond(req.id, "approved")}
                          disabled={submittingId === req.id}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => respond(req.id, "rejected")}
                          disabled={submittingId === req.id}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          req.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {req.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "blue" | "amber" | "green" | "rose";
}) {
  const toneClass = {
    blue: "text-[#0C2B4E] bg-[#0C2B4E]/10",
    amber: "text-amber-700 bg-amber-100",
    green: "text-emerald-700 bg-emerald-100",
    rose: "text-rose-700 bg-rose-100",
  }[tone];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`w-8 h-8 rounded-md ${toneClass}`} />
      </div>
    </div>
  );
}
