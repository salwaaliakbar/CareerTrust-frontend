import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJobs, fetchJobById, fetchFeaturedJobs } from '@/services/api/jobs.service';

export interface Job {
  id: number | string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  experience: string;
  skills: string[];
  postedDate?: string;
  deadline?: string;
  image?: string;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  match?: number;
  postedDaysAgo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobsState {
  items: Job[];
  featuredItems: Job[];
  selectedJob: Job | null;
  jobsById: Record<string | number, Job>; // Cache all visited jobs
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;
  lastFetchTimeFeatured: number | null;
  lastFetchTimeById: Record<string | number, number>; // Timestamp for each cached job
}

const initialState: JobsState = {
  items: [],
  featuredItems: [],
  selectedJob: null,
  jobsById: {},
  loading: false,
  error: null,
  totalCount: 0,
  lastFetchTime: null,
  lastFetchTimeFeatured: null,
  lastFetchTimeById: {},
};

// Cache duration: 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

// Async thunks
export const getAllJobs = createAsyncThunk<
  Job[],
  { forceRefresh?: boolean } | undefined
>(
  'jobs/getAllJobs',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).jobs as JobsState;
      const now = Date.now();
      const forceRefresh = typeof args === 'object' && args?.forceRefresh;

      // Return cached data if fresh (unless force refresh)
      if (
        !forceRefresh &&
        state.items.length > 0 &&
        state.lastFetchTime &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        return state.items;
      }

      const jobs = await fetchJobs();
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

export const getJobById = createAsyncThunk<Job | null, string | number>(
  'jobs/getJobById',
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).jobs as JobsState;
      const now = Date.now();
      const lastTime = state.lastFetchTimeById[id];
      const cachedJob = state.jobsById[id];

      // Return cached data if fresh - store all visited jobs
      if (cachedJob && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedJob;
      }

      const job = await fetchJobById(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch job');
    }
  }
);

export const getFeaturedJobs = createAsyncThunk<
  Job[],
  { forceRefresh?: boolean } | undefined
>(
  'jobs/getFeaturedJobs',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).jobs as JobsState;
      const now = Date.now();
      const forceRefresh = typeof args === 'object' && args?.forceRefresh;

      // Return cached data if fresh (unless force refresh)
      if (
        !forceRefresh &&
        state.featuredItems.length > 0 &&
        state.lastFetchTimeFeatured &&
        now - state.lastFetchTimeFeatured < CACHE_DURATION
      ) {
        return state.featuredItems;
      }

      const jobs = await fetchFeaturedJobs();
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured jobs');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all jobs
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.totalCount = action.payload.length;
        state.lastFetchTime = Date.now();
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get job by ID
    builder
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action: PayloadAction<Job | null>) => {
        state.loading = false;
        if (action.payload) {
          state.selectedJob = action.payload;
          state.jobsById[action.payload.id] = action.payload;
          state.lastFetchTimeById[action.payload.id] = Date.now();
        }
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get featured jobs
    builder
      .addCase(getFeaturedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.featuredItems = action.payload;
        state.lastFetchTimeFeatured = Date.now();
      })
      .addCase(getFeaturedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
