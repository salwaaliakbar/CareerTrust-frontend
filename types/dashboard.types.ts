export interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number; // status === "hired"
  pendingApplications: number; // status === "pending" or "reviewing"
  profileViews: number;
  jobsRecommended: number; // jobs with match > 50%
  verifiedRecords?: number;
}

export interface RecentApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}
