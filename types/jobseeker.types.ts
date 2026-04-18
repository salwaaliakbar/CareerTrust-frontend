// User-controlled: whether applicant is open to job opportunities
export type EmploymentStatusType = "open" | "not_open";

export type ProfileData = {
  fullName: string;
  headline: string;
  location: string;
  skills: string;
  summary: string;
  email?: string;
  total_experience: string;
  total_experience_years: number;
  // "open" = Open for Opportunities, "not_open" = Not Open (user-controlled)
  employmentStatus?: EmploymentStatusType;
};

export type DocumentFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string; // URL for already uploaded documents
  file?: File; // Actual File object for new uploads
};

export type VerificationStatus = "draft" | "pending" | "verified" | "rejected";

export type EmploymentRecord = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  documents: DocumentFile[];
  rejectionReason?: string;
};

export type EducationRecord = {
  id: string | number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  documents: DocumentFile[];
  verified?: boolean;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
};
