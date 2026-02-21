"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmployerJobsList from "@/components/employer/EmployerJobsList";
import EmployerStats from "@/components/employer/EmployerStats";
import {
  Briefcase,
  Plus,
  Users,
  Search,
  Filter,
  Building2,
  AlertCircle,
  Lock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { fetchEmployerJobs } from "@/services/api/employer.service";
import { checkCompanyStatus } from "@/services/api/employerCompany.service";
import { EmployerJob } from "@/types/application.types";
import { EMPLOYER } from "@/constants/constant";
import Swal from "sweetalert2";

const EmployerDashboard = () => {
  const { user, isLoaded } = useUser();
  console.log("[Dashboard] User loaded:", isLoaded, "User:", user);
  const { getToken } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompany, setHasCompany] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [employerId, setEmployerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "closed" | "draft"
  >("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is an employer
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string;
      if (userRole !== EMPLOYER) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only employers can access this dashboard",
        }).then(() => {
          router.push("/");
        });
      }
    }
  }, [isLoaded, user, router]);

  // Check company status
  useEffect(() => {
    const checkCompany = async () => {
      if (!user?.id) return;

      try {
        setIsRefreshing(true);
        const empId = (user.unsafeMetadata?.employerId as number) || 1;
        console.log("[Dashboard] Using employerId:", empId);
        setEmployerId(empId);

        // Pass Clerk ID to backend (not numeric employerId)
        const status = await checkCompanyStatus(user.id, getToken);
        console.log("[Dashboard] Company status:", status);
        setHasCompany(status.hasCompany);
        setNeedsSetup(status.needsSetup || false);
        setCompanyName(status.companyName);
        setIsVerified(status.isVerified || false);
      } catch (error) {
        console.error("[Dashboard] Error checking company status:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    if (user?.id) {
      checkCompany();
    }
  }, [user?.id, getToken, refreshKey]);

  // Fetch employer's jobs
  useEffect(() => {
    const loadJobs = async () => {
      if (!employerId) return;

      console.log("[Dashboard] Fetching jobs for employerId:", employerId);
      setLoading(true);
      try {
        const employerJobs = await fetchEmployerJobs(
          employerId.toString(),
          getToken,
        );
        console.log("[Dashboard] Fetched jobs:", employerJobs);
        setJobs(employerJobs);
        setFilteredJobs(employerJobs);
      } catch (error) {
        console.error("[Dashboard] Error loading jobs:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Jobs",
          text: "Please refresh the page to try again",
        });
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      loadJobs();
    }
  }, [employerId]);

  // Filter jobs based on search and status
  useEffect(() => {
    let filtered = jobs;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term) ||
          job.jobType.toLowerCase().includes(term),
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const handleJobDeleted = (jobId: string | number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleJobUpdated = (updatedJob: EmployerJob) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    );
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                Employer Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                {companyName ? (
                  <span className="flex items-center gap-2 flex-wrap">
                    <span>Managing jobs for</span>
                    <Link
                      href={isVerified ? "/employer/company/setup" : "#"}
                      onClick={(e) => {
                        if (!isVerified) {
                          e.preventDefault();
                          Swal.fire({
                            icon: "warning",
                            title: "Verification Required",
                            text: "Your company must be verified before you can edit the profile. Please wait for admin approval.",
                          });
                        }
                      }}
                      className={`inline-flex items-center gap-2 font-semibold transition-colors ${
                        isVerified
                          ? "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {!isVerified && <Lock className="w-3 h-3" />}
                      {companyName}
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
                          <AlertCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => setRefreshKey((prev) => prev + 1)}
                      disabled={isRefreshing}
                      className="p-1 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                      title="Refresh verification status"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-slate-500 hover:text-blue-600 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </button>
                  </span>
                ) : (
                  "Manage your job postings and find the perfect candidates"
                )}
              </p>
            </div>
            <Link
              href={isVerified ? "/employer/post-job" : "#"}
              onClick={(e) => {
                if (!isVerified) {
                  e.preventDefault();
                  Swal.fire({
                    icon: "warning",
                    title: "Verification Required",
                    text: "Your company must be verified before you can post jobs. Please wait for admin approval.",
                  });
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transform transition-all duration-200 ${
                isVerified
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              {!isVerified && <Lock className="w-5 h-5" />}
              <Plus className="w-5 h-5" />
              Post New Job
            </Link>
          </div>
        </div>

        {/* Company Setup Banner */}
        {needsSetup && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Complete Your Company Profile
                </h3>
                <p className="text-slate-700 mb-4">
                  Your company profile was created automatically! Please
                  complete it with your company details. This helps candidates
                  learn about your company and builds trust.
                </p>
                <Link
                  href={isVerified ? "/employer/company/setup" : "#"}
                  onClick={(e) => {
                    if (!isVerified) {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Verification Required",
                        text: "Your company must be verified before you can complete the profile. Please wait for admin approval.",
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isVerified
                      ? "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!isVerified && <Lock className="w-5 h-5" />}
                  <Building2 className="w-5 h-5" />
                  Complete Company Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div>
          <EmployerStats jobs={jobs} />
        </div>

        {/* Search and Filter */}
        <div className="mb-8 animate-smooth-enter">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, location, or type..."
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
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-medium appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Jobs</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div>
          {filteredJobs.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {jobs.length === 0 ? "No Jobs Posted Yet" : "No Jobs Found"}
              </h3>
              <p className="text-slate-600 mb-6">
                {jobs.length === 0
                  ? "Start by creating your first job posting to attract top talent"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {jobs.length === 0 && (
                <Link
                  href={isVerified ? "/employer/post-job" : "#"}
                  onClick={(e) => {
                    if (!isVerified) {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Verification Required",
                        text: "Your company must be verified before you can post jobs. Please wait for admin approval.",
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transform transition-all duration-200 ${
                    isVerified
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {!isVerified && <Lock className="w-5 h-5" />}
                  <Plus className="w-5 h-5" />
                  Post Your First Job
                </Link>
              )}
            </div>
          ) : (
            <EmployerJobsList
              jobs={filteredJobs}
              onJobDeleted={handleJobDeleted}
              onJobUpdated={handleJobUpdated}
              getToken={getToken}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerDashboard;
