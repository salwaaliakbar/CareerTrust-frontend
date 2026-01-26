// Admin authentication types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: {
    adminId: number;
    email: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface AdminProfile {
  adminId: number;
  email: string;
  fullName: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalJobseekers: number;
  totalEmployers: number;
  totalJobs: number;
  totalBlogs: number;
  totalCompanies: number;
}

export interface AdminUser {
  userId: number;
  email: string;
  clerkId: string;
  createdAt: string;
  profile: {
    fullName: string | null;
  } | null;
  jobseekerProfile: {
    jobseekerId: number;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    isProfileComplete: boolean;
  } | null;
  employerProfile: {
    employerId: number;
    companyName: string | null;
    companyURL: string | null;
  } | null;
}
