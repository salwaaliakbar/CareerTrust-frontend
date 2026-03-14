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
  verifiedCompanies?: number;
  unverifiedCompanies?: number;
  activeJobs?: number;
  totalApplications?: number;
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

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  description: string;
  logo: string;
  employees: number;
  rating: number;
  linkedinUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface EmployerData {
  employerId: number;
  userId: number;
  companyName: string | null;
  companyURL: string | null;
  linkedinUrl: string | null;
  hasCompany: boolean;
  createdAt: string;
  user: {
    userId: number;
    email: string;
    clerkId: string;
    createdAt: string;
  };
  company?: Company;
  jobs?: Array<{
    id: number;
    title: string;
    status: string;
  }>;
}

export interface EmployerDetailData extends EmployerData {
  company?: Company & {
    jobs: Array<{
      id: number;
      title: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface CompanyData extends Company {
  employer?: {
    employerId: number;
    companyName: string | null;
    companyURL: string | null;
    linkedinUrl: string | null;
    user: {
      email: string;
    };
  };
  jobs?: Array<{
    id: number;
    title: string;
    status: string;
  }>;
}

export interface CompanyDetailData extends Company {
  employer?: {
    employerId: number;
    companyName: string | null;
    companyURL: string | null;
    linkedinUrl: string | null;
    createdAt: string;
    user: {
      userId: number;
      email: string;
      clerkId: string;
      createdAt: string;
    };
  };
  jobs?: Array<{
    id: number;
    title: string;
    status: string;
    createdAt: string;
    applications: Array<{
      id: number;
      status: string;
    }>;
  }>;
}
