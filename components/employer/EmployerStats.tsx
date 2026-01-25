"use client";

import React from "react";
import { EmployerJob } from "@/types/application.types";
import { Briefcase, Users, Eye, TrendingUp } from "lucide-react";

interface EmployerStatsProps {
  jobs: EmployerJob[];
}

export default function EmployerStats({ jobs }: EmployerStatsProps) {
  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const totalApplications = jobs.reduce(
    (sum, job) => sum + job.applicationsCount,
    0,
  );
  const totalViews = jobs.reduce((sum, job) => sum + job.viewsCount, 0);
  const avgApplicationsPerJob =
    jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0;

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs,
      subtext: `${jobs.length} total jobs`,
      icon: Briefcase,
      color: "blue",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      subtext: `${avgApplicationsPerJob} avg per job`,
      icon: Users,
      color: "purple",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      label: "Total Views",
      value: totalViews,
      subtext:
        jobs.length > 0
          ? `${Math.round(totalViews / jobs.length)} avg per job`
          : "0 views",
      icon: Eye,
      color: "green",
      gradient: "from-green-600 to-teal-600",
    },
    {
      label: "Response Rate",
      value:
        totalViews > 0
          ? `${Math.round((totalApplications / totalViews) * 100)}%`
          : "0%",
      subtext: totalViews > 0 ? "Applications per view" : "No data yet",
      icon: TrendingUp,
      color: "orange",
      gradient: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-smooth-enter">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
          ></div>
        </div>
      ))}
    </div>
  );
}
