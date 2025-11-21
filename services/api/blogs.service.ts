import { API_ENDPOINTS } from '@/constants/api';
import { Blog, BlogDetail, BlogsResponse, BlogDetailResponse } from '@/types/blog.types';

/**
 * Fetch all blogs
 * @param category - Optional category filter
 */
export async function fetchBlogs(category?: string): Promise<Blog[]> {
  try {
    const url = category 
      ? `${API_ENDPOINTS.BLOGS}?category=${encodeURIComponent(category)}`
      : API_ENDPOINTS.BLOGS;

    console.log('[Blog Service] Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Blog Service] Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`[Blog Service] Failed to fetch. Status: ${response.status} ${response.statusText}`);
      // Return empty array if backend is down, don't throw error
      return [];
    }

    const data: BlogsResponse = await response.json();
    
    if (!data.success) {
      console.warn('[Blog Service] API returned success: false', data.error);
      return [];
    }

    console.log('[Blog Service] Successfully fetched blogs:', data.data.length);
    return data.data;
  } catch (error) {
    console.error('[Blog Service] Error fetching blogs:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}

/**
 * Fetch blog by ID
 * @param id - Blog ID
 */
export async function fetchBlogById(id: string | number): Promise<BlogDetail | null> {
  try {
    const url = API_ENDPOINTS.BLOG_BY_ID(id);

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

    console.log('[Blog Service] Successfully fetched blog:', data.data.id);
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
