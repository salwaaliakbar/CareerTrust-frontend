"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllJobs } from "@/redux/store/slices/jobsSlice";
import {
  fetchUserApplications,
  selectAppliedJobIds,
} from "@/redux/store/slices/jobseeker/applicationsSlice";
import { useUser } from "@clerk/nextjs";

export default function JobsClient() {
  const dispatch = useAppDispatch();
  const { items: jobs, loading } = useAppSelector((state) => state.jobs);
  const reduxAppliedJobIds = useAppSelector(selectAppliedJobIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [sortByRelevant, setSortByRelevant] = useState(false);
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  // Initialize Redux — wait for Clerk to finish loading before dispatching
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user?.id) {
      dispatch(getAllJobs({ clerkId: user.id }));
    } else {
      dispatch(getAllJobs({}));
    }
  }, [dispatch, isSignedIn, user, isLoaded]);

  // Fetch applied jobs from Redux
  useEffect(() => {
    // Only fetch if we don't have data in Redux yet
    if (user?.id && reduxAppliedJobIds.length === 0) {
      console.log("[JobsClient] Fetching user applications - no data in Redux");
      dispatch(fetchUserApplications({ forceRefresh: false }));
    } else if (user?.id && reduxAppliedJobIds.length > 0) {
      console.log(
        "[JobsClient] Using cached applications from Redux, count:",
        reduxAppliedJobIds.length,
      );
    }
  }, [user?.id, reduxAppliedJobIds.length, dispatch]);

  // initialize filters from URL (so JobSearchBar navigation applies filters)
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") || "";
    const loc = searchParams.get("location") || "";
    const filter = searchParams.get("filter") || "";
    // schedule state updates asynchronously to avoid cascading renders warnings
    Promise.resolve().then(() => {
      setSearchTerm(q);
      setSelectedLocation(loc);
      // Activate recommended filter if coming from dashboard
      if (filter === "recommended") {
        setRecommendedOnly(true);
        setSortByRelevant(true);
      }
    });
  }, [searchParams]);

  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location))).sort();
  }, [jobs]);

  const getMatchPercentage = (job: unknown) => {
    const value = (job as { matchPercentage?: unknown })?.matchPercentage;
    return typeof value === "number" ? value : 0;
  };

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      // Recommended filter - only show jobs with matchPercentage > 50% if toggle is on
      if (recommendedOnly) {
        if (getMatchPercentage(job) <= 50) return false;
      }

      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !selectedLocation ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Salary filter
      let matchesSalary = true;
      if (selectedSalary.length > 0) {
        // Parse job.salary as number (remove commas, PKR, etc.)
        let salaryNum = 0;
        if (typeof job.salary === "number") {
          salaryNum = job.salary;
        } else if (typeof job.salary === "string") {
          salaryNum = parseInt(job.salary.replace(/[^\d]/g, ""), 10);
        }
        matchesSalary = selectedSalary.some((range) => {
          if (range === "PKR 80,000 - 120,000")
            return salaryNum >= 80000 && salaryNum <= 120000;
          if (range === "PKR 120,000 - 180,000")
            return salaryNum > 120000 && salaryNum <= 180000;
          if (range === "PKR 180,000+") return salaryNum > 180000;
          return false;
        });
      }

      // Company rating filter
      let matchesRating = true;
      if (selectedRatings.length > 0) {
        matchesRating = selectedRatings.some(
          (rating) => (job.rating || 0) >= rating,
        );
      }

      // Posted date filter
      let matchesDate = true;
      if (selectedDates.length > 0) {
        matchesDate = selectedDates.some((date) => {
          if (!job.postedDate) return false;
          const posted = new Date(job.postedDate);
          const now = new Date();
          if (date === "Last 7 days")
            return (
              (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24) <= 7
            );
          if (date === "Last 30 days")
            return (
              (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24) <= 30
            );
          if (date === "Last 90 days")
            return (
              (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24) <= 90
            );
          return false;
        });
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSalary &&
        matchesRating &&
        matchesDate
      );
    });

    // Sort by most relevant if enabled and user is logged in
    if (sortByRelevant && isSignedIn) {
      filtered = [...filtered].sort(
        (a, b) => getMatchPercentage(b) - getMatchPercentage(a),

      );
    }
    return filtered;
  }, [
    jobs,
    searchTerm,
    selectedLocation,
    selectedSalary,
    selectedRatings,
    selectedDates,
    sortByRelevant,
    recommendedOnly,
    isSignedIn,
  ]);

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Hero Section with dashboard-style visual language */}
      <section className="px-2 sm:px-4 lg:px-6 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 jobs-hero-mesh" />
            <div className="absolute inset-0 opacity-[0.05] jobs-hero-grid" />
            <div className="absolute top-8 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
            <div className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-800" />

            <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <Search className="w-4 h-4 text-blue-300/80" />
                  <span className="text-blue-300/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                    Job Explorer
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight fade-in">
                  Find Your Next Opportunity
                </h1>
                <p className="mt-3 text-blue-200/80 text-sm sm:text-base max-w-2xl leading-relaxed fade-in animation-delay-100">
                  Discover verified jobs matched to your skills and experience.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-3xl fade-in animation-delay-200">
                <div className="md:col-span-2 relative group">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300 group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, company, skills..."
                    className="w-full pl-10 pr-4 py-3 bg-white/95 text-slate-900 rounded-xl border border-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] transition-all duration-300"
                  />
                </div>
                <select
                  aria-label="Location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 bg-white/95 text-slate-900 rounded-xl border border-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] transition-all duration-300"

