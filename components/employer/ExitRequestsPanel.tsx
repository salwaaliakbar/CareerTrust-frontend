"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building2,
  Briefcase,
  Calendar,
  MessageSquare,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  getEmployerExitRequests,
  respondToExitRequest,
  ExitRequestWithEmployment,
} from "@/services/api/exitRequest.service";
import Swal from "sweetalert2";

interface ExitRequestsPanelProps {
  getToken?: () => Promise<string | null>;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
} as const;

export default function ExitRequestsPanel({
  getToken,
}: ExitRequestsPanelProps) {
  const [requests, setRequests] = useState<ExitRequestWithEmployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const data = await getEmployerExitRequests(getToken);
    setRequests(data);
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    const run = async () => {
      await loadRequests();
    };
    run();
  }, [loadRequests]);

  const handleRespond = async (
    id: number,
    status: "approved" | "rejected",
    company: string,
    position: string,
  ) => {
    const { value: employerNote, isConfirmed } = await Swal.fire({
      title:
        status === "approved" ? "Approve Exit Request" : "Reject Exit Request",
      html: `
        <p class="text-sm text-slate-600 mb-3">
          ${status === "approved" ? "Approve" : "Reject"} the exit request for <strong>${position}</strong> from <strong>${company}</strong>?
        </p>
        <textarea
          id="swal-note"
          class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          rows="3"
          placeholder="Optional note to the employee..."
        ></textarea>
      `,
      icon: status === "approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: status === "approved" ? "Approve" : "Reject",
      confirmButtonColor: status === "approved" ? "#10b981" : "#ef4444",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return (
          (document.getElementById("swal-note") as HTMLTextAreaElement)
            ?.value || undefined
        );
      },
    });

    if (!isConfirmed) return;

    setRespondingId(id);
    const result = await respondToExitRequest(
      id,
      status,
      employerNote as string | undefined,
      getToken,
    );
    setRespondingId(null);

    if (result.success) {
      await Swal.fire({
        title: status === "approved" ? "Approved!" : "Rejected",
        text: `Exit request ${status}. The employee has been notified.`,
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });
      loadRequests();
    } else {
      Swal.fire("Error", result.message ?? "Failed to respond.", "error");
    }
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-rose-400 to-red-500 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-500" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-rose-500 to-red-600 rounded-full shadow-lg" />
              Exit Requests
            </h2>
            <p className="text-sm text-slate-500 mt-1 ml-5 font-medium">
              Manage employee departure requests
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {(["all", "pending", "approved", "rejected"] as const).map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      filter === f
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f}
                    {f === "pending" && (
                      <span className="ml-1 bg-amber-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">
                        {requests.filter((r) => r.status === "pending").length}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => loadRequests()}
              disabled={loading}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-linear-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
            <LogOut className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-400" />
            <p className="text-sm font-bold text-slate-400">
              {filter === "pending"
                ? "No pending exit requests"
                : filter === "all"
                  ? "No exit requests yet"
                  : `No ${filter} requests`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => {
              const statusCfg =
                statusConfig[req.status as keyof typeof statusConfig] ??
                statusConfig.pending;
              const StatusIcon = statusCfg.icon;
              const jobseeker = req.employment.jobseekerProfile;

              return (
                <div
                  key={req.id}
                  className="p-5 bg-linear-to-br from-white to-slate-50 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Employee info */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="p-2.5 bg-linear-to-br from-slate-100 to-slate-200 rounded-xl shrink-0">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-base">
                          {jobseeker.fullName ?? "Unknown Employee"}
                        </p>
                        {jobseeker.email && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {jobseeker.email}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="font-semibold">
                              {req.position}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="font-medium">{req.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Since {req.employment.startDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 ${statusCfg.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Request details */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-xs font-black text-amber-700 mb-0.5">
                        Requested End Date
                      </p>
                      <p className="text-sm font-bold text-amber-900">
                        {req.requestedEndDate}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <p className="text-xs font-black text-slate-600 mb-0.5">
                        Submitted
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {req.reason && (
                      <div className="sm:col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-xs font-black text-blue-700 mb-0.5 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Employee Reason
                        </p>
                        <p className="text-sm text-blue-800 font-medium">
                          {req.reason}
                        </p>
                      </div>
                    )}
                    {req.employerNote && req.status !== "pending" && (
                      <div className="sm:col-span-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <p className="text-xs font-black text-indigo-700 mb-0.5">
                          Your Note
                        </p>
                        <p className="text-sm text-indigo-800 font-medium">
                          {req.employerNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions (only for pending requests) */}
                  {req.status === "pending" && (
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        disabled={respondingId === req.id}
                        onClick={() =>
                          handleRespond(
                            req.id,
                            "approved",
                            req.company,
                            req.position,
                          )
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {respondingId === req.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={respondingId === req.id}
                        onClick={() =>
                          handleRespond(
                            req.id,
                            "rejected",
                            req.company,
                            req.position,
                          )
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-rose-500 to-red-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {respondingId === req.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
