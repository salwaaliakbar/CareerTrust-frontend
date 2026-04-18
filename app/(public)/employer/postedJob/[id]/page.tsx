"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ApplicantsList from "@/components/employer/ApplicantsList";
import { fetchJobApplications } from "@/services/api/employer.service";
import { JobApplication } from "@/types/application.types";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Filter,
  Search,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { ApplicationStatus } from "@/types/application.types";

export default function JobApplicantsPage() {
  const params = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const jobId = params?.id as string;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );

  useEffect(() => {
    const loadApplications = async () => {
      if (!jobId) return;

      setLoading(true);
      try {
        const { applications: apps, jobTitle: title } =
          await fetchJobApplications(jobId, getToken);
        setApplications(apps);
        setFilteredApplications(apps);
        setJobTitle(title);
      } catch (error) {
        console.error("Error loading applications:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Applications",
          text: "Please refresh the page to try again",
        });
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [jobId]);

  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicant.fullName.toLowerCase().includes(term) ||
          app.applicant.email.toLowerCase().includes(term) ||
          app.applicant.headline?.toLowerCase().includes(term) ||
          app.applicant.skills?.some((skill) =>
            skill.toLowerCase().includes(term),
          ),
      );
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const handleStatusUpdate = (
    applicationId: string,
    newStatus: ApplicationStatus,
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus, updatedDate: new Date().toISOString() }
          : app,
      ),
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewing: applications.filter((app) => app.status === "reviewing").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted")
      .length,
    interviewed: applications.filter((app) => app.status === "interviewed")
      .length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    hired: applications.filter((app) => app.status === "hired").length,
    offer_accepted: applications.filter(
      (app) => app.status === "offer_accepted",
    ).length,
    offer_declined: applications.filter(
      (app) => app.status === "offer_declined",
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 bg-[#0B1F45]" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-size-[40px_40px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

          <div className="relative z-10 px-7 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
               

                <div className="mt-4 flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4 text-blue-300/80" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                    Job Applicants Panel
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  Job Applicants
                </h1>

                {jobTitle && (
                  <p className="mt-2 text-xl font-extrabold text-cyan-200">
                    {jobTitle}
                  </p>
                )}

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-200/85 sm:text-base">
                  Review candidates, track pipeline progress, and update applicant statuses for this posting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-slate-600">Total</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-yellow-700">Pending</p>
            <p className="text-2xl font-black text-yellow-900">{stats.pending}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-blue-700">Reviewing</p>
            <p className="text-2xl font-black text-blue-900">{stats.reviewing}</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-purple-700">Shortlisted</p>
            <p className="text-2xl font-black text-purple-900">{stats.shortlisted}</p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-indigo-700">Interviewed</p>
            <p className="text-2xl font-black text-indigo-900">{stats.interviewed}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-green-700">Hired</p>
            <p className="text-2xl font-black text-green-900">{stats.hired}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-emerald-700">Offer Accepted</p>
            <p className="text-2xl font-black text-emerald-900">{stats.offer_accepted}</p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-orange-700">Offer Declined</p>
            <p className="text-2xl font-black text-orange-900">{stats.offer_declined}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.4)]">
            <p className="mb-1 text-xs font-semibold text-red-700">Rejected</p>
            <p className="text-2xl font-black text-red-900">{stats.rejected}</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Filter Applications
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, skills, or headline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 font-medium transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </div>

            <div className="relative min-w-55">
              <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ApplicationStatus | "all")
                }
                aria-label="Filter applications by status"
                className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 font-medium transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="offer_accepted">Offer Accepted</option>
                <option value="offer_declined">Offer Declined</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
              <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {applications.length === 0
                  ? "No Applications Yet"
                  : "No Applicants Found"}
              </h3>
              <p className="text-slate-600">
                {applications.length === 0
                  ? "Applications will appear here once candidates apply"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <ApplicantsList
              applications={filteredApplications}
              onStatusUpdate={handleStatusUpdate}
              getToken={getToken}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}