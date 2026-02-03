"use client";

import React, { useState } from "react";
import {
  ProfileData,
  EmploymentRecord,
  EducationRecord,
} from "@/types/jobseeker.types";
import { useEmployment } from "@/hooks/useEmployment";
import { useEducation } from "@/hooks/useEducation";
import ProfileHeader from "@/components/jobseekerDashboard/ProfileHeader";
import PersonalInformation from "@/components/jobseekerDashboard/PersonalInformation";
import ProfessionalSummary from "@/components/jobseekerDashboard/ProfessionalSummary";
import WorkExperience from "@/components/jobseekerDashboard/WorkExperience";
import EducationHistory from "@/components/jobseekerDashboard/EducationHistory";
import AddEducationForm from "@/components/jobseekerDashboard/AddEducationForm";
import ResumeUpload from "@/components/jobseekerDashboard/ResumeUpload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import logger from "@/lib/logger";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { API_ENDPOINTS } from "@/constants/api";
import Swal from "sweetalert2";
import Test from "@/app/Test";

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileData>({
    fullName: "",
    headline: "",
    location: "",
    skills: "",
    summary: "",
    email: "",
    total_experience: "",
    total_experience_years: 0,
  });

  const {
    educationHistory,
    setEducationHistory,
    showAddEducation,
    setShowAddEducation,
    newEducation,
    handleNewEducationChange,
    addEducationRecord,
    deleteEducation,
  } = useEducation([]);

  const {
    employmentHistory,
    setEmploymentHistory,
    showAddEmployment,
    setShowAddEmployment,
    newEmployment,
    documentInputRefs,
    addEmploymentRecord,
    handleNewEmploymentChange,
    deleteEmployment,
    handleDocumentUpload,
    removeDocument,
  } = useEmployment([]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Autofill from Clerk on mount only
  React.useEffect(() => {
    if (!mounted || !user) return;

    const name =
      user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || name,
      email: prev.email || email,
    }));
  }, [mounted, user]);

  async function autoFillFromResume(file: File) {
    setAutoFilling(true);
    try {
      const sendindForm = new FormData();
      // backend expects field name `resume`
      sendindForm.append("resume", file);
      // Use form state values which are already populated from Clerk user data
      sendindForm.append("fullName", form.fullName || "");
      sendindForm.append("email", form.email || "");

      let parsed: any = null;
      let mismatches: any = {};
      try {
        const resp = await axios.post("/api/resume/parse-resume", sendindForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const body = resp.data;
        // API should return { parsed: { ... } } or parsed directly
        parsed = body.parsed ?? body;
        mismatches = body.mismatches;
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          const text = e.response?.data ?? e.message;
          logger.error("Resume parse API error:", status, text);
        } else {
          logger.error("Resume parse API unexpected error:", e);
        }
        throw new Error("Resume parse failed");
      }
      if (!parsed) {
        // no parsed data, nothing to autofill
        throw new Error("No data extracted from resume");
      }
      logger.info("Parsed resume data:", parsed);

      // Check for mismatches between resume and account data
      if (mismatches.name || mismatches.email) {
        const mismatchMessages = [];
        if (mismatches.name) {
          console.log(
            "Name mismatch detected:",
            parsed.name,
            form.fullName,
            user?.fullName,
          );
          mismatchMessages.push(
            `Name: Resume has "${
              parsed.name || "N/A"
            }" but your account shows "${
              form.fullName || user?.fullName || "N/A"
            }"`,
          );
        }
        if (mismatches.email) {
          mismatchMessages.push(
            `Email: Resume has "${
              parsed.email || "N/A"
            }" but your account shows "${
              form.email || user?.primaryEmailAddress?.emailAddress || "N/A"
            }"`,
          );
        }

        const result = await Swal.fire({
          icon: "warning",
          title: "Information Mismatch Detected",
          html: `
            <div style="text-align: left;">
              <p>The following information in your resume differs from your account:</p>
              <ul style="margin-top: 10px;">
                ${mismatchMessages.map((msg) => `<li>${msg}</li>`).join("")}
              </ul>
              <p style="margin-top: 15px;">Do you want to proceed with autofilling your profile from the resume?</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Yes, Autofill",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (!result.isConfirmed) {
          Swal.fire({
            icon: "info",
            title: "Autofill Cancelled",
            text: "Your profile was not changed.",
          });
          throw new Error("Autofill cancelled by user");
        }
      }

      // Map parsed fields to our form structure, falling back to existing values
      setForm((prev) => ({
        fullName: parsed.name ?? parsed.fullName ?? prev.fullName,
        headline: parsed.headline ?? prev.headline,
        location: parsed.location ?? prev.location,
        skills: Array.isArray(parsed.skills)
          ? parsed.skills.join(", ")
          : (parsed.skills ?? prev.skills),
        summary: parsed.summary ?? prev.summary,
        email: prev.email,
        total_experience: parsed.total_experience ?? prev.total_experience,
        total_experience_years:
          parsed.total_experience_years ?? prev.total_experience_years,
      }));

      // Map education to EducationRecord[] if present
      if (Array.isArray(parsed.education) && parsed.education.length > 0) {
        const extractedEducation: EducationRecord[] = (
          parsed.education as Array<Record<string, unknown>>
        ).map((e, i: number) => {
          const cryptoWithUuid = crypto as unknown as {
            randomUUID?: () => string;
          };
          const id =
            typeof crypto !== "undefined" &&
            typeof cryptoWithUuid.randomUUID === "function"
              ? cryptoWithUuid.randomUUID()
              : `${Date.now()}-${i}`;

          return {
            id: id.toString(),
            institution: (e.institution as string) ?? "",
            degree: (e.degree as string) ?? "",
            startDate:
              (e.start_date as string) ?? (e.startDate as string) ?? "",
            endDate: (e.end_date as string) ?? (e.endDate as string) ?? "",
          } as EducationRecord;
        });

        setEducationHistory((prev) => [...extractedEducation, ...prev]);
      }

      // Map experiences to EmploymentRecord[] if present
      if (Array.isArray(parsed.experience) && parsed.experience.length > 0) {
        const extractedEmployment: EmploymentRecord[] = (
          parsed.experience as Array<Record<string, unknown>>
        ).map((e, i: number) => {
          // generate stable client-side id; prefer crypto.randomUUID when available
          const cryptoWithUuid = crypto as unknown as {
            randomUUID?: () => string;
          };
          const id =
            typeof crypto !== "undefined" &&
            typeof cryptoWithUuid.randomUUID === "function"
              ? cryptoWithUuid.randomUUID()
              : `${Date.now()}-${i}`;

          return {
            id: id.toString(),
            company: (e.company as string) ?? "",
            position: (e.title as string) ?? (e.position as string) ?? "",
            startDate:
              (e.start_date as string) ?? (e.startDate as string) ?? "",
            endDate: (e.end_date as string) ?? (e.endDate as string) ?? "",
            currentlyWorking:
              !((e.end_date as string) ?? (e.endDate as string)) || false,
            description: (e.description as string) ?? "",
            verified: false,
            verificationStatus: "draft",
            documents: [],
          } as EmploymentRecord;
        });

        setEmploymentHistory((prev) => [...extractedEmployment, ...prev]);
      }

      // Optionally show a success toast
      // Swal.fire({ icon: 'success', title: 'Parsed', text: 'Resume parsed and profile autofilled.' })
    } catch (err) {
      console.error("Failed to parse resume:", err);
      throw err;
    } finally {
      setAutoFilling(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = new FormData();

      // Build a partial profile object: include only non-empty, non-null fields
      const partialProfile: Record<string, any> = {};
      Object.entries(form).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (typeof value === "string" && value.trim() === "") return;
        partialProfile[key] = value;
      });

      // Ensure email is present for face verification, even if not editing other fields
      if (!partialProfile.email && form.email) {
        partialProfile.email = form.email;
      }

      const userId = user?.id;

      // console.log("userId: ", userId)

      if (userId) {
        payload.append("userId", userId);
      }

      // Only append profile if we actually have fields to update
      if (Object.keys(partialProfile).length > 0) {
        payload.append("profile", JSON.stringify(partialProfile));
      }

      // Only append histories if provided and non-empty
      if (Array.isArray(employmentHistory) && employmentHistory.length > 0) {
        payload.append("employmentHistory", JSON.stringify(employmentHistory));
      }
      if (Array.isArray(educationHistory) && educationHistory.length > 0) {
        payload.append("educationHistory", JSON.stringify(educationHistory));
      }

      // Files: append if selected
      if (resumeFile) payload.append("resume", resumeFile);
      if (profileFile) {
        payload.append("profileImage", profileFile);
      } else if (profileImage) {
        // If no file but we have a data URL string, send it for AI verification
        payload.append("profileImage", profileImage);
      }

      const resp = await axios.post(
        `${API_ENDPOINTS.JOBSEEKER_PROFILE_SAVE}`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const data = resp.data ?? {};

      // Success path
      if (data.success === true) {
        Swal.fire({
          icon: "success",
          title: "Profile Saved",
          text: data.message || "Your profile has been saved successfully.",
        });
        // only exit edit mode on success
        setIsEditing(false);
        return;
      }

      // Build a helpful, user-facing error message from the response
      let userMessage =
        "There was an issue saving your profile. Please try again.";

      if (typeof data.error === "string" && data.error.trim()) {
        userMessage = data.error;
      } else if (typeof data.message === "string" && data.message.trim()) {
        userMessage = data.message;
      } else if (data.respData) {
        // Some backends wrap service responses inside respData (e.g. face-check results)
        const rd = data.respData;
        if (typeof rd === "string") {
          userMessage = rd;
        } else if (rd?.error) {
          userMessage = String(rd.error);
        } else if (typeof rd?.similarity === "number") {
          const pct = Math.round(rd.similarity * 100);
          userMessage = rd.error
            ? `${rd.error} (similarity: ${pct}%)`
            : `Verification failed (similarity: ${pct}%).`;
        } else if (rd?.match === false) {
          userMessage =
            rd.error || "Face embedding does not match our records.";
        }
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        userMessage = data.errors
          .map((e: any) => e?.message || JSON.stringify(e))
          .join("; ");
      }

      Swal.fire({ icon: "error", title: "Save Failed", text: userMessage });
      handleReset();
    } catch (err) {
      // Try to extract a helpful message from axios errors
      if (axios.isAxiosError(err)) {
        const respData = err.response?.data;
        const serverMsg =
          respData?.error || respData?.message || respData?.respData || null;
        const message =
          serverMsg || err.message || "Network error while saving profile.";
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: String(message),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "An unexpected error occurred.",
        });
      }
      logger.error("Profile save error:", err);
      handleReset();
    } finally {
      setSaving(false);
      // keep edit mode if save failed; setIsEditing(false) is handled on success above
    }
  }

  function handleReset() {
    setForm({
      fullName: "",
      headline: "",
      location: "",
      skills: "",
      summary: "",
      email: "",
      total_experience: "",
      total_experience_years: 0,
    });
    setResumeFile(null);
    setProfileImage(null);
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-[#F4F4F4] via-[#F4F4F4]/70 to-white py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Header Section */}

          <ProfileHeader
            form={form}
            profileImage={profileImage}
            setProfileFile={setProfileFile}
            onImageChange={setProfileImage}
            onSave={handleSave}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing((s) => !s)}
            onReset={handleReset}
            saving={saving}
            educationHistory={educationHistory}
          />

          {/* Main Content Grid */}

          <div
            className={` ${
              !isEditing
                ? "opacity-40 grayscale pointer-events-none"
                : "opacity-100"
            }`}
            aria-hidden={!isEditing}
          >
            {/* Responsive grid: main content (2fr) + sidebar (1fr) on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
              {/* Left Column - Form Fields (spans 2 columns on lg+) */}
              <div className="lg:col-span-2 space-y-8">
                <PersonalInformation
                  form={form}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <ProfessionalSummary
                  summary={form.summary}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                {showAddEducation && (
                  <AddEducationForm
                    newEducation={newEducation}
                    onChange={handleNewEducationChange}
                    onAdd={addEducationRecord}
                    onCancel={() => setShowAddEducation(false)}
                    disabled={!isEditing}
                  />
                )}

                <EducationHistory
                  educationHistory={educationHistory}
                  showAddEducation={showAddEducation}
                  onToggleAdd={() => setShowAddEducation(!showAddEducation)}
                  onDelete={deleteEducation}
                  disabled={!isEditing}
                />

                <WorkExperience
                  employmentHistory={employmentHistory}
                  showAddEmployment={showAddEmployment}
                  newEmployment={newEmployment}
                  onToggleAddForm={() =>
                    setShowAddEmployment(!showAddEmployment)
                  }
                  onNewEmploymentChange={handleNewEmploymentChange}
                  onAddEmployment={addEmploymentRecord}
                  onDeleteEmployment={deleteEmployment}
                  onDocumentUpload={handleDocumentUpload}
                  onDocumentRemove={removeDocument}
                  documentInputRefs={documentInputRefs}
                  disabled={!isEditing}
                />
              </div>

              {/* Right Column - Resume Upload (sidebar) */}
              <aside className="lg:col-span-1">
                <ResumeUpload
                  resumeFile={resumeFile}
                  autoFilling={autoFilling}
                  onFileChange={setResumeFile}
                  onAutoFill={autoFillFromResume}
                  disabled={!isEditing}
                />
              </aside>

              {/* Read-only overlay message shown when not editing. Header edit button remains usable. */}
              {!isEditing && (
                <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                  <div className="mt-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm">
                    Read-only mode — click {"Edit Profile"} to make changes
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
