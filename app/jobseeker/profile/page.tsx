// app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { ProfileData, EmploymentRecord } from "@/types/jobseeker.types";
import { useEmployment } from "@/hooks/useEmployment";
import ProfileHeader from "@/components/jobseekerDashboard/ProfileHeader";
import PersonalInformation from "@/components/jobseekerDashboard/PersonalInformation";
import ProfessionalSummary from "@/components/jobseekerDashboard/ProfessionalSummary";
import WorkExperience from "@/components/jobseekerDashboard/WorkExperience";
import ResumeUpload from "@/components/jobseekerDashboard/ResumeUpload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import logger from "@/lib/logger";
import axios from "axios";

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileData>({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: "",
    education: "",
    summary: "",
    email: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  const {
    employmentHistory,
    setEmploymentHistory,
    showAddEmployment,
    setShowAddEmployment,
    newEmployment,
    setNewEmployment,
    documentInputRefs,
    addEmploymentRecord,
    deleteEmployment,
    handleDocumentUpload,
    removeDocument,
  } = useEmployment([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function autoFillFromResume(file: File) {
    setAutoFilling(true);
    try {
      const form = new FormData();
      // backend expects field name `resume`
      form.append("resume", file);

      let parsed: any = null;
      try {
        const resp = await axios.post("/api/resume/parse-resume", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const body = resp.data;
        // API should return { parsed: { ... } } or parsed directly
        parsed = body.parsed ?? body;
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
        return;
      }

      logger.info("Parsed resume data:", parsed);

      // Map parsed fields to our form structure, falling back to existing values
      setForm((prev) => ({
        fullName: parsed.name ?? parsed.fullName ?? prev.fullName,
        headline: parsed.headline ?? prev.headline,
        location: parsed.location ?? prev.location,
        experience: Array.isArray(parsed.experience)
          ? (parsed.experience as Array<Record<string, unknown>>)
              .map((x) => (x.title as string) ?? (x.position as string) ?? (x.company as string))
              .filter(Boolean)
              .join(", ")
          : parsed.experience ?? prev.experience,
        skills: Array.isArray(parsed.skills) ? parsed.skills.join(", ") : parsed.skills ?? prev.skills,
        education:
          Array.isArray(parsed.education) && parsed.education.length > 0
            ? typeof parsed.education[0] === "string"
              ? parsed.education[0]
              : `${parsed.education[0].degree ?? ""} - ${parsed.education[0].institution ?? ""}`
            : parsed.education ?? prev.education,
        summary: parsed.summary ?? prev.summary,
        email: prev.email,
      }));

      // Map experiences to EmploymentRecord[] if present
      if (Array.isArray(parsed.experience) && parsed.experience.length > 0) {
        const extractedEmployment: EmploymentRecord[] = (parsed.experience as Array<Record<string, unknown>>).map((e, i: number) => {
          // generate stable client-side id; prefer crypto.randomUUID when available
          const cryptoWithUuid = crypto as unknown as { randomUUID?: () => string };
          const id = typeof crypto !== "undefined" && typeof cryptoWithUuid.randomUUID === "function"
            ? cryptoWithUuid.randomUUID()
            : `${Date.now()}-${i}`;

          return {
            id: id.toString(),
            company: (e.company as string) ?? "",
            position: (e.title as string) ?? (e.position as string) ?? "",
            startDate: (e.start_date as string) ?? (e.startDate as string) ?? "",
            endDate: (e.end_date as string) ?? (e.endDate as string) ?? "",
            currentlyWorking: !((e.end_date as string) ?? (e.endDate as string)) || false,
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
    } finally {
      setAutoFilling(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("profile", JSON.stringify(form));
      payload.append("employmentHistory", JSON.stringify(employmentHistory));
      if (resumeFile) payload.append("resume", resumeFile);
      if (profileImage) payload.append("profileImage", profileImage);
      // await fetch("/api/profile", { method: "POST", body: payload });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm({
      fullName: "",
      headline: "",
      location: "",
      experience: "",
      skills: "",
      education: "",
      summary: "",
      email: "",
    });
    setResumeFile(null);
    setProfileImage(null);
  }

  function handleNewEmploymentChange<K extends keyof EmploymentRecord>(
    field: K,
    value: EmploymentRecord[K]
  ) {
    setNewEmployment((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-[#F4F4F4] via-[#F4F4F4]/70 to-white py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Header Section */}
          <ProfileHeader
            form={form}
            profileImage={profileImage}
            onImageChange={setProfileImage}
            onSave={handleSave}
            onReset={handleReset}
            saving={saving}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information Card */}
              <PersonalInformation form={form} onChange={handleChange} />

              {/* Professional Summary Card */}
              <ProfessionalSummary
                summary={form.summary}
                onChange={handleChange}
              />

              {/* Work Experience Section */}
              <WorkExperience
                employmentHistory={employmentHistory}
                showAddEmployment={showAddEmployment}
                newEmployment={newEmployment}
                onToggleAddForm={() => setShowAddEmployment(!showAddEmployment)}
                onNewEmploymentChange={handleNewEmploymentChange}
                onAddEmployment={addEmploymentRecord}
                onDeleteEmployment={deleteEmployment}
                onDocumentUpload={handleDocumentUpload}
                onDocumentRemove={removeDocument}
                documentInputRefs={documentInputRefs}
              />
            </div>

            {/* Right Column - Resume Upload */}
            <div className="lg:col-span-1">
              <ResumeUpload
                resumeFile={resumeFile}
                autoFilling={autoFilling}
                onFileChange={setResumeFile}
                onAutoFill={autoFillFromResume}
              />
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}
