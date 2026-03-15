import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import type { FetchedProfileData } from "@/redux/store/slices/jobseeker/profileSlice";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Fetch jobseeker profile from backend
 * @param clerkId - Clerk user ID
 */
export async function fetchJobseekerProfile(
  clerkId: string
): Promise<FetchedProfileData> {
  try {
    if (!clerkId) {
      throw new Error("clerkId is required");
    }

    const url = `${API_ENDPOINTS.JOBSEEKER_PROFILE_GET}?clerkId=${encodeURIComponent(
      clerkId
    )}`;

    console.log("[Jobseeker Service] Fetching profile for clerkId:", clerkId);

    const { data } = await axios.get<ApiResponse<FetchedProfileData>>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data?.success || !data.data) {
      throw new Error(data?.message || "Invalid response data");
    }

    console.log("[Jobseeker Service] Successfully fetched profile");
    return data.data;
  } catch (error) {
    console.error("[Jobseeker Service] Error fetching profile:", error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to fetch profile";
      throw new Error(message);
    }

    throw error;
  }
}

/**
 * Update jobseeker profile
 * @param clerkId - Clerk user ID
 * @param profileData - Profile data to update
 */
export async function updateJobseekerProfile(
  clerkId: string,
  profileData: Partial<FetchedProfileData>
): Promise<FetchedProfileData> {
  try {
    if (!clerkId) {
      throw new Error("clerkId is required");
    }

    const url = API_ENDPOINTS.JOBSEEKER_PROFILE_SAVE;

    console.log("[Jobseeker Service] Updating profile for clerkId:", clerkId);

    const { data } = await axios.put<ApiResponse<FetchedProfileData>>(url, {
      clerkId,
      ...profileData,
    });

    if (!data?.success || !data.data) {
      throw new Error(data?.message || "Invalid response data");
    }

    console.log("[Jobseeker Service] Successfully updated profile");
    return data.data;
  } catch (error) {
    console.error("[Jobseeker Service] Error updating profile:", error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update profile";
      throw new Error(message);
    }

    throw error;
  }
}
