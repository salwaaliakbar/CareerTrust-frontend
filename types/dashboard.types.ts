import type { LucideIcon } from "lucide-react";

export interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number; // status === "hired"
  pendingApplications: number; // status === "pending" or "reviewing"
  profileViews: number;
  jobsRecommended: number; // jobs with match > 50%
  verifiedRecords?: number;
}

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "hired"
  | "rejected";

export interface RecentApplication {
  id: string;
  jobId?: number;
  jobTitle: string;
  company: string;
  location?: string;
  salary?: string;
  status: ApplicationStatus;
  appliedDate: string;
}

export interface StatusConfigItem {
  style: string;
  dot: string;
  label: string;
}

export type DashboardStatusConfig = Record<ApplicationStatus, StatusConfigItem>;

export interface DashboardStatItem {
  id: string;
  icon: LucideIcon;
  label: string;
  valueKey: keyof DashboardStats;
  color: string;
  bg: string;
  text: string;
  border: string;
  suffix?: string;
}

export interface DashboardQuickActionItem {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  grad: string;
  hoverText: string;
  accentText: string;
  bg: string;
  dark?: boolean;
}
