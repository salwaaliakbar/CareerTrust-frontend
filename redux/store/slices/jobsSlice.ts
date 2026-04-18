import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchFeaturedJobs,
  fetchJobById,
  fetchJobLocations,
  fetchJobsPage,
} from "@/services/api/jobs.service";

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
  responsibilities?: string[];
  postedDate?: string;
  deadline?: string;
  image?: string;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  match?: number;
  status?: string;
  postedDaysAgo?: number | string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: number;
  companyLogo?: string;
  matchPercentage?: number;
}

export interface JobsState {
  items: Job[];
  featuredItems: Job[];
  locations: string[];
  selectedJob: Job | null;
  jobsById: Record<string | number, Job>;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  lastFetchTime: number | null;
  lastFetchTimeFeatured: number | null;
  lastFetchTimeLocations: number | null;
  lastFetchTimeById: Record<string | number, number>;
  lastFetchContext: "anonymous" | "personalized" | null;
  lastFetchKey: string | null;
  pendingListQueryKey: string | null;
  pendingJobById: Record<string, boolean>;
}

const initialState: JobsState = {
  items: [],
  featuredItems: [],
  locations: [],
  selectedJob: null,
  jobsById: {},
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  lastFetchTime: null,
  lastFetchTimeFeatured: null,
  lastFetchTimeLocations: null,
  lastFetchTimeById: {},
  lastFetchContext: null,
  lastFetchKey: null,
  pendingListQueryKey: null,
  pendingJobById: {},
};

const CACHE_DURATION = 10 * 60 * 1000;

type JobsQueryArgs = {
  forceRefresh?: boolean;
  clerkId?: string;
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  jobType?: string;
  featured?: boolean;
  companyId?: number;
};

type PaginatedJobsResult = {
  jobs: Job[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  totalCount: number;
  queryKey: string;
  context: "anonymous" | "personalized";
};

type JobsSliceState = {
  jobs: JobsState;
};

const buildJobsQueryKey = (args?: JobsQueryArgs) =>
  JSON.stringify({
    clerkId: args?.clerkId || "",
    page: args?.page ?? 1,
    limit: args?.limit ?? 12,
    search: args?.search || "",
    location: args?.location || "",
    jobType: args?.jobType || "",
    featured: typeof args?.featured === "boolean" ? args.featured : null,
    companyId: args?.companyId ?? null,
  });

const normalizeJobs = (jobs: Job[]) =>
  jobs.map((job) => ({
    ...job,
    match: typeof job.match === "number" ? job.match : 0,
    matchPercentage:
      typeof job.matchPercentage === "number"
        ? job.matchPercentage
        : typeof job.match === "number"
          ? job.match
          : 0,
  }));

export const getAllJobs = createAsyncThunk<PaginatedJobsResult, JobsQueryArgs | undefined>(
  "jobs/getAllJobs",
  async (args: JobsQueryArgs | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as JobsSliceState).jobs;
      const now = Date.now();
      const forceRefresh = Boolean(args?.forceRefresh);
      const clerkId = args?.clerkId;
      const queryKey = buildJobsQueryKey(args);
      const context = clerkId ? "personalized" : "anonymous";

      if (
        !forceRefresh &&
        state.lastFetchKey === queryKey &&
        state.lastFetchTime &&
        state.lastFetchContext === context &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        return {
          jobs: state.items,
          pagination: {
            currentPage: state.currentPage,
            pageSize: state.pageSize,
            totalCount: state.totalCount,
            totalPages: state.totalPages,
            hasNextPage: state.currentPage < state.totalPages,
            hasPreviousPage: state.currentPage > 1,
          },
          totalCount: state.totalCount,
          queryKey,
          context,
        };
      }

      const baseParams = {
        page: args?.page,
        limit: args?.limit,
        search: args?.search,
        location: args?.location,
        jobType: args?.jobType,
        featured: args?.featured,
        companyId: args?.companyId,
      };

      let response = await fetchJobsPage(
        clerkId ? { ...baseParams, clerkId } : baseParams,
      );

      if (clerkId && response.data.length === 0) {
        response = await fetchJobsPage(baseParams);
      }

      const pagination = response.pagination || {
        currentPage: args?.page ?? 1,
        pageSize: args?.limit ?? 12,
        totalCount: response.total,
        totalPages: Math.max(1, Math.ceil(response.total / (args?.limit ?? 12))),
      };

      return {
        jobs: normalizeJobs(response.data || []),
        pagination,
        totalCount: response.total,
        queryKey,
        context: clerkId ? "personalized" : "anonymous",
      };
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch jobs");
    }
  },
  {
    condition: (args: JobsQueryArgs | undefined = {}, { getState }) => {
      const state = (getState() as JobsSliceState).jobs;
      const queryKey = buildJobsQueryKey(args);
      const forceRefresh = Boolean(args?.forceRefresh);

      if (state.pendingListQueryKey === queryKey) {
        return false;
      }

      if (
        !forceRefresh &&
        state.lastFetchKey === queryKey &&
        state.lastFetchTime &&
        Date.now() - state.lastFetchTime < CACHE_DURATION
      ) {
        return false;
      }

      return true;
    },
  },
);

export const getJobLocations = createAsyncThunk<string[]>(
  "jobs/getJobLocations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as JobsSliceState).jobs;
      const now = Date.now();

      if (
        state.locations.length > 0 &&
        state.lastFetchTimeLocations &&
        now - state.lastFetchTimeLocations < CACHE_DURATION
      ) {
        return state.locations;
      }

      return await fetchJobLocations();
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch job locations",
      );
    }
  },
);

