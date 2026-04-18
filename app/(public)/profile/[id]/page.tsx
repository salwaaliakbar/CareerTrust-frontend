"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  getPublicProfile,
  JobseekerPublicProfile,
} from "@/services/api/profile.service";
import { getCompanyProfile } from "@/services/api/employerCompany.service";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Download,
  Loader2,
  Calendar,
  Clock,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  UserX,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

// Helper function to calculate duration between two dates
const calculateDuration = (
  startDate: string,
  endDate: string | null,
): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  }
};

const durationInMonths = (
  startDate: string,
  endDate: string | null,
): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(0, months);
};

const formatDurationFromMonths = (totalMonths: number): string => {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
  return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
};

// Helper function to format date
const formatDate = (date: string | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function PublicProfilePage() {
  const params = useParams();
  const clerkId = params.id as string;
  const { getToken } = useAuth();
  const { user } = useUser();

  const [profile, setProfile] = useState<JobseekerPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEmployerCompanyName, setCurrentEmployerCompanyName] = useState<
    string | null
  >(null);

  // isCurrentlyEmployed is maintained server-side on JobseekerProfile
  const isCurrentlyEmployed = profile?.isCurrentlyEmployed ?? false;

  // Keep timeline sections consistent: newest entries first. Only verified records are shown publicly.
  const sortedEmploymentHistory = useMemo(() => {
    if (!profile) return [];
    return [...profile.employmentHistory]
      .filter((job) => job.verificationStatus === "verified")
      .sort((a, b) => {
        if (a.currentlyWorking && !b.currentlyWorking) return -1;
        if (!a.currentlyWorking && b.currentlyWorking) return 1;

        const aEnd = a.currentlyWorking
          ? Number.MAX_SAFE_INTEGER
          : new Date(a.endDate || a.startDate).getTime();
        const bEnd = b.currentlyWorking
          ? Number.MAX_SAFE_INTEGER
          : new Date(b.endDate || b.startDate).getTime();

        if (aEnd !== bEnd) return bEnd - aEnd;

        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
  }, [profile]);

  const sortedEducationHistory = useMemo(() => {
    if (!profile) return [];
    return [...profile.educationHistory].sort((a, b) => {
      const aEnd = new Date(a.endDate || a.startDate || 0).getTime();
      const bEnd = new Date(b.endDate || b.startDate || 0).getTime();
      if (aEnd !== bEnd) return bEnd - aEnd;

      const aStart = new Date(a.startDate || 0).getTime();
      const bStart = new Date(b.startDate || 0).getTime();
      return bStart - aStart;
    });
  }, [profile]);

  const calculatedTotalExperience = useMemo(() => {
    const verifiedJobs =
      profile?.employmentHistory.filter(
        (j) => j.verificationStatus === "verified",
      ) ?? [];
    if (verifiedJobs.length === 0) return null;
    const totalMonths = verifiedJobs.reduce((acc, job) => {
      return (
        acc +
        durationInMonths(
          job.startDate,
          job.currentlyWorking ? null : job.endDate,
        )
      );
    }, 0);
    return formatDurationFromMonths(totalMonths);
  }, [profile]);

  const effectiveTotalExperience = useMemo(() => {
    const stored = (profile?.totalExperience || "").trim();
    // Prefer calculated value when backend value is empty or stale like "0 years".
    if (!stored || /^0\s*year/i.test(stored)) {
      return calculatedTotalExperience;
    }
    return stored;
  }, [profile, calculatedTotalExperience]);

  // Get the jobseeker's current company name
  const jobseekerCurrentCompanyName = useMemo(() => {
    if (!profile?.employmentHistory) return null;
    const currentJob = profile.employmentHistory.find(
      (job) => job.currentlyWorking,
    );
    return currentJob?.company || null;
  }, [profile]);

  // Check if current user is the employer of the jobseeker's current company
  const shouldHideOpportunityBadge = useMemo(() => {
    if (!currentEmployerCompanyName || !jobseekerCurrentCompanyName)
      return false;
    return (
      currentEmployerCompanyName.toLowerCase().trim() ===
      jobseekerCurrentCompanyName.toLowerCase().trim()
    );
  }, [currentEmployerCompanyName, jobseekerCurrentCompanyName]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicProfile(clerkId, getToken);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (clerkId) {
      fetchProfile();
    }
  }, [clerkId, getToken]);

  // Fetch current user's employer company (if they're an employer)
  useEffect(() => {
    const fetchEmployerCompany = async () => {
      try {
        if (!user) return;

        const companyProfile = await getCompanyProfile(user.id, getToken);
        if (companyProfile) {
          setCurrentEmployerCompanyName(companyProfile.name);
        }
      } catch (err) {
        console.error("Error fetching employer company:", err);
        // Silently fail - this is optional info for employers
      }
    };

    fetchEmployerCompany();
  }, [user, getToken]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[linear-gradient(135deg,#EEF4FF_0%,#F8FAFF_45%,#ECF2FF_100%)] flex items-center justify-center px-4">
          <div className="rounded-2xl border border-slate-200 bg-white/90 px-8 py-9 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)] backdrop-blur">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#0C2B4E]" />
              <p className="font-semibold text-slate-700">Loading profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[linear-gradient(135deg,#EEF4FF_0%,#F8FAFF_45%,#ECF2FF_100%)] flex items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-[0_18px_45px_-30px_rgba(239,68,68,0.55)]">
            <h2 className="mb-3 text-2xl font-black text-red-600">
              Profile Not Found
            </h2>
            <p className="text-slate-600">
              {error || "The requested profile could not be found."}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(140deg,#EEF4FF_0%,#F7FAFF_40%,#EBF1FD_100%)] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(12,43,78,0.10),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(26,71,121,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4">
          {/* Profile Header with Background Banner */}
          <div className="relative z-20 h-36 rounded-t-3xl bg-linear-to-r from-[#0C2B4E] via-[#123560] to-[#1D546C]">
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] bg-size-[26px_26px]" />
            <div className="absolute -bottom-16 left-8 z-30">
              {profile.profilePicUrl ? (
                <img
                  src={profile.profilePicUrl}
                  alt={profile.fullName || "Profile"}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-[#0C2B4E] to-[#1D546C] text-4xl font-black text-white shadow-xl">
                  {profile.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="relative z-10 mb-6 rounded-b-3xl border border-slate-100 bg-white/95 px-8 pb-8 pt-20 shadow-[0_24px_55px_-34px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
              {/* Profile Info */}
              <div className="grow">
                <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-900">
                  {profile.fullName || "Unknown"}
                </h1>
                {profile.headline && (
                  <p className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-600">
                    <Sparkles className="h-5 w-5 text-[#0C2B4E]" />
                    {profile.headline}
                  </p>
                )}

                {/* Employment Status Badges — always visible */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {/* Auto-generated: Employed / Not Employed based on experience */}
                  {isCurrentlyEmployed ? (
                    <div className="inline-flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500" />
                      <div>
                        <div className="text-sm font-black text-amber-900">
                          Employed
                        </div>
                        <div className="mt-0.5 text-xs text-slate-600">
                          Currently working — based on experience
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 shadow-sm">
                      <UserX className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="text-sm font-black text-slate-700">
                          Not Employed
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          No active employment in experience
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User-controlled: Open / Not Open for Opportunities — Hidden if viewing employer's own company employee */}
                  {!shouldHideOpportunityBadge && (
                    <>
                      {profile.employmentStatus === "open" ||
                      !profile.employmentStatus ? (
                        <div className="inline-flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <div className="text-sm font-black text-emerald-800">
                              Open for Opportunities
                            </div>
                            <div className="mt-0.5 text-xs text-slate-600">
                              Actively seeking new roles
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
                          <XCircle className="h-4 w-4 text-rose-500" />
                          <div>
                            <div className="text-sm font-black text-rose-700">
                              Not Open for Opportunities
                            </div>
                            <div className="mt-0.5 text-xs text-slate-600">
                              Not actively seeking new roles
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="h-5 w-5 text-[#0C2B4E]" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  {effectiveTotalExperience && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Briefcase className="h-5 w-5 text-[#0C2B4E]" />
                      <span className="font-medium">
                        {effectiveTotalExperience} of experience
                      </span>
                    </div>
                  )}
                  {profile.highestDegree && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <GraduationCap className="h-5 w-5 text-[#0C2B4E]" />
                      <span className="font-medium">
                        {profile.highestDegree}
                      </span>
                    </div>
                  )}
                  {profile.createdAt && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-5 w-5 text-[#0C2B4E]" />
                      <span className="font-medium">
                        Member since{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" },
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Information - Prominent for Employers */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="group flex items-center gap-2 text-slate-700 transition hover:text-[#0C2B4E]"
                      >
                        <Mail className="h-5 w-5 text-[#0C2B4E] transition group-hover:scale-110" />
                        <span className="font-medium">{profile.email}</span>
                      </a>
                    )}
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="group flex items-center gap-2 text-slate-700 transition hover:text-[#0C2B4E]"
                      >
                        <Phone className="h-5 w-5 text-[#0C2B4E] transition group-hover:scale-110" />
                        <span className="font-medium">{profile.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Availability Information for Employers */}
                <div className="mt-4">
                  {isCurrentlyEmployed && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                          <h4 className="mb-1 text-sm font-bold text-amber-900">
                            ⚠️ Currently Employed
                          </h4>
                          <p className="text-sm text-amber-800">
                            This candidate is currently employed. They may
                            require a notice period before joining. Please
                            discuss availability and joining timeline during the
                            interview process.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isCurrentlyEmployed && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <h4 className="mb-1 text-sm font-bold text-emerald-900">
                            ✓ Not Currently Employed
                          </h4>
                          <p className="text-sm text-emerald-800">
                            This candidate is not currently employed based on
                            their experience section.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Download & Employment Passport - Prominent CTAs */}
              <div className="shrink-0 flex flex-col gap-3">
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-[#0C2B4E] via-[#123560] to-[#1D546C] px-8 py-4 font-bold text-white shadow-[0_14px_30px_-16px_rgba(15,23,42,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-16px_rgba(15,23,42,0.72)]"
                  >
                    <Download className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-sm opacity-90">Download</div>
                      <div className="text-base">Full Resume</div>
                    </div>
                  </a>
                )}

                {/* Digital Employment Passport Button */}
                <Link
                  href={`/jobseeker/passport?clerkId=${clerkId}`}
                  className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-4 font-bold text-white shadow-[0_14px_30px_-16px_rgba(16,185,129,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-16px_rgba(16,185,129,0.72)]"
                >
                  <BadgeCheck className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-sm opacity-90">View</div>
                    <div className="text-base">Digital Employment Passport</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats/Overview */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E7EEF8]">
                  <Briefcase className="h-7 w-7 text-[#0C2B4E]" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {profile.employmentHistory.length}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Work Experience
                    {profile.employmentHistory.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <GraduationCap className="h-7 w-7 text-emerald-700" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {profile.educationHistory.length}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Education Record
                    {profile.educationHistory.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_-22px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-100">
                  <Award className="h-7 w-7 text-cyan-700" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {profile.skills.length}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Professional Skill{profile.skills.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profile.summary && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.45)]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7EEF8]">
                  <FileText className="h-6 w-6 text-[#0C2B4E]" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Professional Summary
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.45)]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
                  <Award className="h-6 w-6 text-cyan-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Skills & Expertise
                  </h2>
                  <p className="text-sm text-slate-600">
                    Core competencies and technical skills
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1D546C]/40 hover:bg-[#EAF1FA]"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {sortedEmploymentHistory.length > 0 && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.45)]">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7EEF8]">
                  <Briefcase className="h-6 w-6 text-[#0C2B4E]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Work Experience
                  </h2>
                  <p className="text-sm text-slate-600">
                    Professional employment history • Newest first
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                {sortedEmploymentHistory.map((job, index) => {
                  const duration = calculateDuration(
                    job.startDate,
                    job.currentlyWorking ? null : job.endDate,
                  );

                  return (
                    <div
                      key={job.id}
                      className={`relative rounded-xl border border-slate-100 bg-slate-50/70 p-5 ${index > 0 ? "" : ""}`}
                    >
                      <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
                        <div className="grow">
                          <div className="mb-2 flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#E7EEF8] to-[#DCE8F9]">
                              <Building2 className="h-6 w-6 text-[#0C2B4E]" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-slate-900">
                                {job.position}
                              </h3>
                              <p className="text-lg font-bold text-[#1D546C]">
                                {job.company}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {job.currentlyWorking && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" />
                              Current Position
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {formatDate(job.startDate)} -{" "}
                            {job.currentlyWorking
                              ? "Present"
                              : formatDate(job.endDate)}
                          </span>
                        </div>
                      </div>

                      <p className="mb-4 text-sm font-semibold text-[#0C2B4E]">
                        {duration}
                      </p>

                      {job.description && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                            {job.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {sortedEducationHistory.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.45)]">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <GraduationCap className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Education
                  </h2>
                  <p className="text-sm text-slate-600">
                    Academic qualifications and certifications • Newest first
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {sortedEducationHistory.map((edu, index) => {
                  const duration =
                    edu.startDate && edu.endDate
                      ? calculateDuration(edu.startDate, edu.endDate)
                      : null;

                  return (
                    <div
                      key={edu.id}
                      className={`relative rounded-xl border border-slate-100 bg-slate-50/70 p-5 ${index > 0 ? "" : ""}`}
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-100 to-teal-100">
                          <GraduationCap className="h-6 w-6 text-emerald-700" />
                        </div>
                        <div className="grow">
                          <h3 className="text-xl font-black text-slate-900">
                            {edu.degree}
                          </h3>
                          <p className="mb-2 text-lg font-bold text-emerald-700">
                            {edu.institution}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span className="font-medium">
                                {formatDate(edu.startDate)} -{" "}
                                {formatDate(edu.endDate)}
                              </span>
                            </div>
                            {duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-emerald-700">
                                  {duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
