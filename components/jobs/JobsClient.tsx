"use client";
import { useMemo, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { useSearchParams, useRouter } from "next/navigation";

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

export default function JobsClient({ jobs }: { jobs: Job[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  // initialize filters from URL (so JobSearchBar navigation applies filters)
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") || "";
    const loc = searchParams.get("location") || "";
    // schedule state updates asynchronously to avoid cascading renders warnings
    Promise.resolve().then(() => {
      setSearchTerm(q);
      setSelectedLocation(loc);
    });
  }, [searchParams]);

  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location))).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !selectedLocation ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#0C2B4E] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Find Your Next Opportunity</h1>
          <p className="text-blue-100 text-lg mb-8">Discover verified jobs matched to your skills and experience</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, company, skills..."
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <select
              aria-label="Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchTerm) params.set("q", searchTerm);
                  if (selectedLocation) params.set("location", selectedLocation);
                  router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium shadow-sm"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLocation("");
                  router.push(`/jobs`);
                }}
                className="px-3 py-2 bg-white text-gray-700 rounded-lg border"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="md:w-64 shrink-0">
            <div className="card-base p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-sky-700" />
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Salary</h4>
                  <div className="space-y-2">
                    {["PKR 80,000 - 120,000", "PKR 120,000 - 180,000", "PKR 180,000+"].map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-700" />
                        <span className="text-gray-600 text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Company Rating</h4>
                  <div className="space-y-2">
                    {[{ rating: 4.5, label: "4.5+ stars" }, { rating: 4, label: "4+ stars" }, { rating: 3.5, label: "3.5+ stars" }].map((item) => (
                      <label key={item.rating} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-700" />
                        <span className="text-gray-600 text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Posted Date</h4>
                  <div className="space-y-2">
                    {["Last 7 days", "Last 30 days", "Last 90 days"].map((date) => (
                      <label key={date} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-700" />
                        <span className="text-gray-600 text-sm">{date}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <strong>{filteredJobs.length}</strong> job{filteredJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="card-base p-12 text-center">
                  <BriefcasePlaceholder />
                  <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BriefcasePlaceholder() {
  return (
    <div className="mx-auto mb-4">
      <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" strokeWidth="1.5" />
        <path d="M8 7V6a4 4 0 0 1 8 0v1" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