export const getJobById = createAsyncThunk<Job | null, string | number>(
  "jobs/getJobById",
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as JobsSliceState).jobs;
      const now = Date.now();
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedJob = state.jobsById[cacheKey];

      if (cachedJob && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedJob;
      }

      const job = await fetchJobById(id);
      return job;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch job");
    }
  },
  {
    condition: (id: string | number, { getState }) => {
      const state = (getState() as JobsSliceState).jobs;
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedJob = state.jobsById[cacheKey];

      if (state.pendingJobById[cacheKey]) {
        return false;
      }

      if (cachedJob && lastTime && Date.now() - lastTime < CACHE_DURATION) {
        return false;
      }

      return true;
    },
  },
);

export const getFeaturedJobs = createAsyncThunk<
  Job[],
  { forceRefresh?: boolean } | undefined
>(
  "jobs/getFeaturedJobs",
  async (
    args: { forceRefresh?: boolean } | undefined = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const state = (getState() as JobsSliceState).jobs;
      const now = Date.now();
      const forceRefresh = typeof args === "object" && args?.forceRefresh;

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
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch featured jobs",
      );
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    stripPersonalizedJobData: (state) => {
      state.items = state.items.map((job) => ({ ...job, match: 0, matchPercentage: 0 }));
      state.featuredItems = state.featuredItems.map((job) => ({ ...job, match: 0, matchPercentage: 0 }));

      const normalizedById: Record<string | number, Job> = {};
      Object.entries(state.jobsById).forEach(([id, job]) => {
        normalizedById[id] = { ...job, match: 0, matchPercentage: 0 };
      });
      state.jobsById = normalizedById;

      if (state.selectedJob) {
        state.selectedJob = { ...state.selectedJob, match: 0, matchPercentage: 0 };
      }

      state.lastFetchContext = "anonymous";
    },
    updateJobMatches: (
      state,
      action: PayloadAction<
        Array<{
          id: string | number;
          matchPercentage?: number;
          match?: number;
          [key: string]: unknown;
        }>
      >,
    ) => {
      const updates = action.payload;
      updates.forEach((update) => {
        const { id, matchPercentage, match, ...otherFields } = update;

        const normalizedMatch =
          typeof matchPercentage === "number"
            ? matchPercentage
            : typeof match === "number"
              ? match
              : undefined;

        const itemJob = state.items.find((j) => j.id === id);
        if (itemJob) {
          if (typeof normalizedMatch === "number") {
            itemJob.matchPercentage = normalizedMatch;
            itemJob.match = normalizedMatch;
          }
          Object.assign(itemJob, otherFields);
        } else if (Object.keys(otherFields).length > 0) {
          state.items.push({
            id,
            title: otherFields.title || "New Job",
            description: otherFields.description || "",
            company: otherFields.company || "",
            location: otherFields.location || "",
            jobType: otherFields.jobType || "",
            experience: otherFields.experience || "",
            skills: otherFields.skills || [],
            matchPercentage: normalizedMatch || 0,
            match: normalizedMatch || 0,
            ...otherFields,
          } as Job);
        }

        if (state.jobsById[id]) {
          if (typeof normalizedMatch === "number") {
            state.jobsById[id].matchPercentage = normalizedMatch;
            state.jobsById[id].match = normalizedMatch;
          }
          Object.assign(state.jobsById[id], otherFields);
        } else if (Object.keys(otherFields).length > 0) {
          state.jobsById[id] = {
            id,
            title: otherFields.title || "New Job",
            description: otherFields.description || "",
            company: otherFields.company || "",
            location: otherFields.location || "",
            jobType: otherFields.jobType || "",
            experience: otherFields.experience || "",
            skills: otherFields.skills || [],
            matchPercentage: normalizedMatch || 0,
            match: normalizedMatch || 0,
            ...otherFields,
          } as Job;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingListQueryKey = buildJobsQueryKey(action.meta.arg);
      })
      .addCase(
        getAllJobs.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload.jobs;
          state.totalCount = action.payload.totalCount;
          state.currentPage = action.payload.pagination?.currentPage ?? 1;
          state.pageSize = action.payload.pagination?.pageSize ?? 12;
          state.totalPages = action.payload.pagination?.totalPages ?? 1;
          state.lastFetchTime = Date.now();
          state.lastFetchContext = action.payload.context;
          state.lastFetchKey = action.payload.queryKey;
          state.pendingListQueryKey = null;
        },
      )
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pendingListQueryKey = null;
      });

    builder
      .addCase(getJobLocations.pending, (state) => {
        state.error = null;
      })
      .addCase(getJobLocations.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.locations = action.payload;
        state.lastFetchTimeLocations = Date.now();
      })
      .addCase(getJobLocations.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(getJobById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingJobById[String(action.meta.arg)] = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        const requestedId = String(action.meta.arg);
        delete state.pendingJobById[requestedId];
        if (action.payload) {
          const job = {
            ...action.payload,
            match:
              typeof action.payload.match === "number"
                ? action.payload.match
                : 0,
          };
          state.selectedJob = job;
          const payloadKey = String(job.id);
          state.jobsById[payloadKey] = job;
          state.lastFetchTimeById[payloadKey] = Date.now();
        }
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        delete state.pendingJobById[String(action.meta.arg)];
      });

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

export const {
  clearSelectedJob,
  clearError,
  updateJobMatches,
  stripPersonalizedJobData,
} = jobsSlice.actions;

export default jobsSlice.reducer;
