import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCompaniesPage,
  fetchCompanyById,
  fetchFeaturedCompanies,
} from '@/services/api/companies.service';
import {
  fetchCompanyReputation,
  fetchCompanyReputations,
  type CompanyReputation,
} from '@/services/api/reputation.service';

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  rating?: number;
  reviews?: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
  reputationScore?: number;
}

export interface CompaniesState {
  items: Company[];
  featuredItems: Company[];
  selectedCompany: Company | null;
  companiesById: Record<string | number, Company>;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  lastFetchTime: number | null;
  lastFetchTimeFeatured: number | null;
  lastFetchTimeById: Record<string | number, number>;
  lastFetchContext: "anonymous" | "personalized" | null;
  lastFetchKey: string | null;
  pendingListQueryKey: string | null;
  pendingCompanyById: Record<string, boolean>;
  reputationById: Record<string, CompanyReputation>;
  lastFetchTimeReputationById: Record<string, number>;
  pendingReputationById: Record<string, boolean>;
  pendingReputationListKey: string | null;
}

const initialState: CompaniesState = {
  items: [],
  featuredItems: [],
  selectedCompany: null,
  companiesById: {},
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  lastFetchTime: null,
  lastFetchTimeFeatured: null,
  lastFetchTimeById: {},
  lastFetchContext: null,
  lastFetchKey: null,
  pendingListQueryKey: null,
  pendingCompanyById: {},
  reputationById: {},
  lastFetchTimeReputationById: {},
  pendingReputationById: {},
  pendingReputationListKey: null,
};

const CACHE_DURATION = 10 * 60 * 1000;
const DEFAULT_COMPANIES_PAGE_SIZE = 12;
const REPUTATION_CACHE_DURATION = 10 * 60 * 1000;

type CompaniesQueryArgs = {
  forceRefresh?: boolean;
  clerkId?: string;
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  featured?: boolean;
};

type PaginatedCompaniesResult = {
  companies: Company[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  totalCount: number;
  context: 'anonymous' | 'personalized';
  queryKey: string;
};

type CompaniesSliceState = {
  companies: CompaniesState;
};

type BulkReputationResult = {
  reputationById: Record<string, CompanyReputation>;
  requestedIds: string[];
  requestKey: string;
};

const buildReputationListKey = (ids: Array<string | number>) =>
  Array.from(new Set(ids.map((id) => String(id)).filter(Boolean))).sort().join(',');

const buildCompaniesQueryKey = (args?: CompaniesQueryArgs) =>
  JSON.stringify({
    page: args?.page ?? 1,
    limit: args?.limit ?? DEFAULT_COMPANIES_PAGE_SIZE,
    search: args?.search || '',
    industry: args?.industry || '',
    featured: typeof args?.featured === 'boolean' ? args.featured : null,
    clerkId: args?.clerkId || '',
  });

// Async thunks
export const getAllCompanies = createAsyncThunk<
  PaginatedCompaniesResult,
  CompaniesQueryArgs | undefined
>(
  'companies/getAllCompanies',
  async (
    args: CompaniesQueryArgs | undefined = {},
    { getState, rejectWithValue },
  ) => {
    try {
      const state = (getState() as CompaniesSliceState).companies;
      const now = Date.now();
      const forceRefresh = Boolean(args?.forceRefresh);
      const requestContext = args?.clerkId ? 'personalized' : 'anonymous';
      const queryKey = buildCompaniesQueryKey(args);
      const effectiveLimit = args?.limit ?? DEFAULT_COMPANIES_PAGE_SIZE;

      if (
        !forceRefresh &&
        state.lastFetchKey === queryKey &&
        state.lastFetchTime &&
        state.lastFetchContext === requestContext &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        return {
          companies: state.items,
          pagination: {
            currentPage: state.currentPage,
            pageSize: state.pageSize,
            totalCount: state.totalCount,
            totalPages: state.totalPages,
            hasNextPage: state.currentPage < state.totalPages,
            hasPreviousPage: state.currentPage > 1,
          },
          totalCount: state.totalCount,
          context: requestContext,
          queryKey,
        };
      }

      const response = await fetchCompaniesPage({
        page: args?.page,
        limit: effectiveLimit,
        search: args?.search,
        industry: args?.industry,
        featured: args?.featured,
      });

      const pagination = response.pagination || {
        currentPage: args?.page ?? 1,
        pageSize: effectiveLimit,
        totalCount: response.total,
        totalPages: Math.max(1, Math.ceil(response.total / effectiveLimit)),
      };

      return {
        companies: response.data,
        pagination,
        totalCount: response.total,
        context: requestContext,
        queryKey,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch companies');
    }
  },
  {
    condition: (args: CompaniesQueryArgs | undefined = {}, { getState }) => {
      const state = (getState() as CompaniesSliceState).companies;
      const forceRefresh = Boolean(args?.forceRefresh);
      const queryKey = buildCompaniesQueryKey(args);

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
  }
);

export const getCompanyById = createAsyncThunk<Company | null, string | number>(
  'companies/getCompanyById',
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as CompaniesSliceState).companies;
      const now = Date.now();
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedCompany = state.companiesById[cacheKey];

      if (cachedCompany && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedCompany;
      }

      const company = await fetchCompanyById(id);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company');
    }
  },
  {
    condition: (id: string | number, { getState }) => {
      const state = (getState() as CompaniesSliceState).companies;
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedCompany = state.companiesById[cacheKey];

      if (state.pendingCompanyById[cacheKey]) {
        return false;
      }

      if (cachedCompany && lastTime && Date.now() - lastTime < CACHE_DURATION) {
        return false;
      }

      return true;
    },
  }
);

