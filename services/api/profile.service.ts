/**
 * Profile Service
 * Handles API calls for viewing jobseeker profiles
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface JobseekerPublicProfile {
  jobseekerId: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  location: string | null;
  totalExperience: string | null;
  totalExperienceYears: number | null;
  summary: string | null;
  highestDegree: string | null;
  profilePicUrl: string | null;
  resumeUrl: string | null;
  /** "open" = Open for Opportunities (user-controlled); "not_open" = Not Open */
  employmentStatus: "open" | "not_open" | null;
  createdAt: string;
  employmentHistory: EmploymentRecord[];
  educationHistory: EducationRecord[];
  skills: Skill[];
}

export interface EmploymentRecord {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  currentlyWorking: boolean;
}

export interface EducationRecord {
  id: number;
  institution: string;
  degree: string;
  startDate: string | null;
  endDate: string | null;
}

export interface Skill {
  id: number;
  skillName: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

/**
 * Get public jobseeker profile by Clerk ID
 * @param clerkId - The jobseeker's Clerk ID
 * @param getToken - Clerk getToken function for JWT authentication
 * @returns Promise with jobseeker profile data
 */
export const getPublicProfile = async (
  clerkId: string,
  getToken?: () => Promise<string | null>,
): Promise<JobseekerPublicProfile> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/profile/${clerkId}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    const result: ApiResponse<JobseekerPublicProfile> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching public profile:", error);
    throw error;
  }
};
