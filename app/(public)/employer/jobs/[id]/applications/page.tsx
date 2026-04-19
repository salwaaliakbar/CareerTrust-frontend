"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ApplicantsList from "@/components/employer/ApplicantsList";
import { fetchJobApplications } from "@/services/api/employer.service";
import { JobApplication } from "@/types/application.types";
import { ArrowLeft, Briefcase, Users, Filter, Search } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { ApplicationStatus } from "@/types/application.types";

export default function JobApplicantsPage() {
  const params = useParams();
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

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by search term
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blue Hero Header */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 bg-[#0B1F45]" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_15%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_85%_15%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_85%,#0ea5e922_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

          <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
            <Link
              href="/employer/dashboard"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white font-semibold mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
              Job Applicants
            </h1>
            {jobTitle && (
              <p className="text-lg sm:text-xl font-bold text-blue-200 mb-2">{jobTitle}</p>
            )}
            <p className="text-blue-100/85 text-sm sm:text-base max-w-2xl">
              Review and manage applications for this position.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
            <p className="text-xs font-semibold text-slate-600 mb-1">Total</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50/70 rounded-xl p-4 shadow-md border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">Pending</p>
            <p className="text-2xl font-black text-blue-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">
              Reviewing
            </p>
            <p className="text-2xl font-black text-blue-900">
              {stats.reviewing}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 shadow-md border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700 mb-1">
              Shortlisted
            </p>
            <p className="text-2xl font-black text-indigo-900">
              {stats.shortlisted}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 shadow-md border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700 mb-1">
              Interviewed
            </p>
            <p className="text-2xl font-black text-indigo-900">
              {stats.interviewed}
            </p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4 shadow-md border border-cyan-200">
            <p className="text-xs font-semibold text-cyan-700 mb-1">Hired</p>
            <p className="text-2xl font-black text-cyan-900">{stats.hired}</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-4 shadow-md border border-sky-200">
            <p className="text-xs font-semibold text-sky-700 mb-1">
              Offer Accepted
            </p>
            <p className="text-2xl font-black text-sky-900">
              {stats.offer_accepted}
            </p>
          </div>
          <div className="bg-slate-100 rounded-xl p-4 shadow-md border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Offer Declined
            </p>
            <p className="text-2xl font-black text-slate-900">
              {stats.offer_declined}
            </p>
          </div>
          <div className="bg-rose-50 rounded-xl p-4 shadow-md border border-rose-200">
            <p className="text-xs font-semibold text-rose-700 mb-1">Rejected</p>
            <p className="text-2xl font-black text-rose-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white/95 rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, skills, or headline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-100 bg-blue-50/30 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-50">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  title="Filter applications by status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ApplicationStatus | "all")
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-100 bg-blue-50/30 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium appearance-none cursor-pointer"
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
          </div>
        </div>

        {/* Applicants List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
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
      </main>

      <Footer />
    </div>
  );
}
