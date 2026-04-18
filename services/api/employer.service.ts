import { API_ENDPOINTS } from "@/constants/api";
import {
  EmployerJob,
  EmployerJobsResponse,
  JobApplication,
  ApplicationsResponse,
  UpdateApplicationStatusRequest,
  ApplicationStatus,
} from "@/types/application.types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
const EMPLOYER_API_URL = `${BACKEND_BASE_URL}/api/employer`;

/**
 * Fetch all jobs posted by the employer
 * @param employerId - Employer's user ID
 * @param getToken - Clerk getToken function for JWT authentication
 */
export async function fetchEmployerJobs(
  employerId: string,
  getToken?: () => Promise<string | null>,
): Promise<EmployerJob[]> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs?employerId=${employerId}`;

    console.log("[Employer Service] Fetching employer jobs:", url);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("[Employer Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to fetch jobs. Status: ${response.status}`,
      );
      return [];
    }

    const data: EmployerJobsResponse = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] API returned success: false",
        data.error,
      );
      return [];
    }

    console.log(
      "[Employer Service] Successfully fetched jobs:",
      data.data.length,
    );
    return data.data;
  } catch (error) {
    console.error("[Employer Service] Error fetching jobs:", error);
    return [];
  }
}

/**
 * Fetch all applications for a specific job
 * @param jobId - Job ID
 * @param getToken - Clerk getToken function for JWT authentication
 */
export async function fetchJobApplications(
  jobId: string | number,
  getToken?: () => Promise<string | null>,
): Promise<{ applications: JobApplication[]; jobTitle: string | null }> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}/applications`;

    console.log("[Employer Service] Fetching applications for job:", jobId);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("[Employer Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to fetch applications. Status: ${response.status}`,
      );
      return [];
    }

    const data: ApplicationsResponse = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] API returned success: false",
        data.error,
      );
      return { applications: [], jobTitle: null };
    }

    const applications = data.data?.applications ?? data.data ?? [];
    const jobTitle = data.data?.jobTitle ?? null;

    console.log(
      "[Employer Service] Successfully fetched applications:",
      applications.length,
    );
    return { applications, jobTitle };
  } catch (error) {
    console.error("[Employer Service] Error fetching applications:", error);
    return { applications: [], jobTitle: null };
  }
}

/**
 * Update application status
 * @param request - Update request with applicationId, status, and notes
 * @param getToken - Clerk getToken function for JWT authentication
 */
export async function updateApplicationStatus(
  request: UpdateApplicationStatusRequest,
  getToken?: () => Promise<string | null>,
): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/applications/${request.applicationId}/status`;

    console.log("[Employer Service] Updating application status:", request);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        status: request.status,
        notes: request.notes,
      }),
    });

    console.log("[Employer Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to update status. Status: ${response.status}`,
      );
      return false;
    }

    const data = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] API returned success: false",
        data.error,
      );
      return false;
    }

    console.log("[Employer Service] Successfully updated application status");
    return true;
  } catch (error) {
    console.error(
      "[Employer Service] Error updating application status:",
      error,
    );
    return false;
  }
}

/**
 * Update job status (active, closed, draft)
 * @param jobId - Job ID
 * @param status - New status
 * @param getToken - Clerk getToken function for JWT authentication
 */
export async function updateJobStatus(
  jobId: string | number,
  status: "active" | "closed" | "draft",
  getToken?: () => Promise<string | null>,
): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}/status`;

    console.log("[Employer Service] Updating job status:", jobId, status);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    console.log("[Employer Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to update job status. Status: ${response.status}`,
      );
      return false;
    }

    const data = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] API returned success: false",
        data.error,
      );
      return false;
    }

    console.log("[Employer Service] Successfully updated job status");
    return true;
  } catch (error) {
    console.error("[Employer Service] Error updating job status:", error);
    return false;
  }
}

/**
 * Delete a job
 * @param jobId - Job ID
 * @param getToken - Clerk getToken function for JWT authentication
 */
export async function deleteJob(
  jobId: string | number,
  getToken?: () => Promise<string | null>,
): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}`;

    console.log("[Employer Service] Deleting job:", jobId);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    console.log("[Employer Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to delete job. Status: ${response.status}`,
      );
      return false;
    }

    const data = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] API returned success: false",
        data.error,
      );
      return false;
    }

    console.log("[Employer Service] Successfully deleted job");
    return true;
  } catch (error) {
    console.error("[Employer Service] Error deleting job:", error);
    return false;
  }
}

// ─── Candidates ─────────────────────────────────────────────────────────────

export interface Candidate {
  id: number;
  clerkId: string;
  fullName: string | null;
  profilePicUrl: string | null;
  headline: string | null;
  summary: string | null;
  location: string | null;
  skills: string[];
  totalExperience: string | null;
  totalExperienceYears: number | null;
  isProfileComplete: boolean;
  updatedAt: string;
}

export interface CandidatesResponse {
  success: boolean;
  data: {
    candidates: Candidate[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

/**
 * Fetch featured candidates preview cards (top 3)
 */
export async function fetchFeaturedCandidates(
  getToken?: () => Promise<string | null>,
): Promise<CandidatesResponse["data"] | null> {
  try {
    const url = `${EMPLOYER_API_URL}/candidates/featured`;

    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (getToken) {
      const token = await getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to fetch featured candidates. Status: ${response.status}`,
      );
      return null;
    }

    const data: CandidatesResponse = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] Featured candidates API returned success: false",
        data.error,
      );
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("[Employer Service] Error fetching featured candidates:", error);
    return null;
  }
}

/**
 * Fetch all candidates (jobseeker profiles) for employer browsing
 */
export async function fetchAllCandidates(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    skills?: string;
  },
  getToken?: () => Promise<string | null>,
): Promise<CandidatesResponse["data"] | null> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.location) query.set("location", params.location);
    if (params.skills) query.set("skills", params.skills);

    const url = `${EMPLOYER_API_URL}/candidates?${query.toString()}`;

    console.log("[Employer Service] Fetching candidates:", url);

    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (getToken) {
      const token = await getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log(
      "[Employer Service] Candidates response status:",
      response.status,
    );

    if (!response.ok) {
      console.error(
        `[Employer Service] Failed to fetch candidates. Status: ${response.status}`,
      );
      return null;
    }

    const data: CandidatesResponse = await response.json();

    if (!data.success) {
      console.warn(
        "[Employer Service] Candidates API returned success: false",
        data.error,
      );
      return null;
    }

    console.log(
      "[Employer Service] Successfully fetched candidates:",
      data.data.candidates.length,
    );
    return data.data;
  } catch (error) {
    console.error("[Employer Service] Error fetching candidates:", error);
    return null;
  }
}
