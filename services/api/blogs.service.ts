import { API_ENDPOINTS } from '@/constants/api';
import {
  Blog,
  BlogDetail,
  BlogsResponse,
  BlogDetailResponse,
  PaginationMeta,
} from '@/types/blog.types';

type FetchBlogsPageParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

type BlogsPageResult = {
  data: Blog[];
  total: number;
  pagination?: PaginationMeta;
};

function getServerFetchUrl(url: string): string {
  if (typeof window === 'undefined') {
    return url.replace('http://localhost:', 'http://127.0.0.1:');
  }
  return url;
}

/**
 * Fetch paginated blogs (card fields only)
 */
export async function fetchBlogsPage(params: FetchBlogsPageParams = {}): Promise<BlogsPageResult> {
  try {
    let url = API_ENDPOINTS.BLOGS;
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);

    const query = searchParams.toString();
    if (query) {
      url += `?${query}`;
    }

    url = getServerFetchUrl(url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { data: [], total: 0 };
    }

    const data: BlogsResponse = await response.json();
    if (!data.success) {
      return { data: [], total: 0 };
    }

    const payload = data.data;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: data.total ?? payload.length,
        pagination: data.pagination,
      };
    }

    return {
      data: payload.items,
      total: payload.totalCount,
      pagination: payload.pagination,
    };
  } catch {
    return { data: [], total: 0 };
  }
}

/**
 * Fetch all blogs
 * @param category - Optional category filter
 */
export async function fetchBlogs(category?: string): Promise<Blog[]> {
  const response = await fetchBlogsPage({ category });
  return response.data;
}

/**
 * Fetch blog by ID
 * @param id - Blog ID
 */
export async function fetchBlogById(id: string | number): Promise<BlogDetail | null> {
  try {
    const url = getServerFetchUrl(API_ENDPOINTS.BLOG_BY_ID(id));

    console.log('[Blog Service] Fetching blog by ID:', id, 'URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Blog Service] Response status:', response.status);

    if (!response.ok) {
      console.error(`[Blog Service] Blog not found. Status: ${response.status}`);
      return null;
    }

    const data: BlogDetailResponse = await response.json();
    
    if (!data.success) {
      console.warn('[Blog Service] API returned success: false', data.error);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('[Blog Service] Error fetching blog by ID:', error);
    return null;
  }
}

/**
 * Create new blog (for future use)
 * @param blogData - Blog data
 */
export async function createBlog(blogData: Partial<Blog>): Promise<Blog> {
  try {
    const url = API_ENDPOINTS.BLOGS;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create blog: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create blog');
    }

    return data.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}
