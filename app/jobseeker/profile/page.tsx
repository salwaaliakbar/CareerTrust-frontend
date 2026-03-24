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
import ExitRequestModal from "@/components/jobseekerDashboard/ExitRequestModal";
import EducationHistory from "@/components/jobseekerDashboard/EducationHistory";
import AddEducationForm from "@/components/jobseekerDashboard/AddEducationForm";
import ResumeUpload from "@/components/jobseekerDashboard/ResumeUpload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import logger from "@/lib/logger";
import axios from "axios";
import { useUser, useAuth } from "@clerk/nextjs";
import { API_ENDPOINTS } from "@/constants/api";
import Swal from "sweetalert2";
import Test from "@/app/Test";
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
  setProfilePicUrl,
  setResumeUrl,
} from "@/redux/store/slices/jobseeker/profileSlice";
import { updateJobMatches } from "@/redux/store/slices/jobsSlice";
import { useJobRecommendationPolling } from "@/hooks/useJobRecommenadtionPolling";

type JobRecommendationItem = {
  jobId: number;
  score?: number | null;
};

type ProfileApiResponseData = {
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  skills?:
    | string
    | Array<string | { skillName?: string | null }>
    | null;
  summary?: string | null;
  email?: string | null;
  total_experience?: string | null;
  totalExperience?: string | null;
  total_experience_years?: number | null;
  totalExperienceYears?: number | null;
  employmentStatus?: "open" | "not_open" | null;
  profilePicUrl?: string | null;
  resumeUrl?: string | null;
  educationHistory?: EducationRecord[];
  employmentHistory?: EmploymentRecord[];
};

