// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Blogs
  BLOGS: `${API_BASE_URL}/blogs`,
  BLOG_BY_ID: (id: string | number) => `${API_BASE_URL}/blogs/${id}`,
  
  // Jobs
  JOBS: `${API_BASE_URL}/jobs`,
  JOB_BY_ID: (id: string | number) => `${API_BASE_URL}/jobs/${id}`,
  
  // Companies
  COMPANIES: `${API_BASE_URL}/companies`,
  COMPANY_BY_ID: (id: string | number) => `${API_BASE_URL}/companies/${id}`,
  
  // Applications
  APPLICATIONS: `${API_BASE_URL}/applications`,
  APPLICATION_BY_ID: (id: string | number) => `${API_BASE_URL}/applications/${id}`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id: string | number) => `${API_BASE_URL}/users/${id}`,
};

export default API_ENDPOINTS;
