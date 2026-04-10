// Updated Dashboard Stats Calculation Logic
// File: components/jobseekerDashboard/Dashboard.tsx

// This file demonstrates how to fetch real data from Redux/API
// Instead of using mock data

import { useAppSelector } from "@/redux/store/hooks";
import { useUser } from "@clerk/nextjs";

// STEP 1: Get applications from Redux
const applications = useAppSelector((state) => state.jobseeker.applications.items);

// STEP 2: Calculate stats from real data
const calculateDashboardStats = (applications: any[], jobs: any[]) => {
  return {
    // CORRECT: Count all applications in the system
    totalApplications: applications.length,

    // CORRECT: Only count applications with status === "hired"
    acceptedApplications: applications.filter(
      (app) => app.status === "hired"
    ).length,

    // CORRECT: Count applications in progress (pending review)
    // This includes "pending" (just applied) + "reviewing" (under review)
    pendingApplications: applications.filter(
      (app) => app.status === "pending" || app.status === "reviewing"
    ).length,

    // TODO: Fetch from backend user profile API
    profileViews: 0,

    // CORRECT: Count jobs with match > 50%
    jobsRecommended: jobs.filter((job) => (job.match || 0) > 50).length,

    // TODO: Fetch from employment passport API
    verifiedRecords: 0,
  };
};

// STEP 3: Use in useEffect
useEffect(() => {
  const stats = calculateDashboardStats(applications, allJobs);
  setStats(stats);
}, [applications, allJobs]);

// ============== API INTEGRATION NEEDED ==============

// TODO 1: Create API endpoint to fetch user statistics
// GET /api/jobseeker/stats
// Returns: {
//   totalApplications: number
//   acceptedApplications: number
//   profileViews: number
// }

// TODO 2: Fetch in useEffect:
useEffect(() => {
  const fetchStats = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`/api/jobseeker/stats?clerkId=${user.id}`);
      setStats((prev) => ({
        ...prev,
        totalApplications: response.data.totalApplications,
        acceptedApplications: response.data.acceptedApplications,
        profileViews: response.data.profileViews,
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };
  fetchStats();
}, [user?.id]);

// TODO 3: Fetch recent applications
useEffect(() => {
  const fetchRecentApplications = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`/api/applications?clerkId=${user.id}`);
      // Sort by date and take last 5
      const recent = response.data.data
        .sort(
          (a: any, b: any) =>
            new Date(b.appliedDate).getTime() -
            new Date(a.appliedDate).getTime()
        )
        .slice(0, 5)
        .map((app: any) => ({
          id: app.id,
          jobTitle: app.jobTitle,
          company: app.company,
          status: app.status,
          appliedDate: formatDate(app.appliedDate),
        }));

      setRecentApplications(recent);
    } catch (error) {
      console.error("Error fetching recent applications:", error);
    }
  };
  fetchRecentApplications();
}, [user?.id]);
