import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompanies, fetchCompanyById, fetchFeaturedCompanies } from '@/services/api/companies.service';

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompaniesState {
  items: Company[];
  featuredItems: Company[];
  selectedCompany: Company | null;
  companiesById: Record<string | number, Company>; // Cache all visited companies
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;
  lastFetchTimeFeatured: number | null;
  lastFetchTimeById: Record<string | number, number>; // Timestamp for each cached company
}

const initialState: CompaniesState = {
  items: [],
  featuredItems: [],
  selectedCompany: null,
  companiesById: {},
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
export const getAllCompanies = createAsyncThunk<
  Company[],
  { forceRefresh?: boolean } | undefined
>(
  'companies/getAllCompanies',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).companies as CompaniesState;
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

      const companies = await fetchCompanies();
      return companies;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch companies');
    }
  }
);

export const getCompanyById = createAsyncThunk<Company | null, string | number>(
  'companies/getCompanyById',
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).companies as CompaniesState;
      const now = Date.now();
      const lastTime = state.lastFetchTimeById[id];
      const cachedCompany = state.companiesById[id];

      // Return cached data if fresh - store all visited companies
      if (cachedCompany && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedCompany;
      }

      const company = await fetchCompanyById(id);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company');
    }
  }
);

export const getFeaturedCompanies = createAsyncThunk<
  Company[],
  { forceRefresh?: boolean } | undefined
>(
  'companies/getFeaturedCompanies',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).companies as CompaniesState;
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
  },
  extraReducers: (builder) => {
    // Get all companies
    builder
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.totalCount = action.payload.length;
        state.lastFetchTime = Date.now();
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get company by ID
    builder
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action: PayloadAction<Company | null>) => {
        state.loading = false;
        if (action.payload) {
          state.selectedCompany = action.payload;
          state.companiesById[action.payload.id] = action.payload;
          state.lastFetchTimeById[action.payload.id] = Date.now();
        }
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get featured companies
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
  },
});

export const { clearSelectedCompany, clearError } = companiesSlice.actions;
export default companiesSlice.reducer;
