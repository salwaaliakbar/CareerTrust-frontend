import { 
  DashboardStats, 
  AdminUser, 
  EmployerData, 
  EmployerDetailData,
  CompanyData,
  CompanyDetailData
} from "@/types/admin.types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Admin API Service
 * Centralized service for all admin-related API calls
 */
export class AdminService {
  /**
   * Make an authenticated API call
   */
  private static async apiCall<T>(
    endpoint: string,
    token: string | null,
    options?: RequestInit
  ): Promise<T> {
    if (!token) {
      throw new Error("Authentication token required");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Dashboard APIs
   */
  static async getDashboardStats(token: string | null) {
    return this.apiCall<{ data: { stats: DashboardStats; recentUsers: any[]; recentJobs: any[]; recentCompanies: any[] } }>(
      "/api/admin/dashboard/stats",
      token
    );
  }

  /**
   * User Management APIs
   */
  static async getAllUsers(token: string | null, params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    return this.apiCall<{ data: { users: AdminUser[]; pagination: any } }>(
      `/api/admin/users?${queryParams}`,
      token
    );
  }

  static async getUserById(token: string | null, userId: number) {
    return this.apiCall<{ data: AdminUser }>(
      `/api/admin/users/${userId}`,
      token
    );
  }

  /**
   * Jobseeker Management APIs
   */
  static async getAllJobseekers(token: string | null, params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    return this.apiCall<{ data: { jobseekers: any[]; pagination: any } }>(
      `/api/admin/jobseekers?${queryParams}`,
      token
    );
  }

  /**
   * Employer Management APIs
   */
  static async getAllEmployers(token: string | null, params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    verified?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.verified !== undefined) queryParams.append("verified", params.verified.toString());

    return this.apiCall<{ data: { employers: EmployerData[]; pagination: any } }>(
      `/api/admin/employers?${queryParams}`,
      token
    );
  }

  static async getEmployerById(token: string | null, employerId: number) {
    return this.apiCall<{ data: { employer: EmployerDetailData } }>(
      `/api/admin/employers/${employerId}`,
      token
    );
  }

  static async verifyEmployer(token: string | null, employerId: number) {
    return this.apiCall<{ data: { employer: EmployerData } }>(
      `/api/admin/employers/${employerId}/verify`,
      token,
      { method: "POST" }
    );
  }

  static async rejectEmployer(token: string | null, employerId: number, reason?: string) {
    return this.apiCall<{ data: { employer: EmployerData; reason?: string } }>(
      `/api/admin/employers/${employerId}/reject`,
      token,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      }
    );
  }

  /**
   * Company Management APIs
   */
  static async getAllCompanies(token: string | null, params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    verified?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.verified !== undefined) queryParams.append("verified", params.verified.toString());

    return this.apiCall<{ data: { companies: CompanyData[]; pagination: any } }>(
      `/api/admin/companies?${queryParams}`,
      token
    );
  }

  static async getCompanyById(token: string | null, companyId: number) {
    return this.apiCall<{ data: { company: CompanyDetailData } }>(
      `/api/admin/companies/${companyId}`,
      token
    );
  }

  /**
   * Job Management APIs
   */
  static async getAllJobs(token: string | null, params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    return this.apiCall<{ data: { jobs: any[]; pagination: any } }>(
      `/api/admin/jobs?${queryParams}`,
      token
    );
  }

  static async deleteJob(token: string | null, jobId: number) {
    return this.apiCall<{ data: null }>(
      `/api/admin/jobs/${jobId}`,
      token,
      { method: "DELETE" }
    );
  }
}
