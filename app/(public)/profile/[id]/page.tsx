"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  getPublicProfile,
  JobseekerPublicProfile,
} from "@/services/api/profile.service";
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
  Star,
  CheckCircle2,
  XCircle,
  UserX,
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

  const [profile, setProfile] = useState<JobseekerPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
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
    const verifiedJobs = profile?.employmentHistory.filter((j) => j.verificationStatus === "verified") ?? [];
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading profile...</p>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-600">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Header with Background Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl h-32 relative">
            <div className="absolute -bottom-16 left-8">
              {profile.profilePicUrl ? (
                <img
                  src={profile.profilePicUrl}
                  alt={profile.fullName || "Profile"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                  {profile.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-b-3xl shadow-xl pt-20 pb-8 px-8 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              {/* Profile Info */}
              <div className="flex-grow">
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                  {profile.fullName || "Unknown"}
                </h1>
                {profile.headline && (
                  <p className="text-xl text-gray-600 font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    {profile.headline}
                  </p>
                )}

                {/* Employment Status Badges — always visible */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {/* Auto-generated: Employed / Not Employed based on experience */}
                  {isCurrentlyEmployed ? (
                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-orange-100 border-2 border-orange-300 rounded-xl shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                      <div>
                        <div className="font-black text-sm text-orange-800">
                          Employed
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Currently working — based on experience
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl shadow-sm">
                      <UserX className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-black text-sm text-gray-700">
                          Not Employed
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          No active employment in experience
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User-controlled: Open / Not Open for Opportunities */}
                  {profile.employmentStatus === "open" ||
                  !profile.employmentStatus ? (
                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-green-100 border-2 border-green-300 rounded-xl shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-black text-sm text-green-800">
                          Open for Opportunities
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Actively seeking new roles
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <div>
                        <div className="font-black text-sm text-red-700">
                          Not Open for Opportunities
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Not actively seeking new roles
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  {effectiveTotalExperience && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        {effectiveTotalExperience} of experience
                      </span>
                    </div>
                  )}
                  {profile.highestDegree && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        {profile.highestDegree}
                      </span>
                    </div>
                  )}
                  {profile.createdAt && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-blue-600" />
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
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group"
                      >
                        <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                        <span className="font-medium">{profile.email}</span>
                      </a>
                    )}
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group"
                      >
                        <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                        <span className="font-medium">{profile.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Availability Information for Employers */}
                <div className="mt-4">
                  {isCurrentlyEmployed && (
                    <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-orange-900 text-sm mb-1">
                            ⚠️ Currently Employed
                          </h4>
                          <p className="text-sm text-orange-800">
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
                    <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-green-900 text-sm mb-1">
                            ✓ Not Currently Employed
                          </h4>
                          <p className="text-sm text-green-800">
                            This candidate is not currently employed based on
                            their experience section.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Download - Prominent CTA */}
              {profile.resumeUrl && (
                <div className="flex-shrink-0">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm opacity-90">Download</div>
                      <div className="text-base">Full Resume</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats/Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {profile.employmentHistory.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Work Experience
                    {profile.employmentHistory.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {profile.educationHistory.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Education Record
                    {profile.educationHistory.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {profile.skills.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Professional Skill{profile.skills.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profile.summary && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  Professional Summary
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Skills & Expertise
                  </h2>
                  <p className="text-sm text-gray-600">
                    Core competencies and technical skills
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800 rounded-xl font-semibold text-sm border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105 shadow-sm"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {sortedEmploymentHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Work Experience
                  </h2>
                  <p className="text-sm text-gray-600">
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
                      className={`relative ${index > 0 ? "border-t pt-8" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-grow">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-gray-900">
                                {job.position}
                              </h3>
                              <p className="text-lg text-blue-600 font-bold">
                                {job.company}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {job.currentlyWorking && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold text-sm border border-green-300">
                              <CheckCircle2 className="w-4 h-4" />
                              Current Position
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {formatDate(job.startDate)} -{" "}
                            {job.currentlyWorking
                              ? "Present"
                              : formatDate(job.endDate)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-blue-600 mb-4">
                        {duration}
                      </p>

                      {job.description && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Education
                  </h2>
                  <p className="text-sm text-gray-600">
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
                      className={`relative ${index > 0 ? "border-t pt-6" : ""}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-black text-gray-900">
                            {edu.degree}
                          </h3>
                          <p className="text-lg text-green-600 font-bold mb-2">
                            {edu.institution}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {formatDate(edu.startDate)} -{" "}
                                {formatDate(edu.endDate)}
                              </span>
                            </div>
                            {duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-green-600">
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
