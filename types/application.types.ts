// Application type definitions

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "rejected"
  | "hired";

export interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeOption: "existing" | "new";
  resumeFile?: File;
}

export interface ApplyModalProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface ApplyModalProps {
  isOpen: boolean;
  jobTitle: string;
  companyName: string;
  resumeUrl: string | null;
  onClose: () => void;
  onSubmit: (data: ApplicationData) => Promise<void>;
  profileData?: ApplyModalProfileData;
}

export interface Applicant {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  headline?: string;
  location?: string;
  profileImage?: string;
  skills?: string[];
  experience?: string;
  resumeUrl?: string;
  appliedDate: string;
  status: ApplicationStatus;
  coverLetter?: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  matchScore?: number;
}

export interface JobApplication {
  id: string;
  jobId: string | number;
  applicantId: string;
  applicant: Applicant;
  status: ApplicationStatus;
  appliedDate: string;
  updatedDate?: string;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
}

export interface EmployerJob {
  id: string | number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
  postedDate: string;
  deadline?: string;
  status: "active" | "closed" | "draft";
  applicationsCount: number;
  viewsCount: number;
  featured?: boolean;
  description?: string;
  skills?: string[];
}

export interface ApplicationsResponse {
  success: boolean;
  data: JobApplication[];
  total: number;
  error?: string;
}

export interface EmployerJobsResponse {
  success: boolean;
  data: EmployerJob[];
  total: number;
  error?: string;
}

export interface UpdateApplicationStatusRequest {
  applicationId: string;
  status: ApplicationStatus;
  notes?: string;
}
