import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  ProfileData,
  EducationRecord,
  EmploymentRecord,
  DocumentFile,
  VerificationStatus,
} from "@/types/jobseeker.types";
import type { RootState } from "@/redux/store/store";

export interface FetchedProfileData {
  id: string;
  clerkId: string;
  fullName: string;
  email?: string;
  headline?: string;
  location?: string;
  summary?: string;
  skills?: string | string[];
  totalExperience?: string;
  totalExperienceYears?: number;
  employmentStatus?: ProfileData["employmentStatus"] | null;
  resumeUrl?: string | null;
  profilePicUrl?: string | null;
  employmentHistory: EmploymentRecord[];
  educationHistory: EducationRecord[];
}

export interface JobseekerProfileState {
  profile: ProfileData;
  education: EducationRecord[];
  employment: EmploymentRecord[];
  resumeUrl?: string | null;
  profilePicUrl?: string | null;
  loading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const initialProfile: ProfileData = {
  fullName: "",
  headline: "",
  location: "",
  skills: "",
  summary: "",
  total_experience: "",
  total_experience_years: 0,
  employmentStatus: "open",
};

export const initialState: JobseekerProfileState = {
  profile: initialProfile,
  education: [],
  employment: [],
  resumeUrl: null,
  profilePicUrl: null,
  loading: false,
  error: null,
};

// Async thunk for fetching jobseeker profile from backend
export const fetchJobseekerProfile = createAsyncThunk(
  "jobseekerProfile/fetchProfile",
  async (clerkId: string, { rejectWithValue }) => {
    try {
      const url = `${API_ENDPOINTS.JOBSEEKER_PROFILE_GET}?clerkId=${encodeURIComponent(
        clerkId
      )}`;

      const response = await axios.get<ApiResponse<FetchedProfileData>>(url);

      if (!response.data?.success || !response.data.data) {
        return rejectWithValue(
          response.data?.message || "Failed to fetch profile"
        );
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          "An error occurred";
        return rejectWithValue(message);
      }

      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "jobseekerProfile",
  initialState,
  reducers: {
    // Profile data
    setProfile(state, action: PayloadAction<ProfileData>) {
      state.profile = action.payload;
    },
    setResumeUrl(state, action: PayloadAction<string | null>) {
      state.resumeUrl = action.payload;
    },
    setProfilePicUrl(state, action: PayloadAction<string | null>) {
      state.profilePicUrl = action.payload;
    },

    // Education
    setEducation(state, action: PayloadAction<EducationRecord[]>) {
      state.education = action.payload;
    },
    addEducation(state, action: PayloadAction<EducationRecord>) {
      state.education.push(action.payload);
    },
    updateEducation(state, action: PayloadAction<EducationRecord>) {
      const idx = state.education.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.education[idx] = action.payload;
    },
    setEducationVerificationStatus(
      state,
      action: PayloadAction<{
        educationId: string | number;
        status: VerificationStatus;
        rejectionReason?: string;
      }>
    ) {
      const { educationId, status, rejectionReason } = action.payload;
      const edu = state.education.find(
        (e) => String(e.id) === String(educationId)
      );
      if (!edu) return;

      const nextVerified = status === "verified";
      const nextRejectionReason = status === "rejected" ? rejectionReason ?? "" : undefined;

      if (
        edu.verificationStatus === status &&
        edu.verified === nextVerified &&
        edu.rejectionReason === nextRejectionReason
      ) {
        return;
      }

      edu.verificationStatus = status;
      edu.verified = nextVerified;

      if (status === "rejected") {
        edu.rejectionReason = nextRejectionReason;
      } else {
        delete edu.rejectionReason;
      }
    },
    deleteEducation(state, action: PayloadAction<string>) {
      state.education = state.education.filter((e) => e.id !== action.payload);
    },

    // Employment
    setEmployment(state, action: PayloadAction<EmploymentRecord[]>) {
      state.employment = action.payload;
    },
    addEmployment(state, action: PayloadAction<EmploymentRecord>) {
      // Keep latest first, aligning with hook behavior
      state.employment = [action.payload, ...state.employment];
    },
    updateEmployment(state, action: PayloadAction<EmploymentRecord>) {
      const idx = state.employment.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.employment[idx] = action.payload;
    },
    deleteEmployment(state, action: PayloadAction<string>) {
      state.employment = state.employment.filter((e) => e.id !== action.payload);
    },
    addEmploymentDocuments(
      state,
      action: PayloadAction<{ empId: string; documents: DocumentFile[] }>
    ) {
      const { empId, documents } = action.payload;
      const emp = state.employment.find((e) => e.id === empId);
      if (!emp) return;
      const updatedDocs = [...emp.documents, ...documents];
      const newStatus:
        | VerificationStatus
        | undefined =
        emp.verificationStatus === "draft" && updatedDocs.length > 0
          ? "pending"
          : undefined;
      emp.documents = updatedDocs;
      if (newStatus) emp.verificationStatus = newStatus;
    },
    removeEmploymentDocument(
      state,
      action: PayloadAction<{ empId: string; docId: string }>
    ) {
      const { empId, docId } = action.payload;
      const emp = state.employment.find((e) => e.id === empId);
      if (!emp) return;
      const updatedDocs = emp.documents.filter((d) => d.id !== docId);
      const newStatus:
        | VerificationStatus
        | undefined =
        updatedDocs.length === 0 && emp.verificationStatus === "pending"
          ? "draft"
          : undefined;
      emp.documents = updatedDocs;
      if (newStatus) emp.verificationStatus = newStatus;
    },
    setEmploymentVerificationStatus(
      state,
      action: PayloadAction<{ empId: string; status: VerificationStatus; rejectionReason?: string }>
    ) {
      const { empId, status, rejectionReason } = action.payload;
      const emp = state.employment.find((e) => String(e.id) === String(empId));
      if (!emp) return;

      const nextVerified = status === "verified";
      const nextRejectionReason = status === "rejected" ? rejectionReason ?? "" : undefined;

      if (
        emp.verificationStatus === status &&
        emp.verified === nextVerified &&
        emp.rejectionReason === nextRejectionReason
      ) {
        return;
      }

      emp.verificationStatus = status;
      emp.verified = nextVerified;
      if (status === "rejected") {
        emp.rejectionReason = nextRejectionReason;
      } else {
        delete emp.rejectionReason;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile pending
      .addCase(fetchJobseekerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch profile fulfilled
      .addCase(fetchJobseekerProfile.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedData = action.payload;

        console.log("[Profile Slice] Fetched profile data:", fetchedData);  

        // Normalize skills: extract skillName from array of objects
        let normalizedSkills = "";
        if (typeof fetchedData.skills === "string") {
          normalizedSkills = fetchedData.skills;
        } else if (Array.isArray(fetchedData.skills)) {
          normalizedSkills = fetchedData.skills
            .map((skill) => {
              if (typeof skill === "string") return skill;
              if (skill && typeof skill === "object") {
                const maybeSkill = skill as { skillName?: unknown };
                return typeof maybeSkill.skillName === "string"
                  ? maybeSkill.skillName
                  : "";
              }
              return "";
            })
            .filter(Boolean)
            .join(", ");
        }

        // Map fetched data to profile
        state.profile = {
          fullName: fetchedData.fullName || "",
          headline: fetchedData.headline || "",
          location: fetchedData.location || "",
          skills: normalizedSkills,
          summary: fetchedData.summary || "",
          total_experience: fetchedData.totalExperience || "",
          total_experience_years: fetchedData.totalExperienceYears || 0,
          employmentStatus: fetchedData.employmentStatus || "open",
          email: fetchedData.email,
        };

        state.resumeUrl = fetchedData.resumeUrl || null;
        state.profilePicUrl = fetchedData.profilePicUrl || null;
        state.education = fetchedData.educationHistory || [];
        state.employment = fetchedData.employmentHistory || [];
      })
      // Fetch profile rejected
      .addCase(fetchJobseekerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch profile";
      });
  },
});

export const {
  setProfile,
  setResumeUrl,
  setProfilePicUrl,
  setEducation,
  addEducation,
  updateEducation,
  setEducationVerificationStatus,
  deleteEducation,
  setEmployment,
  addEmployment,
  updateEmployment,
  deleteEmployment,
  addEmploymentDocuments,
  removeEmploymentDocument,
  setEmploymentVerificationStatus,
} = profileSlice.actions;

export default profileSlice.reducer;

// Selectors
export const selectJobseekerProfile = (state: RootState) => state.jobseekerProfile;
export const selectEducation = (state: RootState) => state.jobseekerProfile.education;
export const selectEmployment = (state: RootState) => state.jobseekerProfile.employment;
export const selectVerifiedEmployment = (state: RootState) =>
  state.jobseekerProfile.employment.filter((e) => e.verificationStatus === "verified");
export const selectProfileLoading = (state: RootState) => state.jobseekerProfile.loading;
export const selectProfileError = (state: RootState) => state.jobseekerProfile.error;
