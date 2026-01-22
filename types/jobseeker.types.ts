export type ProfileData = {
  fullName: string;
  headline: string;
  location: string;
  skills: string;
  summary: string;
  email?: string;
  total_experience: string;
  total_experience_years: number;
};

export type DocumentFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
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
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
};