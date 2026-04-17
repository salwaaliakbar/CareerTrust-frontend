import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBlogsPage, fetchBlogById } from '@/services/api/blogs.service';
import { Blog, BlogDetail, PaginationMeta } from '@/types/blog.types';

export interface BlogsState {
  items: Blog[];
  selectedBlog: BlogDetail | null;
  blogsById: Record<string | number, BlogDetail>;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  lastFetchTime: number | null;
  lastFetchTimeById: Record<string | number, number>;
  lastFetchKey: string | null;
  pendingListQueryKey: string | null;
  pendingBlogById: Record<string, boolean>;
}

const initialState: BlogsState = {
  items: [],
  selectedBlog: null,
  blogsById: {},
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  lastFetchTime: null,
  lastFetchTimeById: {},
  lastFetchKey: null,
  pendingListQueryKey: null,
  pendingBlogById: {},
};

const CACHE_DURATION = 10 * 60 * 1000;

type BlogsQueryArgs = {
  forceRefresh?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

type PaginatedBlogsResult = {
  blogs: Blog[];
  pagination: PaginationMeta;
  totalCount: number;
  queryKey: string;
};

type BlogsSliceState = {
  blogs: BlogsState;
};

const buildBlogsQueryKey = (args?: BlogsQueryArgs) =>
  JSON.stringify({
    page: args?.page ?? 1,
    limit: args?.limit ?? 12,
    search: args?.search || '',
    category: args?.category || '',
  });

export const getAllBlogs = createAsyncThunk<
  PaginatedBlogsResult,
  BlogsQueryArgs | undefined
>(
  'blogs/getAllBlogs',
  async (args: BlogsQueryArgs | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as BlogsSliceState).blogs;
      const now = Date.now();
      const forceRefresh = Boolean(args?.forceRefresh);
      const queryKey = buildBlogsQueryKey(args);

      if (
        !forceRefresh &&
        state.lastFetchKey === queryKey &&
        state.lastFetchTime &&
        now - state.lastFetchTime < CACHE_DURATION
      ) {
        return {
          blogs: state.items,
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
        };
      }

      const response = await fetchBlogsPage({
        page: args?.page,
        limit: args?.limit,
        search: args?.search,
        category: args?.category,
      });

      const pagination = response.pagination || {
        currentPage: args?.page ?? 1,
        pageSize: args?.limit ?? 12,
        totalCount: response.total,
        totalPages: Math.max(1, Math.ceil(response.total / (args?.limit ?? 12))),
      };

      return {
        blogs: response.data,
        pagination,
        totalCount: response.total,
        queryKey,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blogs');
    }
  },
  {
    condition: (args: BlogsQueryArgs | undefined = {}, { getState }) => {
      const state = (getState() as BlogsSliceState).blogs;
      const forceRefresh = Boolean(args?.forceRefresh);
      const queryKey = buildBlogsQueryKey(args);

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

export const getBlogById = createAsyncThunk<BlogDetail | null, string | number>(
  'blogs/getBlogById',
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as BlogsSliceState).blogs;
      const now = Date.now();
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedBlog = state.blogsById[cacheKey];

      if (cachedBlog && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedBlog;
      }

      const blog = await fetchBlogById(id);
      return blog;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blog');
    }
  },
  {
    condition: (id: string | number, { getState }) => {
      const state = (getState() as BlogsSliceState).blogs;
      const cacheKey = String(id);
      const lastTime = state.lastFetchTimeById[cacheKey];
      const cachedBlog = state.blogsById[cacheKey];

      if (state.pendingBlogById[cacheKey]) {
        return false;
      }

      if (cachedBlog && lastTime && Date.now() - lastTime < CACHE_DURATION) {
        return false;
      }

      return true;
    },
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingListQueryKey = buildBlogsQueryKey(action.meta.arg);
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.blogs;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.pagination.currentPage;
        state.pageSize = action.payload.pagination.pageSize;
        state.totalPages = action.payload.pagination.totalPages;
        state.lastFetchTime = Date.now();
        state.lastFetchKey = action.payload.queryKey;
        state.pendingListQueryKey = null;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pendingListQueryKey = null;
      });

    builder
      .addCase(getBlogById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pendingBlogById[String(action.meta.arg)] = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedBlog = action.payload;
          const cacheKey = String(action.payload.id);
          state.blogsById[cacheKey] = action.payload;
          state.lastFetchTimeById[cacheKey] = Date.now();
        }
        delete state.pendingBlogById[String(action.meta.arg)];
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        delete state.pendingBlogById[String(action.meta.arg)];
      });
  },
});

export const { clearSelectedBlog, clearError } = blogsSlice.actions;
export default blogsSlice.reducer;
