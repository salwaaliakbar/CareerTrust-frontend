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
 */
export async function fetchEmployerJobs(
  employerId: string,
): Promise<EmployerJob[]> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs?employerId=${employerId}`;

    console.log("[Employer Service] Fetching employer jobs:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
 */
export async function fetchJobApplications(
  jobId: string | number,
): Promise<JobApplication[]> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}/applications`;

    console.log("[Employer Service] Fetching applications for job:", jobId);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
      return [];
    }

    console.log(
      "[Employer Service] Successfully fetched applications:",
      data.data.length,
    );
    return data.data;
  } catch (error) {
    console.error("[Employer Service] Error fetching applications:", error);
    return [];
  }
}

/**
 * Update application status
 * @param request - Update request with applicationId, status, and notes
 */
export async function updateApplicationStatus(
  request: UpdateApplicationStatusRequest,
): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/applications/${request.applicationId}/status`;

    console.log("[Employer Service] Updating application status:", request);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
 */
export async function updateJobStatus(
  jobId: string | number,
  status: "active" | "closed" | "draft",
): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}/status`;

    console.log("[Employer Service] Updating job status:", jobId, status);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
 */
export async function deleteJob(jobId: string | number): Promise<boolean> {
  try {
    const url = `${EMPLOYER_API_URL}/jobs/${jobId}`;

    console.log("[Employer Service] Deleting job:", jobId);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
