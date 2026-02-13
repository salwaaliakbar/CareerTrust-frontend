"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const jobseekerId = params.id as string;

  const [profile, setProfile] = useState<JobseekerPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicProfile(jobseekerId);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (jobseekerId) {
      fetchProfile();
    }
  }, [jobseekerId]);

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profile.profilePicUrl ? (
                  <img
                    src={profile.profilePicUrl}
                    alt={profile.fullName || "Profile"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-100">
                    {profile.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-grow">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {profile.fullName || "Unknown"}
                </h1>
                {profile.headline && (
                  <p className="text-xl text-gray-600 font-semibold mb-4">
                    {profile.headline}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-blue-600 transition"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <a
                        href={`tel:${profile.phone}`}
                        className="hover:text-blue-600 transition"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  {profile.totalExperience && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span>{profile.totalExperience}</span>
                    </div>
                  )}
                </div>

                {/* Resume Download */}
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Download className="w-5 h-5" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profile.summary && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Professional Summary
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-200"
                  >
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {profile.employmentHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-6">
                {profile.employmentHistory.map((job, index) => (
                  <div
                    key={job.id}
                    className={index > 0 ? "border-t pt-6" : ""}
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.position}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-2">
                      {job.company}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {job.startDate} -{" "}
                      {job.currentlyWorking ? "Present" : job.endDate || "N/A"}
                    </p>
                    {job.description && (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.educationHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-6">
                {profile.educationHistory.map((edu, index) => (
                  <div
                    key={edu.id}
                    className={index > 0 ? "border-t pt-6" : ""}
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    {edu.fieldOfStudy && (
                      <p className="text-gray-600 font-medium">
                        {edu.fieldOfStudy}
                      </p>
                    )}
                    <p className="text-lg text-blue-600 font-semibold mb-2">
                      {edu.institutionName}
                    </p>
                    <p className="text-gray-600">
                      {edu.startDate} -{" "}
                      {edu.currentlyStudying ? "Present" : edu.endDate || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
