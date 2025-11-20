export type ProfileData = {
  fullName: string;
  headline: string;
  location: string;
  experience: string;
  skills: string;
  education: string;
  summary: string;
  email?: string;
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