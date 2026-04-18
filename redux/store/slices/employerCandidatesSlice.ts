import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Candidate,
  fetchAllCandidates,
} from "@/services/api/employer.service";
import {
  getPublicProfile,
  JobseekerPublicProfile,
} from "@/services/api/profile.service";

type CandidatesQueryArgs = {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  skills?: string;
  forceRefresh?: boolean;
  accessToken?: string | null;
};

type CandidateDetailArgs = {
  clerkId: string;
  forceRefresh?: boolean;
  accessToken?: string | null;
};

type PaginatedCandidatesResult = {
  candidates: Candidate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  queryKey: string;
};

type CandidateDetailResult = {
  clerkId: string;
  profile: JobseekerPublicProfile | null;
};

export interface EmployerCandidatesState {
  items: Candidate[];
  detailsByClerkId: Record<string, JobseekerPublicProfile>;
  loading: boolean;
  detailLoadingByClerkId: Record<string, boolean>;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  lastFetchTime: number | null;
  lastFetchKey: string | null;
  pendingListQueryKey: string | null;
  lastFetchTimeByClerkId: Record<string, number>;
  pendingDetailByClerkId: Record<string, boolean>;
}

const initialState: EmployerCandidatesState = {
  items: [],
  detailsByClerkId: {},
  loading: false,
  detailLoadingByClerkId: {},
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  lastFetchTime: null,
  lastFetchKey: null,
  pendingListQueryKey: null,
  lastFetchTimeByClerkId: {},
  pendingDetailByClerkId: {},
};

const CACHE_DURATION = 5 * 60 * 1000;
const DETAIL_CACHE_DURATION = 10 * 60 * 1000;

const buildCandidatesQueryKey = (args?: CandidatesQueryArgs) =>
  JSON.stringify({
    page: args?.page ?? 1,
    limit: args?.limit ?? 12,
    search: args?.search || "",
    location: args?.location || "",
    skills: args?.skills || "",
  });

type EmployerCandidatesSliceState = {
  employerCandidates: EmployerCandidatesState;
};

export const getEmployerCandidates = createAsyncThunk<
  PaginatedCandidatesResult,
  CandidatesQueryArgs | undefined
>(
  "employerCandidates/getEmployerCandidates",
  async (args: CandidatesQueryArgs | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as EmployerCandidatesSliceState).employerCandidates;
      const now = Date.now();
      const queryKey = buildCandidatesQueryKey(args);
      const forceRefresh = Boolean(args.forceRefresh);

      if (
        !forceRefresh &&
        state.lastFetchKey === queryKey &&
        state.lastFetchTime &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        return {
          candidates: state.items,
          pagination: {
            total: state.totalCount,
            page: state.currentPage,
            limit: state.pageSize,
            totalPages: state.totalPages,
          },
          queryKey,
        };
      }

      const result = await fetchAllCandidates(
        {
          page: args.page,
          limit: args.limit,
          search: args.search,
          location: args.location,
          skills: args.skills,
        },
        args.accessToken ? async () => args.accessToken || null : undefined,
      );

      if (!result) {
        return {
          candidates: [],
          pagination: {
            total: 0,
            page: args.page ?? 1,
            limit: args.limit ?? 12,
            totalPages: 1,
          },
          queryKey,
        };
      }

      return {
        candidates: result.candidates,
        pagination: result.pagination,
        queryKey,
      };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch candidates",
      );
    }
  },
  {
    condition: (args: CandidatesQueryArgs | undefined = {}, { getState }) => {
      const state = (getState() as EmployerCandidatesSliceState).employerCandidates;
      const queryKey = buildCandidatesQueryKey(args);
      const forceRefresh = Boolean(args.forceRefresh);

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

export const getEmployerCandidateDetail = createAsyncThunk<
  CandidateDetailResult,
  CandidateDetailArgs
>(
  "employerCandidates/getEmployerCandidateDetail",
  async ({ clerkId, accessToken }, { rejectWithValue }) => {
    try {
      const profile = await getPublicProfile(
        clerkId,
        accessToken ? async () => accessToken || null : undefined,
      );

      return {
        clerkId,
        profile,
      };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch candidate profile",
      );
    }
  },
  {
    condition: ({ clerkId, forceRefresh }, { getState }) => {
      const state = (getState() as EmployerCandidatesSliceState).employerCandidates;

      if (state.pendingDetailByClerkId[clerkId]) {
        return false;
      }

      const cached = state.detailsByClerkId[clerkId];
      const lastFetchTime = state.lastFetchTimeByClerkId[clerkId];

      if (
        !forceRefresh &&
        cached &&
        lastFetchTime &&
        Date.now() - lastFetchTime < DETAIL_CACHE_DURATION
      ) {
        return false;
      }

      return true;
    },
  },
);

const employerCandidatesSlice = createSlice({
  name: "employerCandidates",
  initialState,
  reducers: {
    clearEmployerCandidatesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployerCandidates.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingListQueryKey = buildCandidatesQueryKey(action.meta.arg);
      })
      .addCase(getEmployerCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.candidates;
        state.totalCount = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.page;
        state.pageSize = action.payload.pagination.limit;
        state.totalPages = action.payload.pagination.totalPages;
        state.lastFetchTime = Date.now();
        state.lastFetchKey = action.payload.queryKey;
        state.pendingListQueryKey = null;
      })
      .addCase(getEmployerCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pendingListQueryKey = null;
      });

    builder
      .addCase(getEmployerCandidateDetail.pending, (state, action) => {
        const clerkId = action.meta.arg.clerkId;
        state.pendingDetailByClerkId[clerkId] = true;
        state.detailLoadingByClerkId[clerkId] = true;
      })
      .addCase(getEmployerCandidateDetail.fulfilled, (state, action) => {
        const { clerkId, profile } = action.payload;
        if (profile) {
          state.detailsByClerkId[clerkId] = profile;
          state.lastFetchTimeByClerkId[clerkId] = Date.now();
        }

        delete state.pendingDetailByClerkId[clerkId];
        delete state.detailLoadingByClerkId[clerkId];
      })
      .addCase(getEmployerCandidateDetail.rejected, (state, action) => {
        const clerkId = action.meta.arg.clerkId;
        delete state.pendingDetailByClerkId[clerkId];
        delete state.detailLoadingByClerkId[clerkId];
      });
  },
});

export const { clearEmployerCandidatesError } = employerCandidatesSlice.actions;
export default employerCandidatesSlice.reducer;
