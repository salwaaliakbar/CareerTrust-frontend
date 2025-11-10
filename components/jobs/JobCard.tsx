"use client";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, Star } from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  rating: number;
  reviews: number;
  match: number;
  postedDaysAgo: number;
  description: string;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="card-base p-6 hover:shadow-lg transition-shadow block"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-sky-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-600 font-semibold">{job.company}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {job.rating} ({job.reviews} reviews)
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {job.match}% Match
          </span>
          <p className="text-xs text-gray-500">Posted {job.postedDaysAgo}d ago</p>
        </div>
      </div>
    </Link>
  );
}
