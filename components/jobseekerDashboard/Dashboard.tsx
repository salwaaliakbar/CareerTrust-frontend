"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Briefcase,
  FileText,
  Eye,
  CheckCircle,
  ArrowRight,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Target,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import StatCard from "@/components/ui/StatCard";
import { DashboardStats } from "@/types/dashboard.types";
import {
  initializeDashboard,
  selectDashboardStats,
  selectRecentApplications,
} from "@/redux/store/slices/dashboardSlice";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();

  // Get data from Redux
  const stats = useAppSelector(selectDashboardStats);
  const recentApplications = useAppSelector(selectRecentApplications);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (!user?.id) return;
    dispatch(initializeDashboard({ clerkId: user.id, forceRefresh: true }));
  }, [user?.id, dispatch]);

  // Display stats from Redux, fallback to default
  // jobsRecommended comes from backend (JobRecommendation table where score >= 0.5)
  const displayStats: DashboardStats = {
    totalApplications: stats?.totalApplications ?? 0,
    acceptedApplications: stats?.acceptedApplications ?? 0,
    pendingApplications: stats?.pendingApplications ?? 0,
    profileViews: stats?.profileViews ?? 0,
    jobsRecommended: stats?.jobsRecommended ?? 0,
  };

  const getStatusStyle = (status: string) => {
    // Status definitions:
    // pending = Just applied, awaiting company response
    // reviewing = Company is reviewing your application
    // shortlisted = You passed initial screening
    // interviewed = You've had an interview with the company
    // hired = 🎯 OFFER ACCEPTED - Job is yours!
    // rejected = Company rejected your application
    
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      reviewing: "bg-blue-50 text-blue-700 border border-blue-200",
      shortlisted: "bg-purple-50 text-purple-700 border border-purple-200",
      interviewed: "bg-violet-50 text-violet-700 border border-violet-200",
      hired: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      rejected: "bg-red-50 text-red-700 border border-red-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative background elements */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with Digital Employment Passport Button */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative bg-linear-to-r from-[#0A1F44] via-[#1e3a5f] to-[#2d4a6f] rounded-3xl p-10 shadow-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10 my-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-300" />
                  <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Welcome Back!
                  </h1>
                </div>
                <p className="text-blue-100 text-lg font-semibold">
                  Track your applications and manage your career journey
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-4">
                <button
                  onClick={() => router.push("/jobseeker/passport")}
                  className="relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white px-6 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold overflow-hidden cursor-pointer group/btn"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <BadgeCheck className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">View Employment Passport</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  onClick={() => router.push("/jobs?filter=recommended")}
                  className="relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold overflow-hidden cursor-pointer group/btn"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <Target className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">View Recommended Jobs</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<Briefcase className="w-6 h-6 text-white" />}
              label="Total Applications"
              value={displayStats.totalApplications}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6 text-white" />}
              label="Accepted Offers"
              value={displayStats.acceptedApplications}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={<Clock className="w-6 h-6 text-white" />}
              label="Applications Under Review"
              value={displayStats.pendingApplications}
              color="bg-gradient-to-br from-amber-500 to-amber-600"
              gradient="bg-gradient-to-br from-amber-500 to-amber-600"
            />
            <StatCard
              icon={<Eye className="w-6 h-6 text-white" />}
              label="Profile Views"
              value={displayStats.profileViews}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={<Target className="w-6 h-6 text-white" />}
              label="Job Recommendations"
              value={displayStats.jobsRecommended}
              color="bg-gradient-to-br from-indigo-500 to-indigo-600"
              gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
            />
            <StatCard
              icon={<Target className="w-6 h-6 text-white" />}
              label="Profile Strength"
              value={100}
              color="bg-gradient-to-br from-teal-500 to-teal-600"
              gradient="bg-gradient-to-br from-teal-500 to-teal-600"
            />
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Applications
                </h2>
              </div>
              <Link
                href="/jobs"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentApplications.length === 0 ? (
              <div className="px-10 md:px-12 text-center bg-linear-to-b from-sky-50 to-white pt-20 pb-30">
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No Recent Applications Yet
                </h3>
                <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Your latest job applications will appear here once you apply. Start exploring roles to build your application history.
                </p>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-6 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {app.jobTitle}
                          </h3>
                          <p className="text-gray-600 mt-1">{app.company}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Applied {app.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-2 my-12">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/jobs"
              className="group relative bg-white rounded-2xl p-6 shadow-2xl hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Browse Jobs
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore new opportunities and apply to jobs
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              href="/jobseeker/profile"
              className="group relative bg-white rounded-2xl p-6 shadow-2xl hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-600 text-white rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  My Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Update your profile and manage your information
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
                  Update Now
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link
              href="/jobseeker/passport"
              className="group relative bg-linear-to-r from-[#0A1F44] via-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-center opacity-20" />
              
              <div className="relative">
                <div className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Employment Passport
                </h3>
                <p className="text-blue-100 mb-4">
                  View your verified employment records
                </p>
                <div className="flex items-center text-blue-100 font-medium group-hover:gap-2 group-hover:text-white transition-all">
                  View Passport
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
