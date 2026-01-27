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
import { useRef, useCallback } from "react";
import { useNotificationState } from "@/hooks/useNotificationState";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobseekerProfile,
  selectJobseekerProfile,
  selectProfileLoading,
  setEducation,
  setEmployment,
  setProfile,
} from "@/src/store/slices/jobseeker/profileSlice";
import { updateJobMatches } from "@/src/store/slices/jobsSlice";
import { useJobRecommendationPolling } from "@/hooks/useJobRecommenadtionPolling";

export default function ProfilePage() {
  const { user } = useUser();
  // Job Recommendation Polling and Redux update
  const clerkId = user?.id;
  const [startPolling, setStartPolling] = useState(false);
  const dispatch = useDispatch();
  // Notification state
  const { notifications, addNotification } = useNotificationState();
  const [showPopup, setShowPopup] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch new recommendations from BFF
  const fetchNewRecommendations = async () => {
    if (!clerkId) return;
    try {
      const res = await axios.get(`/api/jobRecommendation/recommendations?clerkId=${clerkId}`);
      const recommendations = res.data.recommendations || [];
      console.log("Fetched new job recommendations:", recommendations);
      // Map score (0-1) to match (0-100) percent
      dispatch(updateJobMatches(recommendations.map((r: any) => ({ id: r.jobId, match: Math.round((r.score ?? 0) * 100) }))));
      // Add notification and show popup
      addNotification({
        type: "job_recommendation",
        title: "New Job Recommendations!",
        message: "You have new job recommendations. Check the jobs page.",
      });
      setShowPopup(true);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = setTimeout(() => setShowPopup(false), 3500);
    } catch (err) {
      logger.error("Failed to fetch job recommendations", err);
    }
  };
  // Only start polling after profile update
  useJobRecommendationPolling(
    startPolling && clerkId ? clerkId : "",
    () => {
      fetchNewRecommendations();
      setStartPolling(false); // Stop polling after update
    },
    10000,
    10 // maxAttempts
  );
  
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

  // Redux hooks
  const reduxProfile = useSelector(selectJobseekerProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const [hasCheckedRedux, setHasCheckedRedux] = useState(false);

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Load from Redux or fetch from backend on mount
  // React.useEffect(() => {
  //   if (!mounted || !user) return;

  //   // Check if we have data in Redux
  //   if (reduxProfile.profile?.fullName) {
  //     // Data exists in Redux, use it
  //     setForm(reduxProfile.profile);
  //     setEducationHistory(reduxProfile.education);
  //     setEmploymentHistory(reduxProfile.employment);
  //     setHasCheckedRedux(true);
  //     logger.info("Loaded profile data from Redux");
  //   } else if (!hasCheckedRedux && !profileLoading) {
  //     // No data in Redux, fetch from backend
  //     const clerkId = user.id;
  //     if (clerkId) {
  //       dispatch(fetchJobseekerProfile(clerkId) as any).then((action: any) => {
  //         if (action.payload) {
  //           // Data fetched successfully, update local form state
  //           const fetchedData = action.payload;
  //           setForm({
  //             fullName: fetchedData.fullName || "",
  //             headline: fetchedData.headline || "",
  //             location: fetchedData.location || "",
  //             skills: typeof fetchedData.skills === "string"
  //               ? fetchedData.skills
  //               : Array.isArray(fetchedData.skills)
  //                 ? fetchedData.skills.join(", ")
  //                 : "",
  //             summary: fetchedData.summary || "",
  //             email: fetchedData.email || "",
  //             total_experience: fetchedData.total_experience || "",
  //             total_experience_years: fetchedData.total_experience_years || 0,
  //           });
  //           setEducationHistory(fetchedData.educationHistory || []);
  //           setEmploymentHistory(fetchedData.employmentHistory || []);
  //           logger.info("Fetched and loaded profile data from backend");
  //         }
  //         setHasCheckedRedux(true);
  //       });
  //     }
  //   }
  // }, [mounted, user, reduxProfile.profile?.email, hasCheckedRedux, profileLoading, dispatch]);

  // Autofill from Clerk on mount only
  React.useEffect(() => {
    if (!mounted || !user || hasCheckedRedux) return;

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
  }, [mounted, user, hasCheckedRedux]);

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
            `<strong>Name:</strong> Resume has "${
              parsed.name || "N/A"
            }" but your account shows "${
              form.fullName || user?.fullName || "N/A"
            }" (will be updated)`,
          );
        }
        if (mismatches.email) {
          mismatchMessages.push(
            `<strong>Email:</strong> Resume has "${
              parsed.email || "N/A"
            }" but your account shows "${
              form.email || user?.primaryEmailAddress?.emailAddress || "N/A"
            }" (protected - will not be changed)`,
          );
        }

        const result = await Swal.fire({
          icon: "warning",
          title: "Information Mismatch Detected",
          html: `
            <div style="text-align: left;">
              <p>The following information in your resume differs from your account:</p>
              <ul style="margin-top: 10px; line-height: 1.8;">
                ${mismatchMessages.map((msg) => `<li>${msg}</li>`).join("")}
              </ul>
              <div style="margin-top: 15px; padding: 10px; background-color: #f0f8ff; border-left: 4px solid #3085d6; border-radius: 4px;">
                <p style="margin: 0; font-size: 0.9em; color: #555;">
                  <strong>Note:</strong> Your email is linked to your account authentication and cannot be changed during autofill. 
                  If you need to update your email, please do so through your account settings.
                </p>
              </div>
              <p style="margin-top: 15px;">Do you want to proceed with autofilling your profile?</p>
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

      // Map education to EducationRecord[] if present - REPLACE not append
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

        setEducationHistory(extractedEducation);
      } else {
        setEducationHistory([]);
      }

      // Map experiences to EmploymentRecord[] if present - REPLACE not append
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

        setEmploymentHistory(extractedEmployment);
      } else {
        setEmploymentHistory([]);
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
        setStartPolling(true);
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
      {showPopup && (
        <div className="fixed top-6 right-6 z-[9999] bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl text-base font-semibold animate-fade-in flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          New notification arrived!
          <button
            className="ml-3 text-white hover:text-gray-200 text-lg font-bold px-2 focus:outline-none"
            onClick={() => setShowPopup(false)}
            aria-label="Close notification popup"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
