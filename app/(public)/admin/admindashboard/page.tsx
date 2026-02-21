"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { DashboardStats } from "@/types/admin.types";
import { Users, Briefcase, Building2, FileText, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      const response = await fetch(
        `${apiUrl}/api/admin/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-[#0C2B4E] to-[#1A3D64]",
      bgColor: "bg-[#0C2B4E]/10",
      iconColor: "text-[#0C2B4E]",
    },
    {
      title: "Job Seekers",
      value: stats?.totalJobseekers || 0,
      icon: Briefcase,
      gradient: "from-[#0C2B4E] to-[#2A4D6E]",
      bgColor: "bg-[#0C2B4E]/10",
      iconColor: "text-[#0C2B4E]",
    },
    {
      title: "Employers",
      value: stats?.totalEmployers || 0,
      icon: Building2,
      gradient: "from-[#F97316] to-[#EA580C]",
      bgColor: "bg-[#F97316]/10",
      iconColor: "text-[#F97316]",
    },
    {
      title: "Jobs Posted",
      value: stats?.totalJobs || 0,
      icon: FileText,
      gradient: "from-[#0C2B4E] to-[#1A3D64]",
      bgColor: "bg-[#0C2B4E]/10",
      iconColor: "text-[#0C2B4E]",
    },
    {
      title: "Companies",
      value: stats?.totalCompanies || 0,
      icon: Building2,
      gradient: "from-[#F97316] to-[#EA580C]",
      bgColor: "bg-[#F97316]/10",
      iconColor: "text-[#F97316]",
    },
    {
      title: "Blog Posts",
      value: stats?.totalBlogs || 0,
      icon: FileText,
      gradient: "from-[#0C2B4E] to-[#2A4D6E]",
      bgColor: "bg-[#0C2B4E]/10",
      iconColor: "text-[#0C2B4E]",
    },
  ];

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-linear-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">Admin Portal</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Monitor and manage your CareerTrust platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 fade-in"
              style={{animationDelay: `${index * 100}ms`}}
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="relative">
                  {/* Background glow */}
                  <div className={`absolute -inset-2 rounded-xl ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.iconColor} shadow-sm transition-all duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200/60 fade-in animation-delay-600">
        <h2 className="text-2xl font-bold text-[#0C2B4E] mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Activity className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10 font-semibold">View Analytics</span>
          </button>
          <button className="group relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <TrendingUp className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10 font-semibold">View Reports</span>
          </button>
          <button className="group relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#0C2B4E] to-[#2A4D6E] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Users className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10 font-semibold">Manage Users</span>
          </button>
        </div>
      </div>
    </div>
  );
}