// <!--               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const params = new URLSearchParams();
//                     if (searchTerm) params.set("q", searchTerm);
//                     if (selectedLocation)
//                       params.set("location", selectedLocation);
//                     router.push(
//                       `/jobs${params.toString() ? `?${params.toString()}` : ""}`,
//                     );
//                   }}
//                   className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
//                 >
//                   Apply
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSearchTerm("");
//                     setSelectedLocation("");
//                     router.push(`/jobs`);
//                   }}
//                   className="px-3 py-2 bg-white text-gray-700 rounded-lg border transition-all duration-300 hover:shadow-md active:scale-95" -->
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
                      if (selectedLocation)
                        params.set("location", selectedLocation);
                      router.push(
                        `/jobs${params.toString() ? `?${params.toString()}` : ""}`,
                      );
                    }}
                    className="px-4 py-2.5 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-100"
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
                    className="px-3 py-2.5 bg-white/95 text-slate-700 rounded-xl border border-blue-100/70 font-medium transition-all duration-200 hover:bg-white hover:shadow-md active:scale-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="md:w-64 shrink-0 fade-in animation-delay-300">
              <div className="card-base p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-sky-700" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    {/* Recommended Jobs filter for logged-in users */}
                    {isSignedIn && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Recommendations
                        </h4>
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-sky-50 transition">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600"
                            checked={recommendedOnly}
                            onChange={() => setRecommendedOnly((prev) => !prev)}
                          />
                          <span className="text-gray-600 text-sm font-medium">
                            Show Recommended (50%+)
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Most Relevant filter for logged-in users */}
                    {isSignedIn && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 mt-4">
                          Sort
                        </h4>
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-sky-50 transition">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={sortByRelevant}
                            onChange={() => setSortByRelevant((prev) => !prev)}
                          />
                          <span className="text-gray-600 text-sm font-medium">
                            Most Relevant
                          </span>
                        </label>
                      </div>
                    )}

                    <h4 className="font-semibold text-gray-900 my-3">Salary</h4>
                    <div className="space-y-2">
                      {[
                        "PKR 80,000 - 120,000",
                        "PKR 120,000 - 180,000",
                        "PKR 180,000+",
                      ].map((range) => (
                        <label
                          key={range}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={selectedSalary.includes(range)}
                            onChange={() => {
                              setSelectedSalary((prev) =>
                                prev.includes(range)
                                  ? prev.filter((r) => r !== range)
                                  : [...prev, range],
                              );
                            }}
                          />
                          <span className="text-gray-600 text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Company Rating
                    </h4>
                    <div className="space-y-2">
                      {[
                        { rating: 4.5, label: "4.5+ stars" },
                        { rating: 4, label: "4+ stars" },
                        { rating: 3.5, label: "3.5+ stars" },
                      ].map((item) => (
                        <label
                          key={item.rating}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={selectedRatings.includes(item.rating)}
                            onChange={() => {
                              setSelectedRatings((prev) =>
                                prev.includes(item.rating)
                                  ? prev.filter((r) => r !== item.rating)
                                  : [...prev, item.rating],
                              );
                            }}
                          />
                          <span className="text-gray-600 text-sm">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Posted Date
                    </h4>
                    <div className="space-y-2">
                      {["Last 7 days", "Last 30 days", "Last 90 days"].map(
                        (date) => (
                          <label
                            key={date}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-sky-700"
                              checked={selectedDates.includes(date)}
                              onChange={() => {
                                setSelectedDates((prev) =>
                                  prev.includes(date)
                                    ? prev.filter((d) => d !== date)
                                    : [...prev, date],
                                );
                              }}
                            />
                            <span className="text-gray-600 text-sm">
                              {date}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Jobs List */}
            <div className="flex-1">
              <div className="mb-6 fade-in animation-delay-200">
                <p className="text-gray-600">
                  Showing <strong>{filteredJobs.length}</strong> job
                  {filteredJobs.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (

                  filteredJobs.map((job) => (
                    <div key={job.id} className="fade-in">

{/* <!--                   filteredJobs.map((job, idx) => (
                    <div
                      key={job.id}
                      className="fade-in"
                      style={{ animationDelay: `${200 + idx * 100}ms` }}
                    > --> */}
                      <JobCard
                        job={job}
                        isApplied={reduxAppliedJobIds.includes(String(job.id))}
                      />
                    </div>
                  ))
                ) : (
                  <div className="card-base p-12 text-center fade-in animation-delay-300">
                    <BriefcasePlaceholder />
                    <p className="text-gray-600 text-lg">
                      No jobs found matching your criteria
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try adjusting your search filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .jobs-hero-mesh {
          background:
            radial-gradient(ellipse at 20% 50%, #1e40af44 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, #7c3aed33 0%, transparent 55%),
            radial-gradient(ellipse at 60% 80%, #0ea5e922 0%, transparent 50%);
        }
        .jobs-hero-grid {
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}

function BriefcasePlaceholder() {
  return (
    <div className="mx-auto mb-4">
      <svg
        className="w-12 h-12 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
          strokeWidth="1.5"
        />
        <path d="M8 7V6a4 4 0 0 1 8 0v1" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
