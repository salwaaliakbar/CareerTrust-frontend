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
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  currentlyStudying: boolean;
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
 * Get public jobseeker profile by ID
 * @param jobseekerId - The jobseeker ID
 * @returns Promise with jobseeker profile data
 */
export const getPublicProfile = async (
  jobseekerId: string,
): Promise<JobseekerPublicProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${jobseekerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