function normalizeSkillsToText(skills: unknown): string {
  if (typeof skills === "string") {
    return skills;
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => {
        if (typeof skill === "string") return skill;
        if (skill && typeof skill === "object" && "skillName" in skill) {
          return String((skill as { skillName?: unknown }).skillName || "");
        }
        return "";
      })
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

function mapApiProfileToForm(data: ProfileApiResponseData): ProfileData {
  const totalExperienceYears = Number(
    data?.total_experience_years ?? data?.totalExperienceYears ?? 0,
  );

  return {
    fullName: data?.fullName || "",
    headline: data?.headline || "",
    location: data?.location || "",
    skills: normalizeSkillsToText(data?.skills),
    summary: data?.summary || "",
    email: data?.email || "",
    total_experience: data?.total_experience || data?.totalExperience || "",
    total_experience_years: Number.isFinite(totalExperienceYears)
      ? totalExperienceYears
      : 0,
    employmentStatus: data?.employmentStatus || "open",
  };
}

export default function ProfilePage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  // Job Recommendation Polling and Redux update
  const clerkId = user?.id;
  const [startPolling, setStartPolling] = useState(false);
  const [pollSince, setPollSince] = useState<string | null>(null);
  const dispatch = useDispatch();
  // Notification state
  const { notifications, addNotification } = useNotificationState();
  const [showPopup, setShowPopup] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch new recommendations from BFF
  const fetchNewRecommendations = useCallback(async () => {
    if (!clerkId) return;
    try {
      const res = await axios.get(
        `/api/jobRecommendation/recommendations?clerkId=${clerkId}`,
      );
      const recommendations: JobRecommendationItem[] = Array.isArray(
        res.data?.recommendations,
      )
        ? res.data.recommendations
        : [];
      console.log("Fetched new job recommendations:", recommendations);
      // Handle both normalized scores (0-1) and percentage scores (0-100).
      dispatch(
        updateJobMatches(
          recommendations.map((r) => ({
            id: r.jobId,
            match:
              typeof r.score === "number"
                ? Math.round(r.score <= 1 ? r.score * 100 : r.score)
                : 0,
          })),
        ),
      );
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
  }, [addNotification, clerkId, dispatch]);

  // Only start polling after profile update
  useJobRecommendationPolling({
    clerkId: startPolling && clerkId ? clerkId : "",
    pollSince,
    onNewRecommendation: fetchNewRecommendations,
    onPollingEnd: () => {
      setStartPolling(false);
    },
    interval: 10000,
    maxAttempts: 10,
  });

  const [form, setForm] = useState<ProfileData>({
    fullName: "",
    headline: "",
    location: "",
    skills: "",
    summary: "",
    email: "",
    total_experience: "",
    total_experience_years: 0,
    employmentStatus: "open", // "open" = Open for Opportunities, "not_open" = Not Open
  });

  // Redux hooks
  const reduxProfile = useSelector(selectJobseekerProfile);
  const profileLoading = useSelector(selectProfileLoading);
  const [hasCheckedRedux, setHasCheckedRedux] = useState(false);
  const hasReduxProfileData = React.useMemo(
    () =>
      Boolean(
        reduxProfile.profile?.fullName ||
          reduxProfile.profile?.email ||
          reduxProfile.profilePicUrl ||
          reduxProfile.resumeUrl ||
          reduxProfile.education.length > 0 ||
          reduxProfile.employment.length > 0,
      ),
    [
      reduxProfile.profile?.fullName,
      reduxProfile.profile?.email,
      reduxProfile.profilePicUrl,
      reduxProfile.resumeUrl,
      reduxProfile.education.length,
      reduxProfile.employment.length,
    ],
  );

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

  const updateEmploymentStatus = useCallback(
    (status: "open" | "not_open") => {
      setForm((prev) => ({ ...prev, employmentStatus: status }));
    },
    [],
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Hydrate local UI state from Redux whenever profile data is available.
  React.useEffect(() => {
    if (!mounted || !user || !hasReduxProfileData || isEditing) return;

    setForm({
      ...reduxProfile.profile,
      employmentStatus: reduxProfile.profile?.employmentStatus || "open",
    });
    setEducationHistory(reduxProfile.education);
    setEmploymentHistory(reduxProfile.employment);
    setProfileImage(reduxProfile.profilePicUrl || null);
    setResumeFile(null);
    setProfileFile(null);
    logger.info("Loaded profile data from Redux");
  }, [
    mounted,
    user,
    hasReduxProfileData,
    isEditing,
    reduxProfile.profile,
    reduxProfile.education,
    reduxProfile.employment,
    reduxProfile.profilePicUrl,
    setEducationHistory,
    setEmploymentHistory,
  ]);

  // Always fetch once on page open so persisted backend data refreshes Redux/local state.
  React.useEffect(() => {
    if (!mounted || !user) return;
    if (hasCheckedRedux || profileLoading) return;

    const currentClerkId = user.id;
    if (!currentClerkId) return;

    setHasCheckedRedux(true);
    dispatch(fetchJobseekerProfile(currentClerkId) as any).then((action: any) => {
      if (action.payload) {
        const fetchedData = action.payload as ProfileApiResponseData;
        setForm(mapApiProfileToForm(fetchedData));
        setEducationHistory(
          Array.isArray(fetchedData.educationHistory)
            ? fetchedData.educationHistory
            : [],
        );
        setEmploymentHistory(
          Array.isArray(fetchedData.employmentHistory)
            ? fetchedData.employmentHistory
            : [],
        );
        setProfileImage(fetchedData.profilePicUrl || null);
        setResumeFile(null);
        setProfileFile(null);
        logger.info("Fetched and loaded profile data from backend");
      }
    });
  }, [
    mounted,
    user,
    hasReduxProfileData,
    hasCheckedRedux,
    profileLoading,
    dispatch,
    setEducationHistory,
    setEmploymentHistory,
  ]);

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
      } else if (profileImage?.startsWith("data:image/")) {
        // If no file but we have a fresh data URL string, send it for AI verification.
        // Do not send existing Cloudinary URLs as `profileImage` payload.
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
        const savedProfile = data?.data as ProfileApiResponseData | undefined;

        if (savedProfile) {
          const normalizedForm = mapApiProfileToForm(savedProfile);
          const normalizedEducation: EducationRecord[] = Array.isArray(
            savedProfile.educationHistory,
          )
            ? savedProfile.educationHistory
            : educationHistory;
          const normalizedEmployment: EmploymentRecord[] = Array.isArray(
            savedProfile.employmentHistory,
          )
            ? savedProfile.employmentHistory
            : employmentHistory;

          setForm(normalizedForm);
          setEducationHistory(normalizedEducation);
          setEmploymentHistory(normalizedEmployment);
          setProfileImage(savedProfile.profilePicUrl || null);
          setProfileFile(null);
          setResumeFile(null);

          // Keep Redux in sync so reopening this page (or other pages) shows latest profile assets/status.
          dispatch(setProfile(normalizedForm));
          dispatch(setEducation(normalizedEducation));
          dispatch(setEmployment(normalizedEmployment));
          dispatch(setResumeUrl(savedProfile.resumeUrl || null));
          dispatch(setProfilePicUrl(savedProfile.profilePicUrl || null));
        }

        Swal.fire({
          icon: "success",
          title: "Profile Saved",
          text: data.message || "Your profile has been saved successfully.",
        });
        // only exit edit mode on success
        setIsEditing(false);
        const profileUpdatedAt = data?.data?.updatedAt;
        setPollSince(
          typeof profileUpdatedAt === "string" && profileUpdatedAt
            ? profileUpdatedAt
            : new Date().toISOString(),
        );
        setStartPolling(true);
        return;
      }

      // Build a helpful, user-facing error message from the response
      let userMessage =
        "There was an issue saving your profile. Please try again.";

      const verificationDetails = data.details || data.respData;

      if (typeof data.error === "string" && data.error.trim()) {
        userMessage = data.error;
      } else if (typeof data.message === "string" && data.message.trim()) {
        userMessage = data.message;
      } else if (verificationDetails) {
        // Some backends wrap service responses inside respData (e.g. face-check results)
        const rd = verificationDetails;
        if (typeof rd === "string") {
          userMessage = rd;
        } else if (rd?.error) {
          userMessage = String(rd.error);
        } else if (typeof rd?.similarity === "number") {
          const pct = Math.round(rd.similarity * 100);
          userMessage = rd.error
            ? `${rd.error} (similarity: ${pct}%)`
            : `Verification failed (similarity: ${pct}%).`;
          if (typeof rd?.threshold === "number") {
            const thresholdPct = Math.round(rd.threshold * 100);
            userMessage += ` Required threshold: ${thresholdPct}%.`;
          }
          if (rd?.lookupSource) {
            userMessage += ` Lookup source: ${rd.lookupSource}.`;
          }
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
        const verifyDetails = respData?.details || respData?.respData;

        let detailsMessage: string | null = null;
        if (verifyDetails) {
          if (typeof verifyDetails === "string") {
            detailsMessage = verifyDetails;
          } else if (verifyDetails?.error) {
            detailsMessage = String(verifyDetails.error);
          }

          if (typeof verifyDetails?.similarity === "number") {
            const pct = Math.round(verifyDetails.similarity * 100);
            detailsMessage = detailsMessage
              ? `${detailsMessage} (similarity: ${pct}%)`
              : `Verification failed (similarity: ${pct}%).`;

            if (typeof verifyDetails?.threshold === "number") {
              const thresholdPct = Math.round(verifyDetails.threshold * 100);
              detailsMessage += ` Required threshold: ${thresholdPct}%.`;
            }

            if (verifyDetails?.lookupSource) {
              detailsMessage += ` Lookup source: ${verifyDetails.lookupSource}.`;
            }
          }
        }

        const serverMsg =
          detailsMessage ||
          respData?.error ||
          respData?.message ||
          respData?.respData ||
          null;
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

  // Auto-compute whether applicant is currently employed based on experience records:
  // Employed = has a record with startDate but no endDate (currently working)
  const isCurrentlyEmployed = React.useMemo(() => {
    if (!Array.isArray(employmentHistory) || employmentHistory.length === 0)
      return false;
    return employmentHistory.some(
      (job) => job.startDate && (!job.endDate || job.endDate.trim() === ""),
    );
  }, [employmentHistory]);

  // Exit Request Modal state
  const [exitRequestEmpId, setExitRequestEmpId] = useState<string | null>(null);
  const exitRequestEmployment = employmentHistory.find(
    (e) => e.id === exitRequestEmpId,
  );

  function handleReset() {
    if (hasReduxProfileData) {
      setForm({
        ...reduxProfile.profile,
        employmentStatus: reduxProfile.profile?.employmentStatus || "open",
      });
      setEducationHistory(reduxProfile.education);
      setEmploymentHistory(reduxProfile.employment);
      setProfileImage(reduxProfile.profilePicUrl || null);
    } else {
      setForm({
        fullName: "",
        headline: "",
        location: "",
        skills: "",
        summary: "",
        email: "",
        total_experience: "",
        total_experience_years: 0,
        employmentStatus: "open",
      });
      setProfileImage(null);
    }

    setResumeFile(null);
    setProfileFile(null);
  }

  return (
    <div>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
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
            isCurrentlyEmployed={isCurrentlyEmployed}
            openForOpportunities={form.employmentStatus === "open"}
            onToggleOpenForOpportunities={() =>
              updateEmploymentStatus(
                form.employmentStatus === "open" ? "not_open" : "open",
              )
            }
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
                  onExitRequest={(empId) => setExitRequestEmpId(empId)}
                />
              </div>

              {/* Right Column - Resume Upload + Open for Opportunities (sidebar) */}
              <aside className="lg:col-span-1 space-y-10">
                {/* Open for Opportunities Selector */}
                 <ResumeUpload
                  resumeFile={resumeFile}
                  previousResumeUrl={reduxProfile.resumeUrl}
                  autoFilling={autoFilling}
                  onFileChange={setResumeFile}
                  onAutoFill={autoFillFromResume}
                  disabled={!isEditing}
                />

                <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-2xl transition-all duration-300 overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Job Availability
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Let employers know if you&apos;re open to new opportunities.
                    This is shown publicly on your profile.
                  </p>

                  {/* Auto-generated employment status info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Auto-detected Status
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCurrentlyEmployed ? "bg-orange-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {isCurrentlyEmployed ? "Employed" : "Not Employed"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {isCurrentlyEmployed
                        ? "Based on your experience — at least one job has no end date."
                        : "Based on your experience — all jobs have end dates."}
                    </p>
                  </div>

                  {/* User-controlled open for opportunities */}
                  <div className="space-y-3">
                    {[
                      {
                        value: "open" as const,
                        label: "Open for Opportunities",
                        desc: "Employers can see you're open to new roles",
                        colorClass:
                          "border-green-500 bg-green-50 text-green-800",
                        dotColor: "bg-green-500",
                      },
                      {
                        value: "not_open" as const,
                        label: "Not Open for Opportunities",
                        desc: "You are not currently seeking new roles",
                        colorClass: "border-red-400 bg-red-50 text-red-800",
                        dotColor: "bg-red-500",
                      },
                    ].map(({ value, label, desc, colorClass, dotColor }) => {
                      const selected = form.employmentStatus === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={!isEditing}
                          onClick={() =>
                            updateEmploymentStatus(value)
                          }
                          className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                            selected
                              ? colorClass
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full shrink-0 ${
                                selected ? dotColor : "bg-gray-300"
                              }`}
                            />
                            <span className="font-bold text-sm">{label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 ml-5">
                            {desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
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
      {/* Exit Request Modal */}
      {exitRequestEmployment && (
        <ExitRequestModal
          isOpen={exitRequestEmpId !== null}
          onClose={() => setExitRequestEmpId(null)}
          employment={exitRequestEmployment}
          getToken={getToken}
          onSuccess={() => {
            // Optimistically mark as "not currently working" in local state
            // Real refresh will happen on next profile load
          }}
        />
      )}
      {showPopup && (
        <div className="fixed top-6 right-6 z-[9999] bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl text-base font-semibold animate-fade-in flex items-center gap-2">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
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
