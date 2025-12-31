"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getAllJobs, type Job } from "@/src/store/slices/jobsSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export default function JobSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const dispatch = useAppDispatch();
  const { items: jobs } = useAppSelector((state) => state.jobs);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
  // role filter removed from this compact search bar
    const url = `/jobs${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  const locations = useMemo(() => {
      return Array.from(new Set(jobs.map((j) => j.location))).sort();
    }, [jobs]);

  return (
    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full bg-white rounded-full shadow-lg flex items-center overflow-hidden">
          {/* Query input */}
          <div className="flex items-center gap-3 px-4 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <label htmlFor="job-query" className="sr-only">Search jobs</label>
            <input
              id="job-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, keyword or company"
              className="w-full py-4 text-gray-900 placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* Location input */}
          <div className="hidden sm:flex items-center gap-3 px-4 border-l border-gray-100 flex-1">
            <label htmlFor="job-location" className="sr-only">Location</label>
            <select
              id="job-location"
              aria-label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-4 text-gray-900 placeholder-gray-400 focus:outline-none"
            >
            <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="ml-auto bg-[#0C2B4E] hover:bg-[#1A3D64] text-white px-6 py-3 rounded-full font-medium m-2"
          >
            Search
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-3">Upload resume or create a profile to easily apply to jobs.</p>
      </div>
    </form>
  );
}