export const getFeaturedCompanies = createAsyncThunk<
  Company[],
  { forceRefresh?: boolean } | undefined
>(
  'companies/getFeaturedCompanies',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as CompaniesSliceState).companies;
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

      const companies = await fetchFeaturedCompanies();
      return companies;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured companies');
    }
  }
);

export const getCompanyReputationById = createAsyncThunk<
  { companyId: string; reputation: CompanyReputation | null },
  string | number
>(
  'companies/getCompanyReputationById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as CompaniesSliceState).companies;
      const companyId = String(id);
      const numericCompanyId = Number.parseInt(companyId, 10);

      if (!Number.isInteger(numericCompanyId) || numericCompanyId <= 0) {
        return { companyId, reputation: null };
      }

      const cached = state.reputationById[companyId];
      const lastFetchTime = state.lastFetchTimeReputationById[companyId];
      if (
        cached &&
        lastFetchTime &&
        Date.now() - lastFetchTime < REPUTATION_CACHE_DURATION
      ) {
        return { companyId, reputation: cached };
      }

      const reputation = await fetchCompanyReputation(numericCompanyId);
      return { companyId, reputation };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company reputation');
    }
  },
  {
    condition: (id, { getState }) => {
      const state = (getState() as CompaniesSliceState).companies;
      const companyId = String(id);
      const cached = state.reputationById[companyId];
      const lastFetchTime = state.lastFetchTimeReputationById[companyId];

      if (state.pendingReputationById[companyId]) {
        return false;
      }

      if (
        cached &&
        lastFetchTime &&
        Date.now() - lastFetchTime < REPUTATION_CACHE_DURATION
      ) {
        return false;
      }

      return true;
    },
  },
);

