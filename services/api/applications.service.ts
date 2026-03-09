import { API_ENDPOINTS } from "@/constants/api";

/**
 * Submit a job application
 * @param clerkId - User's Clerk ID
 * @param jobId - Job ID to apply for
 */
export async function submitJobApplication(
  clerkId: string,
  jobId: string | number,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    // Convert jobId to number if it's a string
    const numericJobId =
      typeof jobId === "string" ? parseInt(jobId, 10) : jobId;

    console.log("[Applications Service] Submitting application:", {
      clerkId,
      jobId: numericJobId,
    });

    const response = await fetch(API_ENDPOINTS.APPLICATIONS_SUBMIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, jobId: numericJobId }),
    });

    console.log(
      "[Applications Service] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        "[Applications Service] Failed to submit application:",
        errorData,
      );

      // Extract error message from different possible formats
      let errorMessage = "Failed to submit application";
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    console.log(
      "[Applications Service] Application submitted successfully:",
      data,
    );

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit application";
    console.error(
      "[Applications Service] Error submitting application:",
      error,
    );
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all applications for a jobseeker
 * @param clerkId - User's Clerk ID
 */
export async function getJobseekerApplications(
  clerkId: string,
): Promise<{ success: boolean; data?: unknown[]; error?: string }> {
  try {
    console.log("[Applications Service] Fetching applications for:", clerkId);

    const response = await fetch(
      API_ENDPOINTS.APPLICATIONS_BY_CLERKID(clerkId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `[Applications Service] Failed to fetch applications. Status: ${response.status}`,
      );
      return {
        success: false,
        error: "Failed to fetch applications",
      };
    }

    const data = await response.json();
    console.log(
      "[Applications Service] Applications fetched successfully:",
      data,
    );

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch applications";
    console.error("[Applications Service] Error fetching applications:", error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get application by ID
 * @param applicationId - Application ID
 */
export async function getApplicationById(
  applicationId: string | number,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    console.log("[Applications Service] Fetching application:", applicationId);

    const response = await fetch(
      API_ENDPOINTS.APPLICATION_BY_ID(applicationId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `[Applications Service] Failed to fetch application. Status: ${response.status}`,
      );
      return {
        success: false,
        error: "Failed to fetch application",
      };
    }

    const data = await response.json();
    console.log(
      "[Applications Service] Application fetched successfully:",
      data,
    );

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch application";
    console.error("[Applications Service] Error fetching application:", error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
