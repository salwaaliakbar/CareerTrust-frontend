"use client";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Star } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type Job = {
  id: number | string;
  title: string;
  company: string | { id: number; name: string };
  location: string;
  salary?: string;
  rating?: number;
  reviews?: number;
  match?: number;
  postedDaysAgo?: number | string;
  description?: string;
  responsibilities?: string[];
  [key: string]: any;
};

interface JobCardProps {
  job: Job;
  isApplied?: boolean;
}

export default function JobCard({ job, isApplied = false }: JobCardProps) {
  const { isSignedIn } = useUser();
  let matchDisplay = null;
  if (!isSignedIn) {
    matchDisplay = (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
        <svg
          className="w-3.5 h-3.5 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Login to see match %
      </span>
    );
  } else {
    matchDisplay = (
      <span className="bg-linear-to-r from-green-100 to-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
        {job.matchPercentage}% Match
      </span>
    );
  }
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card-base p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 block smooth-enter card-hover overflow-hidden relative group"
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-blue-50/50 transition-all duration-500 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Briefcase className="w-6 h-6 text-sky-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                {job.title}
              </h3>
              <p className="text-gray-600 font-semibold group-hover:text-primary/70 transition-colors duration-300">
                {typeof job.company === 'object' ? job.company.name : job.company}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </div>
            <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-yellow-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {job.rating} ({job.reviews} reviews)
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-col gap-2 items-end">
            {matchDisplay}
            {isApplied && (
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 border border-green-300">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                You Applied
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
            Posted {job.postedDaysAgo}d ago
          </p>
        </div>
      </div>
    </Link>
  );
}
