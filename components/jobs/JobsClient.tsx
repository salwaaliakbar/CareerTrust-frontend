"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllJobs, getJobLocations } from "@/redux/store/slices/jobsSlice";
import {
  fetchUserApplications,
  selectAppliedJobIds,
} from "@/redux/store/slices/jobseeker/applicationsSlice";
import { useUser } from "@clerk/nextjs";

const PAGE_SIZE = 12;

export default function JobsClient() {
  const dispatch = useAppDispatch();
  const { items: jobs, loading, totalCount, totalPages, currentPage, locations } =
    useAppSelector((state) => state.jobs);
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

  const appliedSearchTerm = searchParams.get("q") || "";
  const appliedLocation = searchParams.get("location") || "";
  const appliedFilter = searchParams.get("filter") || "";
  const appliedPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  useEffect(() => {
    setSearchTerm(appliedSearchTerm);
    setSelectedLocation(appliedLocation);
    const isRecommended = appliedFilter === "recommended";
    setRecommendedOnly(isRecommended);
    setSortByRelevant(isRecommended);
  }, [appliedSearchTerm, appliedLocation, appliedFilter]);

  useEffect(() => {
    if (!isLoaded) return;
    dispatch(getJobLocations());
  }, [dispatch, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const clerkId = isSignedIn && user?.id ? user.id : undefined;
    dispatch(
      getAllJobs({
        clerkId,
        page: appliedPage,
        limit: PAGE_SIZE,
        search: appliedSearchTerm,
        location: appliedLocation,
      }),
    );
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    user?.id,
    appliedPage,
    appliedSearchTerm,
    appliedLocation,
  ]);

  useEffect(() => {
    if (user?.id && reduxAppliedJobIds.length === 0) {
      dispatch(fetchUserApplications({ forceRefresh: false }));
    }
  }, [user?.id, reduxAppliedJobIds.length, dispatch]);

  const getMatchPercentage = (job: unknown) => {
    const value = (job as { matchPercentage?: unknown })?.matchPercentage;
    return typeof value === "number" ? value : 0;
  };

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      if (recommendedOnly && getMatchPercentage(job) < 50) {
        return false;
      }

      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !selectedLocation ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      let matchesSalary = true;
      if (selectedSalary.length > 0) {
        let salaryNum = 0;
        if (typeof job.salary === "number") {
          salaryNum = job.salary;
        } else if (typeof job.salary === "string") {
          salaryNum = Number.parseInt(job.salary.replace(/[^\d]/g, ""), 10);
        }
        matchesSalary = selectedSalary.some((range) => {
          if (range === "PKR 80,000 - 120,000") {
            return salaryNum >= 80000 && salaryNum <= 120000;
          }
          if (range === "PKR 120,000 - 180,000") {
            return salaryNum > 120000 && salaryNum <= 180000;
          }
          if (range === "PKR 180,000+") {
            return salaryNum > 180000;
          }
          return false;
        });
      }

      let matchesRating = true;
      if (selectedRatings.length > 0) {
        matchesRating = selectedRatings.some((rating) => (job.rating || 0) >= rating);
      }

      let matchesDate = true;
      if (selectedDates.length > 0) {
        matchesDate = selectedDates.some((date) => {
          if (!job.postedDate) return false;
          const posted = new Date(job.postedDate);
          const now = new Date();
          const diffDays = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24);
          if (date === "Last 7 days") return diffDays <= 7;
          if (date === "Last 30 days") return diffDays <= 30;
          if (date === "Last 90 days") return diffDays <= 90;
          return false;
        });
      }

      return matchesSearch && matchesLocation && matchesSalary && matchesRating && matchesDate;
    });

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

  const pushJobsRoute = (nextPage: number, nextSearch: string, nextLocation: string, nextRecommendedOnly: boolean) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("q", nextSearch);
    if (nextLocation) params.set("location", nextLocation);
    if (nextRecommendedOnly) params.set("filter", "recommended");
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApply = () => {
    pushJobsRoute(1, searchTerm, selectedLocation, recommendedOnly);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedSalary([]);
    setSelectedRatings([]);
    setSelectedDates([]);
    setRecommendedOnly(false);
    setSortByRelevant(false);
    router.push("/jobs");
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    pushJobsRoute(nextPage, appliedSearchTerm, appliedLocation, recommendedOnly);
  };

  const pageButtons = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const pages = [] as number[];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  const locationsToRender = locations.length > 0 ? locations : [];

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

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
                >
                  <option value="">All locations</option>
                  {locationsToRender.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2.5 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-100"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
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
            <aside className="md:w-64 shrink-0 fade-in animation-delay-300">
              <div className="card-base p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-sky-700" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    {isSignedIn && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
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

                    {isSignedIn && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 mt-4">Sort</h4>
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-sky-50 transition">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={sortByRelevant}
                            onChange={() => setSortByRelevant((prev) => !prev)}
                          />
                          <span className="text-gray-600 text-sm font-medium">Most Relevant</span>
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
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={selectedSalary.includes(range)}
                            onChange={() => {
                              setSelectedSalary((prev) =>
                                prev.includes(range)
                                  ? prev.filter((value) => value !== range)
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
                    <h4 className="font-semibold text-gray-900 mb-3">Company Rating</h4>
                    <div className="space-y-2">
                      {[
                        { rating: 4.5, label: "4.5+ stars" },
                        { rating: 4, label: "4+ stars" },
                        { rating: 3.5, label: "3.5+ stars" },
                      ].map((item) => (
                        <label key={item.rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={selectedRatings.includes(item.rating)}
                            onChange={() => {
                              setSelectedRatings((prev) =>
                                prev.includes(item.rating)
                                  ? prev.filter((rating) => rating !== item.rating)
                                  : [...prev, item.rating],
                              );
                            }}
                          />
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
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-sky-700"
                            checked={selectedDates.includes(date)}
                            onChange={() => {
                              setSelectedDates((prev) =>
                                prev.includes(date)
                                  ? prev.filter((value) => value !== date)
                                  : [...prev, date],
                              );
                            }}
                          />
                          <span className="text-gray-600 text-sm">{date}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 fade-in animation-delay-200 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-gray-600">
                  Showing <strong>{filteredJobs.length}</strong> of <strong>{totalCount}</strong> jobs
                </p>
                <p className="text-gray-500 text-sm">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </p>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="fade-in">
                      <JobCard
                        job={job}
                        isApplied={reduxAppliedJobIds.includes(String(job.id))}
                      />
                    </div>
                  ))
                ) : (
                  <div className="card-base p-12 text-center fade-in animation-delay-300">
                    <div className="mx-auto mb-4">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
                    </div>
                    <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {pageButtons.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-10 px-4 py-2 rounded-xl border font-semibold transition-colors ${
                        page === currentPage
                          ? "bg-[#0B1F45] text-white border-[#0B1F45]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
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
