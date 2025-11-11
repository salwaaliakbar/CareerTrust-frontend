import { API_ENDPOINTS } from '@/constants/api';
import { Blog, BlogDetail, BlogsResponse, BlogDetailResponse } from '@/types/blog.types';

// Get the base URL for server-side requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

/**
 * Fetch all blogs
 * @param category - Optional category filter
 */
export async function fetchBlogs(category?: string): Promise<Blog[]> {
  try {
    const baseUrl = getBaseUrl();
    const endpoint = category 
      ? `${API_ENDPOINTS.BLOGS}?category=${encodeURIComponent(category)}`
      : API_ENDPOINTS.BLOGS;
    
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for development
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`);
    }

    const data: BlogsResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch blogs');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Fetch blog by ID
 * @param id - Blog ID
 */
export async function fetchBlogById(id: string | number): Promise<BlogDetail> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${API_ENDPOINTS.BLOG_BY_ID(id)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    const data: BlogDetailResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch blog');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}

/**
 * Create new blog (for future use)
 * @param blogData - Blog data
 */
export async function createBlog(blogData: Partial<Blog>): Promise<Blog> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${API_ENDPOINTS.BLOGS}`;

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
