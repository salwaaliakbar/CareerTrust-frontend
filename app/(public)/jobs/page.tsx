import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobsClient from "@/components/jobs/JobsClient";
import { fetchJobs } from "@/services/api/jobs.service";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  experience: string;
  skills: string[];
  postedDate: string;
  deadline?: string;
  image?: string;
  featured: boolean;
  description: string;
  rating?: number;
  reviews?: number;
  match?: number;
  postedDaysAgo?: number;
};

export default async function JobsPage() {
  const jobsFromApi = await fetchJobs();
  
  // Map API data to component expectations
  const jobs = jobsFromApi.map((job) => ({
    ...job,
    salary: job.salary || "Not specified",
    rating: 4.5,
    reviews: 0,
    match: 85,
    postedDaysAgo: 1,
  }));

  return (
    <div>
      <Header />
      <JobsClient jobs={jobs} />
      <Footer />
    </div>
  );
}
