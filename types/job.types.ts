// Job type definitions

export interface Job {
  id: number | string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  experience: string;
  skills: string[];
  postedDate?: string;
  deadline?: string;
  image?: string;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  match?: number;
  postedDaysAgo?: number | string;
  createdAt?: string;
  updatedAt?: string;
  employerId?: string;
  employerName?: string;
  companyId?: number;
  companyLogo?: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface JobsPageResponse {
  success: boolean;
  data: Job[];
  total: number;
  pagination?: PaginationMeta;
  error?: string;
}

export interface JobLocationsResponse {
  success: boolean;
  data: string[];
  total?: number;
  error?: string;
}

export interface JobFormData {
  title: string;
  company?: string; // Optional when editing (read-only)
  location: string;
  salary?: string;
  jobType: string;
  experience: string;
  skills: string;
  description: string;
  deadline?: string;
  image?: string;
  featured?: boolean;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  total: number;
  pagination?: PaginationMeta;
  error?: string;
}

export interface JobDetailResponse {
  success: boolean;
  data: Job;
  error?: string;
}

export interface CreateJobResponse {
  success: boolean;
  data: Job;
  message?: string;
  error?: string;
}
