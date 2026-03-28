"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Briefcase,
  FileText,
  ArrowRight,
  BadgeCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Target,
  LayoutDashboard,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { DashboardStats } from "@/types/dashboard.types";
import {
  DASHBOARD_QUICK_ACTIONS,
  DASHBOARD_STAT_ITEMS,
  DASHBOARD_STATUS_CONFIGS,
} from "@/data/jobseeker/dashboardUi";
import {
  initializeDashboard,
  selectDashboardStats,
  selectRecentApplications,
} from "@/redux/store/slices/dashboardSlice";
import Footer from "../layout/Footer";

/*
  Legacy commented snippets preserved for reference (kept intentionally):

  1) Icon import candidate:
    MessageSquareText

  2) Alternate status style helper:
    const getStatusStyle = (status: string) => {
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

  3) Alternate hero button variant:
    - Strong gradient CTA blocks for passport and recommended jobs.

  4) Legacy stat cards approach:
    <StatCard icon={<Briefcase />} label="Total Applications" ... />
    <StatCard icon={<CheckCircle />} label="Accepted Offers" ... />
    <StatCard icon={<Clock />} label="Applications Under Review" ... />
    <StatCard icon={<Eye />} label="Profile Views" ... />
    <StatCard icon={<Target />} label="Job Recommendations" ... />
    <StatCard icon={<Target />} label="Profile Strength" ... />

  5) Legacy quick action cards:
    - Browse Jobs variant card
    - Give Reviews card (MessageSquareText)
    - Employment Passport gradient card variant

  Note:
  These snippets were previously embedded as malformed JSX/HTML comments and
  broke parsing. They are now preserved safely as plain block comments.
*/

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const stats = useAppSelector(selectDashboardStats);
  const recentApplications = useAppSelector(selectRecentApplications);

  useEffect(() => {
    if (!user?.id) return;
    dispatch(initializeDashboard({ clerkId: user.id, forceRefresh: true }));
  }, [user?.id, dispatch]);

  const displayStats: DashboardStats = {
    totalApplications: stats?.totalApplications ?? 0,
    acceptedApplications: stats?.acceptedApplications ?? 0,
    pendingApplications: stats?.pendingApplications ?? 0,
    profileViews: stats?.profileViews ?? 0,
    jobsRecommended: stats?.jobsRecommended ?? 0,
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Top nav bar accent */}
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-12 space-y-10 md:space-y-12">
        {/* ─── HERO HEADER CARD ──────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
          {/* Dark navy background */}
          <div className="absolute inset-0 bg-[#0B1F45]" />
          {/* Gradient mesh */}
          <div className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, #1e40af44 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #7c3aed33 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, #0ea5e922 0%, transparent 50%)",
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Decorative ping dots */}
          <div className="absolute top-8 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
          <div className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDelay: "0.8s" }} />

          <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 lg:gap-10">
            {/* Left: greeting */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <LayoutDashboard className="w-4 h-4 text-blue-300/80" />
                <span className="text-blue-300/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                  Dashboard
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Welcome Back, {user?.firstName || "User"}! 👋
              </h1>
              <p className="mt-4 text-blue-200/80 text-sm sm:text-base max-w-xl leading-relaxed">
                Track your applications, manage your career journey, and
                discover new opportunities tailored for you.
              </p>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 sm:gap-4 shrink-0 w-full md:w-auto">
              <button
                onClick={() => router.push("/jobseeker/passport")}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm sm:text-base font-bold transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm w-full sm:w-auto"
              >
                <BadgeCheck className="w-5 h-5 text-blue-300" />
                View Employment Passport
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
              <button
                onClick={() => router.push("/jobs?filter=recommended")}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto"
              >
                <Target className="w-5 h-5" />
                View Recommended Jobs
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── STATS GRID ────────────────────────────────────────────── */}
        <section className="space-y-6 sm:space-y-7">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Your Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {DASHBOARD_STAT_ITEMS.map((s) => {
              const Icon = s.icon;
              const cardValue =
                s.id === "profile-strength" ? 100 : displayStats[s.valueKey] ?? 0;

              return (
                <div
                  key={s.id}
                  className={`group relative rounded-2xl border ${s.border} p-5 sm:p-6 min-h-36 overflow-hidden
                  bg-linear-to-br from-white via-blue-50/45 to-white
                  shadow-[0_8px_22px_-14px_rgba(37,99,235,0.42),0_0_0_1px_rgba(96,165,250,0.26)]
                  hover:shadow-[0_14px_30px_-14px_rgba(37,99,235,0.55),0_0_0_1px_rgba(37,99,235,0.3)]
                  transition-all duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${s.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300`}
                  />

                  <div className="relative h-full flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-slate-800 leading-none">
                          {cardValue}
                          {s.suffix ?? ""}
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 font-medium mt-1.5 leading-tight">
                          {s.label}
                        </p>
                      </div>

                      <div
                        className={`w-11 h-11 rounded-xl bg-linear-to-br ${s.color} text-white flex items-center justify-center shrink-0 shadow-[0_8px_16px_-8px_rgba(37,99,235,0.55)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r ${s.color} origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── RECENT APPLICATIONS ───────────────────────────────────── */}
        <section className="bg-linear-to-br from-white via-blue-50/35 to-white rounded-3xl overflow-hidden border border-blue-100/70
          shadow-[0_10px_30px_-16px_rgba(37,99,235,0.35),0_0_0_1px_rgba(96,165,250,0.18)]
          hover:shadow-[0_16px_38px_-18px_rgba(37,99,235,0.45),0_0_0_1px_rgba(59,130,246,0.22)]
          transition-all duration-300">
          {/* Card header */}
          <div className="px-5 sm:px-7 lg:px-8 py-5 sm:py-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Recent Applications
                </h2>
                <p className="text-sm sm:text-base text-slate-400">Your latest activity</p>
              </div>
            </div>

            <Link
              href="/jobseeker/applications"
              className="flex items-center gap-1.5 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-semibold group transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Table header */}
          {recentApplications.length > 0 && (
            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 sm:px-7 lg:px-8 py-3.5 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Position</span>
              <span>Company</span>
              <span>Date Applied</span>
              <span>Status</span>
            </div>
          )}

          {/* Rows */}
          <div>
            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 sm:px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">
                  No Applications Yet
                </h3>
                <p className="text-base sm:text-lg text-slate-400 mt-2 max-w-sm leading-relaxed">
                  Your latest job applications will appear here once you apply.
                </p>
                <Link
                  href="/jobs"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => {
                const sc = DASHBOARD_STATUS_CONFIGS[app.status] || DASHBOARD_STATUS_CONFIGS.pending;
                return (
                  <div
                    key={app.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 md:gap-5 items-center px-5 sm:px-7 lg:px-8 py-5 sm:py-6 hover:bg-slate-50/80 transition-colors duration-150 border-b border-slate-50 last:border-0 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-base sm:text-lg text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {app.jobTitle}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base text-slate-500 truncate pl-12 md:pl-0">
                      {app.company}
                    </span>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 pl-12 md:pl-0">
                      <Clock className="w-4 h-4" />
                      {app.appliedDate}
                    </div>
                    <div className="pl-12 md:pl-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold ${sc.style}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>


        {/* ─── QUICK ACTIONS ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
            {DASHBOARD_QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.icon;

              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`group relative overflow-hidden rounded-2xl border min-h-[255px] transition-all duration-300
                  hover:-translate-y-1
                  ${
                    action.dark
                      ? "bg-linear-to-br from-slate-800 to-slate-900 border-slate-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.10)]"
                      : "bg-linear-to-br from-white via-blue-50/40 to-white border-blue-100/80 shadow-[0_10px_24px_-14px_rgba(37,99,235,0.4),0_0_0_1px_rgba(59,130,246,0.18)] hover:shadow-[0_16px_34px_-14px_rgba(37,99,235,0.52),0_0_0_1px_rgba(79,70,229,0.22)]"
                  }`}
                >
                  {/* Hover gradient fill */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${action.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative z-10 p-6 sm:p-7 h-full flex flex-col">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.grad} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <ActionIcon className="w-5 h-5" />
                    </div>

                    <h3
                      className={`font-bold text-xl mb-2 transition-colors ${
                        action.dark
                          ? "text-white"
                          : `text-slate-800 ${action.hoverText}`
                      }`}
                    >
                      {action.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed mb-6 ${
                        action.dark ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      {action.desc}
                    </p>

                    <div
                      className={`mt-auto inline-flex items-center gap-2 text-sm sm:text-base font-semibold ${
                        action.dark ? "text-blue-300" : action.accentText
                      }`}
                    >
                      {action.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;