/**
 * API Client Usage Examples
 *
 * This file demonstrates how to use the centralized API client
 * in different contexts (Server Components, Client Components, Server Actions)
 */

// ============================================
// SERVER COMPONENTS & SERVER ACTIONS
// ============================================

import { api } from "@/lib/apiClient";

// Example 1: Fetch jobs in a Server Component
export async function getJobs() {
  try {
    const response = await api.get("/api/jobs");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error.message);
    throw error;
  }
}

// Example 2: Create a job in a Server Action
export async function createJob(formData: FormData) {
  "use server";

  try {
    const jobData = {
      title: formData.get("title"),
      description: formData.get("description"),
      jobType: formData.get("jobType"),
      location: formData.get("location"),
      salary: formData.get("salary"),
    };

    const response = await api.post("/api/jobs", jobData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Example 3: Update employer profile
export async function updateEmployerProfile(profileId: number, data: any) {
  "use server";

  try {
    const response = await api.patch(
      `/api/employer/company-profile/${profileId}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ============================================
// CLIENT COMPONENTS
// ============================================

("use client");

import { useAuth } from "@clerk/nextjs";
import { clientApi } from "@/lib/apiClient";

// Example 4: Fetch data in a Client Component
export function useJobseekerProfile() {
  const { getToken } = useAuth();

  async function fetchProfile(clerkId: string) {
    try {
      const response = await clientApi.get(
        `/api/jobseeker/profile?clerkId=${clerkId}`,
        { getToken },
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch profile:", error.message);
      throw error;
    }
  }

  return { fetchProfile };
}

// Example 5: Submit form data from Client Component
export async function submitApplication(
  jobId: number,
  applicationData: any,
  getToken: () => Promise<string | null>,
) {
  try {
    const response = await clientApi.post(
      `/api/jobs/${jobId}/apply`,
      applicationData,
      { getToken },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Example 6: Delete a job
export async function deleteJob(
  jobId: number,
  getToken: () => Promise<string | null>,
) {
  try {
    const response = await clientApi.delete(`/api/employer/jobs/${jobId}`, {
      getToken,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ============================================
// FILE UPLOADS
// ============================================

import { uploadFiles } from "@/lib/apiClient";

// Example 7: Upload resume in Server Component
export async function uploadResume(file: File, jobseekerId: number) {
  "use server";

  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobseekerId", jobseekerId.toString());

    const response = await uploadFiles(
      "/api/jobseeker/update-profile",
      formData,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Example 8: Upload files from Client Component
export async function uploadProfilePicture(
  file: File,
  getToken: () => Promise<string | null>,
) {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await uploadFiles(
      "/api/jobseeker/update-profile",
      formData,
      {
        getToken,
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ============================================
// ERROR HANDLING
// ============================================

// Example 9: Comprehensive error handling
export async function handleApiCall() {
  "use server";

  try {
    const response = await api.get("/api/jobs");
    return { success: true, data: response.data };
  } catch (error: any) {
    // ApiError type from lib/apiClient.ts
    if (error.statusCode === 401) {
      return { success: false, error: "Authentication required" };
    } else if (error.statusCode === 403) {
      return {
        success: false,
        error: "You don't have permission to access this resource",
      };
    } else if (error.statusCode === 404) {
      return { success: false, error: "Resource not found" };
    } else {
      return { success: false, error: error.message || "An error occurred" };
    }
  }
}

// ============================================
// REACT COMPONENT EXAMPLE
// ============================================

/*
"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { clientApi } from "@/lib/apiClient";

export default function JobseekerProfilePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await clientApi.get(
          `/api/jobseeker/profile?clerkId=${user?.id}`,
          { getToken }
        );
        setProfile(response.data);
      } catch (error: any) {
        console.error("Failed to load profile:", error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user, getToken]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1>{profile.fullName}</h1>
      <p>{profile.email}</p>
    </div>
  );
}
*/

// ============================================
// SERVER ACTION WITH FORM EXAMPLE
// ============================================

/*
"use server";

import { api } from "@/lib/apiClient";
import { revalidatePath } from "next/cache";

export async function updateJobStatus(formData: FormData) {
  try {
    const jobId = formData.get("jobId");
    const status = formData.get("status");

    await api.patch(`/api/employer/jobs/${jobId}/status`, { status });

    revalidatePath("/employer/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Usage in component:
// <form action={updateJobStatus}>
//   <input type="hidden" name="jobId" value={job.id} />
//   <select name="status">
//     <option value="active">Active</option>
//     <option value="closed">Closed</option>
//   </select>
//   <button type="submit">Update Status</button>
// </form>
*/
