import { ProfileData } from "@/types/jobseeker.types";

export interface JobseekerProfile extends ProfileData {
  resumeUrl?: string | null;
    profilePicUrl?: string | null;
  // if you store employment records inside the slice:
  employment?: Array<{
    id: string;
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
  }>;
}

// Example initialState
export const initialState: JobseekerProfile = {
  // required properties from ProfileData (provide defaults if necessary)
  fullName: '',
  email: '',
  headline: '',
  location: '',
  experience: '',
  skills: '',
  education: '',
  summary: '',
  resumeUrl: null,
  profilePicUrl: null,
  employment: [],
};