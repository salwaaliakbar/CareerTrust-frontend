import {
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

export const DASHBOARD_STAT_CARDS = [
  {
    id: "applications",
    icon: Briefcase,
    label: "Applications Submitted",
    color: "bg-blue-500",
    key: "totalApplications",
  },
  {
    id: "accepted",
    icon: CheckCircle,
    label: "Accepted Offers",
    color: "bg-green-500",
    key: "acceptedApplications",
  },
  {
    id: "pending",
    icon: Clock,
    label: "Pending Applications",
    color: "bg-amber-500",
    key: "pendingApplications",
  },
  {
    id: "views",
    icon: Eye,
    label: "Profile Views",
    color: "bg-purple-500",
    key: "profileViews",
  },
  {
    id: "recommendations",
    icon: TrendingUp,
    label: "Job Recommendations",
    color: "bg-indigo-500",
    key: "jobsRecommended",
  },
  {
    id: "verified",
    icon: BadgeCheck,
    label: "Verified Records",
    color: "bg-emerald-500",
    key: "verifiedRecords",
  },
];
