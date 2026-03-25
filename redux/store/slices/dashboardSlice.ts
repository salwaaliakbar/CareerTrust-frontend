import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';
import API_ENDPOINTS from '@/constants/api';
import type { DashboardStats, RecentApplication } from '@/types/dashboard.types';

type OfferResponsePayload = {
  applicationId: number;
  response: 'accept' | 'decline';
};

/**
 * Dashboard Redux Slice
 * Manages dashboard-specific state: stats, recent applications, recommendations
 */

export interface DashboardState {
  stats: DashboardStats | null;
  recentApplications: RecentApplication[];
  loading: boolean;
  error: string | null;
  lastFetchTimeStats: number | null;
  lastFetchTimeApps: number | null;
  isInitialized: boolean;
}

const initialState: DashboardState = {
  stats: null,
  recentApplications: [],
  loading: false,
  error: null,
  lastFetchTimeStats: null,
  lastFetchTimeApps: null,
  isInitialized: false
};

// Cache duration: 5 minutes for stats, 10 minutes for apps
const CACHE_DURATION_STATS = 5 * 60 * 1000;
const CACHE_DURATION_APPS = 10 * 60 * 1000;

/**
 * Thunk: Fetch dashboard statistics
 * Handles caching - only fetches if cache is stale
 */
export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  { clerkId: string; forceRefresh?: boolean },
  { 
    state: RootState;
    rejectValue: string;
  }
>(
  'dashboard/fetchStats',
  async (
    { clerkId, forceRefresh = false },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = (getState() as RootState).dashboard;
      const now = Date.now();

      // Check cache freshness
      if (
        !forceRefresh &&
        state.stats &&
        state.lastFetchTimeStats &&
        now - state.lastFetchTimeStats < CACHE_DURATION_STATS
      ) {
        return state.stats;
      }

      // Fetch from API
      const response = await axios.get(API_ENDPOINTS.DASHBOARD_STATS, {
        params: { clerkId },
        timeout: 5000
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch stats');
      }

      return response.data.data as DashboardStats;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || error.message || 'Failed to fetch dashboard stats'
        );
      }
      return rejectWithValue('Failed to fetch dashboard stats');
    }
  }
);

/**
 * Thunk: Fetch recent applications
 * Handles caching - only fetches if cache is stale
 */
export const fetchRecentApplications = createAsyncThunk<
  RecentApplication[],
  { clerkId: string; limit?: number; forceRefresh?: boolean },
  { 
    state: RootState;
    rejectValue: string;
  }
>(
  'dashboard/fetchRecentApplications',
  async (
    { clerkId, limit = 5, forceRefresh = false },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = (getState() as RootState).dashboard;
      const now = Date.now();

      // Check cache freshness
      if (
        !forceRefresh &&
        state.recentApplications.length > 0 &&
        state.lastFetchTimeApps &&
        now - state.lastFetchTimeApps < CACHE_DURATION_APPS
      ) {
        return state.recentApplications;
      }

      // Fetch from API
      const response = await axios.get(API_ENDPOINTS.DASHBOARD_RECENT_APPLICATIONS, {
        params: { 
          clerkId,
          limit: Math.min(limit, 20)
        },
        timeout: 5000
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch applications');
      }

      // Transform response to match RecentApplication[]
      const apps = response.data.data?.applications || [];
      return apps.map((app: {
        id: string;
        jobId: number;
        jobTitle: string;
        company: string;
        status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
        appliedAt: string;
      }) => ({
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        company: app.company,
        status: app.status,
        appliedDate: new Date(app.appliedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      })) as RecentApplication[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || error.message || 'Failed to fetch recent applications'
        );
      }
      return rejectWithValue('Failed to fetch recent applications');
    }
  }
);

/**
 * Thunk: Initialize dashboard by fetching both stats and recent applications
 * Runs both fetches in parallel for better performance
 */
export const initializeDashboard = createAsyncThunk<
  { stats: DashboardStats; recentApps: RecentApplication[] },
  { clerkId: string; forceRefresh?: boolean },
  { 
    state: RootState;
    rejectValue: string;
  }
>(
  'dashboard/initialize',
  async ({ clerkId, forceRefresh = false }, { dispatch, rejectWithValue }) => {
    try {
      // Fetch both in parallel
      const [statsResult, appsResult] = await Promise.all([
        dispatch(fetchDashboardStats({ clerkId, forceRefresh })),
        dispatch(fetchRecentApplications({ clerkId, limit: 5, forceRefresh }))
      ]);

      if (statsResult.meta.requestStatus === 'rejected' || 
          appsResult.meta.requestStatus === 'rejected') {
        return rejectWithValue('Failed to initialize dashboard');
      }

      return {
        stats: statsResult.payload as DashboardStats,
        recentApps: appsResult.payload as RecentApplication[]
      };
    } catch {
      return rejectWithValue('Failed to initialize dashboard');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /**
     * Manually clear dashboard cache
     */
    clearDashboardCache: (state) => {
      state.lastFetchTimeStats = null;
      state.lastFetchTimeApps = null;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Update stats locally without fetching (for optimistic updates)
     */
    updateStatsOptimistic: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },

    applyOfferResponseOptimistic: (state, action: PayloadAction<OfferResponsePayload>) => {
      const { applicationId, response } = action.payload;

      const targetApp = state.recentApplications.find(
        (app) => String(app.id) === String(applicationId),
      );

      if (response === 'accept') {
        if (state.stats) {
          state.stats.acceptedApplications = Math.max(
            0,
            (state.stats.acceptedApplications ?? 0) + 1,
          );
        }

        // Keep in recent list but reflect latest lifecycle status.
        if (targetApp) {
          targetApp.status = 'offer_accepted';
        }
        return;
      }

      // For declines, keep the card but reflect latest status.
      if (targetApp) {
        targetApp.status = 'offer_declined';
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastFetchTimeStats = Date.now();
        state.isInitialized = true;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stats';
        state.isInitialized = true;
      });

    // Fetch recent applications
    builder
      .addCase(fetchRecentApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.recentApplications = action.payload;
        state.lastFetchTimeApps = Date.now();
        state.isInitialized = true;
      })
      .addCase(fetchRecentApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applications';
        state.isInitialized = true;
      });

    // Initialize dashboard
    builder
      .addCase(initializeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentApplications = action.payload.recentApps;
        state.lastFetchTimeStats = Date.now();
        state.lastFetchTimeApps = Date.now();
        state.isInitialized = true;
      })
      .addCase(initializeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initialize dashboard';
        state.isInitialized = true;
      });
  }
});

export const {
  clearDashboardCache,
  clearError,
  updateStatsOptimistic,
  applyOfferResponseOptimistic,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state: RootState) => state.dashboard.stats;
export const selectRecentApplications = (state: RootState) => state.dashboard.recentApplications;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectDashboardInitialized = (state: RootState) => state.dashboard.isInitialized;

export default dashboardSlice.reducer;
