// API base URL configuration
// For Blogs and Jobs, use the backend API URL (Node.js backend on port 4000)
// For other endpoints, use the Next.js API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
const BACKEND_API_URL = `${BACKEND_BASE_URL}/api`;

export const API_ENDPOINTS = {
  // Auth (Next.js API)
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Blogs (Node.js Backend API)
  BLOGS: `${BACKEND_API_URL}/blogs`,
  BLOG_BY_ID: (id: string | number) => `${BACKEND_API_URL}/blogs/${id}`,
  
  // Jobs (Node.js Backend API)
  JOBS: `${BACKEND_API_URL}/jobs`,
  JOB_BY_ID: (id: string | number) => `${BACKEND_API_URL}/jobs/${id}`,
  
  // Companies (Node.js Backend API)
  COMPANIES: `${BACKEND_API_URL}/companies`,
  COMPANY_BY_ID: (id: string | number) => `${BACKEND_API_URL}/companies/${id}`,
  
  // Applications (Next.js API)
  APPLICATIONS: `${API_BASE_URL}/applications`,
  APPLICATION_BY_ID: (id: string | number) => `${API_BASE_URL}/applications/${id}`,
  SUBMIT_APPLICATION: `${API_BASE_URL}/applications/submit`,
  
  // Users (Next.js API)
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id: string | number) => `${API_BASE_URL}/users/${id}`,
  JOBSEEKER_PROFILE_GET: `${BACKEND_API_URL}/jobseeker/profile`,
  JOBSEEKER_PROFILE_SAVE: `${BACKEND_API_URL}/jobseeker/update-profile`,
  RESUME_PARSING: `${BACKEND_API_URL}/resume/parse-resume`,
  JOB_RECOMMENDATION_STATUS: `${BACKEND_API_URL}/jobRecommendation/status`,
  JOB_RECOMMENDATIONS: `${BACKEND_API_URL}/jobRecommendation/recommendations`,
};

export default API_ENDPOINTS;
