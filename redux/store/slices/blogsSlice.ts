import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchBlogs, fetchBlogById } from '@/services/api/blogs.service';
import { Blog, BlogDetail } from '@/types/blog.types';

export interface BlogsState {
  items: Blog[];
  selectedBlog: BlogDetail | null;
  blogsById: Record<string | number, BlogDetail>; // Cache all visited blogs
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;
  lastFetchTimeById: Record<string | number, number>; // Timestamp for each cached blog
}

const initialState: BlogsState = {
  items: [],
  selectedBlog: null,
  blogsById: {},
  loading: false,
  error: null,
  totalCount: 0,
  lastFetchTime: null,
  lastFetchTimeById: {},
};

// Cache duration: 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

// Async thunks
export const getAllBlogs = createAsyncThunk<
  Blog[],
  { forceRefresh?: boolean } | undefined
>(
  'blogs/getAllBlogs',
  async (args: { forceRefresh?: boolean } | undefined = {}, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).blogs as BlogsState;
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

      const blogs = await fetchBlogs();
      return blogs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blogs');
    }
  }
);

export const getBlogById = createAsyncThunk<BlogDetail | null, string | number>(
  'blogs/getBlogById',
  async (id: string | number, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).blogs as BlogsState;
      const now = Date.now();
      const lastTime = state.lastFetchTimeById[id];
      const cachedBlog = state.blogsById[id];

      // Return cached data if fresh - store all visited blogs
      if (cachedBlog && lastTime && now - lastTime < CACHE_DURATION) {
        return cachedBlog;
      }

      const blog = await fetchBlogById(id);
      return blog;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch blog');
    }
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
    // Get all blogs
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.totalCount = action.payload.length;
        state.lastFetchTime = Date.now();
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get blog by ID
    builder
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action: PayloadAction<BlogDetail | null>) => {
        state.loading = false;
        if (action.payload) {
          state.selectedBlog = action.payload;
          state.blogsById[action.payload.id] = action.payload;
          state.lastFetchTimeById[action.payload.id] = Date.now();
        }
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBlog, clearError } = blogsSlice.actions;
export default blogsSlice.reducer;
