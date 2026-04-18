"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Sparkles
} from "lucide-react";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getFeaturedJobs } from "@/redux/store/slices/jobsSlice";

interface Job {
  id: number | string;
  title: string;
  company: string | { id: number; name: string };
  location: string;
  salary?: string;
  jobType?: string;
  postedDaysAgo?: number | string;
  description?: string;
  featured?: boolean;
}

// Sample jobs as fallback
const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    jobType: "Full-time",
    postedDaysAgo: 2,
    description: "We are looking for an experienced Frontend Developer to join our team and build amazing user experiences.",
    featured: true,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "$130k - $160k",
    jobType: "Full-time",
    postedDaysAgo: 3,
    description: "Lead product strategy and roadmap for our flagship products. Work with cross-functional teams.",
    featured: true,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$90k - $120k",
    jobType: "Full-time",
    postedDaysAgo: 1,
    description: "Create beautiful and intuitive designs for web and mobile applications.",
    featured: true,
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "Austin, TX",
    salary: "$110k - $140k",
    jobType: "Full-time",
    postedDaysAgo: 4,
    description: "Build scalable backend services and APIs using Node.js and Python.",
    featured: true,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudFirst",
    location: "Seattle, WA",
    salary: "$125k - $155k",
    jobType: "Full-time",
    postedDaysAgo: 2,
    description: "Manage cloud infrastructure and CI/CD pipelines for enterprise applications.",
    featured: true,
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Boston, MA",
    salary: "$140k - $180k",
    jobType: "Full-time",
    postedDaysAgo: 5,
    description: "Apply machine learning and statistical analysis to solve complex business problems.",
    featured: true,
  },
];

function FeaturedJobCard({ job, index }: { job: Job; index: number }) {
  const companyName = typeof job.company === "object" ? job.company.name : job.company;
  const delayClass = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
  ];
  
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={`group bg-white rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-2xl hover:border-[#1D546C]/40 transition-all duration-500 hover:-translate-y-2 block relative overflow-hidden fade-in-up ${delayClass[index % delayClass.length]}`}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent to-transparent group-hover:from-transparent group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-[#1D546C]/10 to-[#1D546C]/5 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Briefcase className="w-6 h-6 text-[#1D546C]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1D546C] transition-colors duration-300 truncate">
              {job.title}
            </h3>
            <p className="text-[#1D546C] font-medium truncate">
              {companyName}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {job.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#1D546C]/60" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-500/80" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {job.jobType && (
              <span className="inline-flex items-center gap-1 bg-[#1D546C]/10 text-[#1D546C] px-2.5 py-1 rounded-full text-xs font-medium">
                {job.jobType}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {job.postedDaysAgo}d ago
            </span>
          </div>
          <span className="text-[#1D546C] font-medium text-sm group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
            View Job
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedJobs() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs.featuredItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFeaturedJobs = async () => {
      setLoading(true);
      try {
        await dispatch(getFeaturedJobs(undefined)).unwrap();
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Featured Jobs",
          text: "We couldn't fetch the latest featured jobs.",
          confirmButtonText: "OK",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFeaturedJobs();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const jobsToRender = jobs.length > 0 ? jobs : sampleJobs;

  return (
    <section className="pb-20 pt-12 bg-linear-to-b from-white via-[#1D546C]/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1D546C]/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4 fade-in-up">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[#0C2B4E] text-sm font-medium">
              Top Opportunities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0C2B4E] mb-4 fade-in-down animation-delay-100">
            Featured Jobs
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto fade-in animation-delay-200">
            Discover hand-picked opportunities from verified employers. These positions are in high demand.
          </p>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="flex gap-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsToRender.map((job, idx) => (
              <FeaturedJobCard key={job.id} job={job} index={idx} />
            ))}
          </div>
        )}

        {/* View All Jobs CTA */}
        <div className="text-center mt-12">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-[#0C2B4E] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-[#1D546C]/90 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 fade-in-up animation-delay-300"
          >
            Browse All Jobs
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Explore hundreds of verified opportunities
          </p>
        </div>
      </div>
    </section>
  );
}
