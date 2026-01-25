import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Briefcase, Plus, BarChart3, Users } from "lucide-react";

const EmployerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Employer Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage your job postings and find the perfect candidates
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Post New Job */}
          <Link
            href="/employer/post-job"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Post New Job</h3>
              <p className="text-blue-100">
                Create a new job listing to attract top talent
              </p>
            </div>
          </Link>

          {/* View Job Postings */}
          <Link
            href="/jobs"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">My Job Postings</h3>
              <p className="text-purple-100">
                View and manage your active job listings
              </p>
            </div>
          </Link>

          {/* View Candidates */}
          <Link
            href="/employer/candidates"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Browse Candidates</h3>
              <p className="text-green-100">Discover qualified job seekers</p>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-semibold">Active Jobs</h3>
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-500 mt-1">No jobs posted yet</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-semibold">
                Total Applications
              </h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-500 mt-1">
              No applications received
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-semibold">Views This Week</h3>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-500 mt-1">
              Post jobs to track views
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  Post Your First Job
                </h3>
                <p className="text-slate-600">
                  Create a compelling job listing to attract qualified
                  candidates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  Review Applications
                </h3>
                <p className="text-slate-600">
                  Browse through candidate profiles and applications.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  Connect & Hire
                </h3>
                <p className="text-slate-600">
                  Reach out to promising candidates and build your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployerDashboard;
