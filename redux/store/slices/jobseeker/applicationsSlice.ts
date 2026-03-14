import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "@/redux/store/store";
import type { JobsState } from "@/redux/store/slices/jobsSlice";

export interface ApplicationData {
  id: string | number;
  jobId: string | number;
  status: string;
  appliedAt: string;
}

export interface ApplicationsState {
  appliedJobIds: (string | number)[]; // Simple list of job IDs user has applied to
  applicationDetails: Record<string | number, ApplicationData>; // Detailed application data
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

const initialState: ApplicationsState = {
  appliedJobIds: [],
  applicationDetails: {},
  loading: false,
  error: null,
  lastFetchTime: null,
};

// Cache duration: 10 minutes (same as jobs)
const CACHE_DURATION = 10 * 60 * 1000;

// Async thunk to fetch user's applied jobs
export const fetchUserApplications = createAsyncThunk<
  ApplicationData[],
  { clerkId?: string; forceRefresh?: boolean } | undefined
>(
  "applications/fetchUserApplications",
  async (args: { clerkId?: string; forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as RootState).applications as ApplicationsState;
      const now = Date.now();
      const forceRefresh = typeof args === "object" && args?.forceRefresh;

      // Return cached data if fresh (unless force refresh)
      if (
        !forceRefresh &&
        state.appliedJobIds.length > 0 &&
        state.lastFetchTime &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        // Return from cache
        return state.appliedJobIds.map((id) => state.applicationDetails[id]).filter(Boolean);
      }

      // Fetch from API
      const response = await axios.get("/api/applications/user");

      if (response.data?.success && Array.isArray(response.data.data)) {
        // Transform simple job IDs into ApplicationData
        const appliedJobIds = response.data.data;
        const applications: ApplicationData[] = appliedJobIds.map((jobId: string | number) => ({
          id: `app_${jobId}`,
          jobId,
          status: "applied",
          appliedAt: new Date().toISOString(),
        }));

        return applications;
      }

      throw new Error(response.data?.message || "Failed to fetch applications");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          "Failed to fetch applications";
        return rejectWithValue(message);
      }

      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch applications"
      );
    }
  }
);



const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    // Add a new applied job
    addAppliedJob(state, action: PayloadAction<string | number>) {
      const jobId = String(action.payload);
      if (!state.appliedJobIds.includes(jobId)) {
        state.appliedJobIds.push(jobId);
        state.applicationDetails[jobId] = {
          id: `app_${jobId}`,
          jobId,
          status: "applied",
          appliedAt: new Date().toISOString(),
        };
      }
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user applications
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserApplications.fulfilled,
        (state, action: PayloadAction<ApplicationData[]>) => {
          state.loading = false;
          state.appliedJobIds = action.payload.map((app) => String(app.jobId));
          state.applicationDetails = {};
          action.payload.forEach((app) => {
            state.applicationDetails[String(app.jobId)] = app;
          });
          state.lastFetchTime = Date.now();
        }
      )
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addAppliedJob, clearError } = applicationsSlice.actions;

export default applicationsSlice.reducer;

// Selectors
export const selectApplications = (state: RootState) => state.applications;
export const selectAppliedJobIds = (state: RootState) =>
  state.applications.appliedJobIds;
export const selectApplicationDetails = (state: RootState) =>
  state.applications.applicationDetails;
export const selectApplicationsLoading = (state: RootState) =>
  state.applications.loading;
export const selectApplicationsError = (state: RootState) =>
  state.applications.error;

// Selector to check if a specific job has been applied to
export const selectHasAppliedToJob =
  (jobId: string | number) =>
  (state: RootState) => {
    const jobIdStr = String(jobId);
    return state.applications.appliedJobIds.includes(jobIdStr);
  };

// Selector to get all applications with details and match percentages
export const selectApplicationsWithDetails = (state: RootState) => {
  return state.applications.appliedJobIds.map(
    (jobId) => state.applications.applicationDetails[jobId]
  );
};

// Selector to get applied jobs with their match data from jobs slice
export const selectAppliedJobsWithMatches = (state: RootState) => {
  const appliedJobIds = state.applications.appliedJobIds;
  const jobsById = state.jobs.jobsById || {};

  return appliedJobIds
    .map((jobId) => {
      const job = jobsById[jobId];
      if (!job) return null;

      return {
        ...job,
        applicationId: `app_${jobId}`,
        appliedAt: state.applications.applicationDetails[jobId]?.appliedAt,
      };
    })
    .filter(Boolean);
};

// Selector to get recommended applied jobs (with match > 0)
export const selectRecommendedApplications = (state: RootState) => {
  return selectAppliedJobsWithMatches(state)
    .filter((job) => job && job.match && job.match > 0)
    .sort((a, b) => (b.match || 0) - (a.match || 0));
};
