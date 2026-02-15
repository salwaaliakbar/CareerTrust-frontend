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
  Download,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { ApplicationStatus } from "@/types/application.types";

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const jobId = params?.id as string;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
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
        const apps = await fetchJobApplications(jobId, getToken);
        setApplications(apps);
        setFilteredApplications(apps);
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/employer/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-blue-600" />
            Job Applicants
          </h1>
          <p className="text-lg text-slate-600">
            Review and manage applications for this position
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1">Total</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-md border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-700 mb-1">
              Pending
            </p>
            <p className="text-2xl font-black text-yellow-900">
              {stats.pending}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-md border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">
              Reviewing
            </p>
            <p className="text-2xl font-black text-blue-900">
              {stats.reviewing}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-200">
            <p className="text-xs font-semibold text-purple-700 mb-1">
              Shortlisted
            </p>
            <p className="text-2xl font-black text-purple-900">
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
          <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">Hired</p>
            <p className="text-2xl font-black text-green-900">{stats.hired}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 shadow-md border border-red-200">
            <p className="text-xs font-semibold text-red-700 mb-1">Rejected</p>
            <p className="text-2xl font-black text-red-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, skills, or headline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ApplicationStatus | "all")
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
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
