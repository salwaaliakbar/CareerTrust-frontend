import { API_ENDPOINTS } from "@/constants/api";
import {
  Job,
  JobsResponse,
  JobDetailResponse,
  CreateJobResponse,
  JobFormData,
} from "@/types/job.types";

/**
 * Fetch all jobs
 * @param jobType - Optional job type filter
 * @param featured - Optional featured filter
 */
export async function fetchJobs(
  jobType?: string,
  featured?: boolean,
): Promise<Job[]> {
  try {
    let url = API_ENDPOINTS.JOBS;

    const params = new URLSearchParams();
    if (jobType) params.append("jobType", jobType);
    if (featured !== undefined) params.append("featured", String(featured));

    if (params.toString()) {
      url += "?" + params.toString();
    }

    console.log("[Job Service] Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log(
      "[Job Service] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error(
        `[Job Service] Failed to fetch. Status: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data: JobsResponse = await response.json();

    if (!data.success) {
      console.warn("[Job Service] API returned success: false", data.error);
      return [];
    }

    console.log("[Job Service] Successfully fetched jobs:", data.data.length);
    return data.data;
  } catch (error) {
    console.error("[Job Service] Error fetching jobs:", error);
    return [];
  }
}

/**
 * Fetch featured jobs
 */
export async function fetchFeaturedJobs(): Promise<Job[]> {
  try {
    const url = `${API_ENDPOINTS.JOBS}/featured`;

    console.log("[Job Service] Fetching featured jobs from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log(
      "[Job Service] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error(
        `[Job Service] Failed to fetch featured jobs. Status: ${response.status}`,
      );
      return [];
    }

    const data: JobsResponse = await response.json();

    if (!data.success) {
      console.warn("[Job Service] API returned success: false", data.error);
      return [];
    }

    console.log(
      "[Job Service] Successfully fetched featured jobs:",
      data.data.length,
    );
    return data.data;
  } catch (error) {
    console.error("[Job Service] Error fetching featured jobs:", error);
    return [];
  }
}

/**
 * Fetch job by ID
 * @param id - Job ID
 */
export async function fetchJobById(id: string | number): Promise<Job | null> {
  try {
    const url = `${API_ENDPOINTS.JOBS}/${id}`;

    console.log("[Job Service] Fetching job by ID:", id, "URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("[Job Service] Response status:", response.status);

    if (!response.ok) {
      console.error(`[Job Service] Job not found. Status: ${response.status}`);
      return null;
    }

    const data: JobDetailResponse = await response.json();

    if (!data.success) {
      console.warn("[Job Service] API returned success: false", data.error);
      return null;
    }

    console.log("[Job Service] Successfully fetched job:", data.data.id);
    return data.data;
  } catch (error) {
    console.error("[Job Service] Error fetching job by ID:", error);
    return null;
  }
}

/**
 * Create new job
 * @param jobData - Job data from form
 */
export async function createJob(
  jobData: Partial<Job> | JobFormData,
  getToken: () => Promise<string | null>,
): Promise<Job> {
  try {
    const url = API_ENDPOINTS.JOBS;
    const token = await getToken();

    console.log("[Job Service] Creating job:", jobData);
    console.log("[Job Service] Token present:", !!token);

    // Convert skills string to array if needed
    const processedData = {
      ...jobData,
      skills:
        typeof jobData.skills === "string"
          ? jobData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : jobData.skills,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(processedData),
    });

    console.log("[Job Service] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Failed to create job: ${response.statusText}`,
      );
    }

    const data: CreateJobResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create job");
    }

    console.log("[Job Service] Job created successfully:", data.data.id);
    return data.data;
  } catch (error) {
    console.error("[Job Service] Error creating job:", error);
    throw error;
  }
}

/**
 * Update existing job
 * @param jobId - Job ID to update
 * @param jobData - Updated job data
 * @param getToken - Clerk authentication function
 */
export async function updateJob(
  jobId: string | number,
  jobData: Partial<Job> | JobFormData,
  getToken: () => Promise<string | null>,
): Promise<Job> {
  try {
    const url = `${API_ENDPOINTS.JOBS}/${jobId}`;
    const token = await getToken();

    console.log("[Job Service] Updating job:", jobId, jobData);
    console.log("[Job Service] Token present:", !!token);

    // Convert skills string to array if needed
    const processedData = {
      ...jobData,
      skills:
        typeof jobData.skills === "string"
          ? jobData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : jobData.skills,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(processedData),
    });

    console.log("[Job Service] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `Failed to update job: ${response.statusText}`,
      );
    }

    const data: CreateJobResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update job");
    }

    console.log("[Job Service] Job updated successfully:", data.data.id);
    return data.data;
  } catch (error) {
    console.error("[Job Service] Error updating job:", error);
    throw error;
  }
}
