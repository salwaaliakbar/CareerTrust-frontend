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
  } = useEmployment([
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "2023-06",
      currentlyWorking: false,
      description: "Led development team for multiple projects",
      verified: true,
      verificationStatus: "verified",
      documents: [],
    },
  ]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function autoFillFromResume(file: File) {
    setAutoFilling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setForm({
        fullName: "John Smith",
        headline: "Senior Software Engineer",
        location: "San Francisco, CA",
        experience: "8 years",
        skills: "React, TypeScript, Node.js, Python, AWS",
        education: "BS Computer Science - Stanford University",
        summary:
          "Experienced software engineer with 8 years of expertise in building scalable web applications.",
        email: form.email,
      });

      const extractedEmployment: EmploymentRecord[] = [
        {
          id: Date.now().toString(),
          company: "Google Inc.",
          position: "Senior Software Engineer",
          startDate: "2021-03",
          endDate: "",
          currentlyWorking: true,
          description: "Working on cloud infrastructure and scalable systems",
          verified: false,
          verificationStatus: "draft",
          documents: [],
        },
        {
          id: (Date.now() + 1).toString(),
          company: "Microsoft",
          position: "Software Engineer",
          startDate: "2018-06",
          endDate: "2021-02",
          currentlyWorking: false,
          description: "Developed enterprise applications using .NET and Azure",
          verified: false,
          verificationStatus: "draft",
          documents: [],
        },
      ];

      setEmploymentHistory((prev) => [...extractedEmployment, ...prev]);
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