export const getCompanyReputations = createAsyncThunk<BulkReputationResult, Array<string | number>>(
  'companies/getCompanyReputations',
  async (ids, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as CompaniesSliceState).companies;
      const requestKey = buildReputationListKey(ids);
      const requestedIds = requestKey ? requestKey.split(',') : [];

      const freshIds = requestedIds.filter((id) => {
        const cached = state.reputationById[id];
        const lastFetchTime = state.lastFetchTimeReputationById[id];
        return (
          cached &&
          lastFetchTime &&
          Date.now() - lastFetchTime < REPUTATION_CACHE_DURATION
        );
      });

      const idsToFetch = requestedIds
        .filter((id) => !freshIds.includes(id))
        .map((id) => Number.parseInt(id, 10))
        .filter((id) => Number.isInteger(id) && id > 0);

      if (idsToFetch.length === 0) {
        return {
          reputationById: {},
          requestedIds,
          requestKey,
        };
      }

      const reputationById = await fetchCompanyReputations(idsToFetch);
      return {
        reputationById,
        requestedIds,
        requestKey,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company reputations');
    }
  },
  {
    condition: (ids, { getState }) => {
      const state = (getState() as CompaniesSliceState).companies;
      const requestKey = buildReputationListKey(ids);
      if (!requestKey) {
        return false;
      }

      if (state.pendingReputationListKey === requestKey) {
        return false;
      }

      return true;
    },
  },
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    stripPersonalizedCompanyData: (state) => {
      state.items = state.items.map((company) => ({
        ...company,
        reputationScore: undefined,
      }));

      state.featuredItems = state.featuredItems.map((company) => ({
        ...company,
        reputationScore: undefined,
      }));

      const normalizedById: Record<string | number, Company> = {};
      Object.entries(state.companiesById).forEach(([id, company]) => {
        normalizedById[id] = {
          ...company,
          reputationScore: undefined,
        };
      });
      state.companiesById = normalizedById;

      if (state.selectedCompany) {
        state.selectedCompany = {
          ...state.selectedCompany,
          reputationScore: undefined,
        };
      }

      state.lastFetchContext = 'anonymous';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompanies.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingListQueryKey = buildCompaniesQueryKey(action.meta.arg);
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.companies;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.pagination.currentPage;
        state.pageSize = action.payload.pagination.pageSize;
        state.totalPages = action.payload.pagination.totalPages;
        state.lastFetchTime = Date.now();
        state.lastFetchContext = action.payload.context;
        state.lastFetchKey = action.payload.queryKey;
        state.pendingListQueryKey = null;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pendingListQueryKey = null;
      });

    builder
      .addCase(getCompanyById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingCompanyById[String(action.meta.arg)] = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedCompany = action.payload;
          const cacheKey = String(action.payload.id);
          state.companiesById[cacheKey] = action.payload;
          state.lastFetchTimeById[cacheKey] = Date.now();
        }
        delete state.pendingCompanyById[String(action.meta.arg)];
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        delete state.pendingCompanyById[String(action.meta.arg)];
      });

    builder
      .addCase(getFeaturedCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.loading = false;
        state.featuredItems = action.payload;
        state.lastFetchTimeFeatured = Date.now();
      })
      .addCase(getFeaturedCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getCompanyReputationById.pending, (state, action) => {
        const companyId = String(action.meta.arg);
        state.pendingReputationById[companyId] = true;
      })
      .addCase(getCompanyReputationById.fulfilled, (state, action) => {
        const { companyId, reputation } = action.payload;
        if (reputation) {
          state.reputationById[companyId] = reputation;
          state.lastFetchTimeReputationById[companyId] = Date.now();
        }
        delete state.pendingReputationById[companyId];
      })
      .addCase(getCompanyReputationById.rejected, (state, action) => {
        const companyId = String(action.meta.arg);
        delete state.pendingReputationById[companyId];
      });

    builder
      .addCase(getCompanyReputations.pending, (state, action) => {
        state.pendingReputationListKey = buildReputationListKey(action.meta.arg);
      })
      .addCase(getCompanyReputations.fulfilled, (state, action) => {
        const entries = Object.entries(action.payload.reputationById);
        for (const [companyId, reputation] of entries) {
          state.reputationById[companyId] = reputation;
          state.lastFetchTimeReputationById[companyId] = Date.now();
        }
        state.pendingReputationListKey = null;
      })
      .addCase(getCompanyReputations.rejected, (state) => {
        state.pendingReputationListKey = null;
      });
  },
});

export const { clearSelectedCompany, clearError, stripPersonalizedCompanyData } = companiesSlice.actions;
export default companiesSlice.reducer;
