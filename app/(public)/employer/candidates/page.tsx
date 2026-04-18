"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { Candidate } from "@/services/api/employer.service";
import { JobseekerPublicProfile } from "@/services/api/profile.service";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  getEmployerCandidateDetail,
  getEmployerCandidates,
} from "@/redux/store/slices/employerCandidatesSlice";

const CandidatesPage = () => {
  const dispatch = useAppDispatch();
  const { isLoaded: isUserLoaded } = useUser();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();

  const {
    items: candidates,
    detailsByClerkId,
    loading,
    totalPages,
    totalCount,
  } = useAppSelector((state) => state.employerCandidates);

  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const isReady = isAuthLoaded && isUserLoaded;

  useEffect(() => {
    if (!isReady) return;

    let disposed = false;

    const loadCandidates = async () => {
      const token = await getToken();
      if (disposed) return;

      dispatch(
        getEmployerCandidates({
          page,
          limit: LIMIT,
          search,
          location,
          accessToken: token,
        }),
      );
    };

    loadCandidates();

    return () => {
      disposed = true;
    };
  }, [dispatch, getToken, isReady, page, search, location]);

  const prefetchCandidateDetail = useCallback(
    async (clerkId: string) => {
      if (!isReady || !clerkId) return;

      const token = await getToken();
      dispatch(
        getEmployerCandidateDetail({
          clerkId,
          accessToken: token,
        }),
      );
    },
    [dispatch, getToken, isReady],
  );

  const handleSearch = () => {
    setSearch(searchInput);
    setLocation(locationInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setSearch("");
    setLocation("");
    setPage(1);
  };

  const hasFilters = Boolean(search || location);

  return (
    <>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />
      <main className="min-h-screen bg-[#F4F6FB] pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-size-[40px_40px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

            <div className="relative z-10 px-7 py-10 sm:px-10 sm:py-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Talent Discovery
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-black/20 backdrop-blur-sm">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                        Browse Candidates
                      </h1>
                     
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100/85 sm:text-base">
                    Search by name, location, headline, or skill and open full profiles directly from the talent grid.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by jobseeker name, headline, summary, or skill..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 transition-all duration-200 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                />
              </div>

              <div className="relative sm:w-64">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 transition-all duration-200 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#0C2B4E] to-[#1D546C] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(12,43,78,0.45)] transition-all duration-200 hover:from-[#1A3D64] hover:to-[#2A5A7F] hover:shadow-[0_16px_28px_-14px_rgba(12,43,78,0.55)]"
                >
                  Search
                </button>
                {hasFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Results Info & Pagination Header */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {loading
                    ? "Loading candidates..."
                    : candidates.length > 0
                      ? `Showing ${candidates.length} candidate${candidates.length !== 1 ? "s" : ""}`
                      : "No candidates to display"}
                </p>
                <p className="text-xs text-slate-500">
                  {!loading && totalCount > 0 && (
                    <>
                      Total: <span className="font-semibold text-slate-700">{totalCount}</span> candidate
                      {totalCount !== 1 ? "s" : ""} • Page{" "}
                      <span className="font-semibold text-slate-700">{page}</span> of{" "}
                      <span className="font-semibold text-slate-700">{totalPages}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Employer View
              </div>
            </div>
          </section>

          {loading ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 gap-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="font-medium text-slate-500">Loading candidates</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-24 gap-4 text-center shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-700">No candidates found</p>
              <p className="max-w-sm text-slate-400">
                {hasFilters
                  ? "Try adjusting your search filters"
                  : "No candidate profiles are available yet"}
              </p>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  detailedProfile={detailsByClerkId[candidate.clerkId]}
                  onPrefetchDetail={prefetchCandidateDetail}
                />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Page <span className="font-bold text-blue-600">{page}</span> of{" "}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`h-8 w-8 rounded-md text-xs font-semibold transition-all ${
                            page === pageNum
                              ? "bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white shadow-sm"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-600"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-500">
                  Total: <span className="font-semibold text-slate-700">{totalCount}</span> candidates
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

const CandidateCard = ({
  candidate,
  detailedProfile,
  onPrefetchDetail,
}: {
  candidate: Candidate;
  detailedProfile?: JobseekerPublicProfile;
  onPrefetchDetail: (clerkId: string) => void;
}) => {
  const fullName =
    detailedProfile?.fullName?.trim() ||
    candidate.fullName?.trim() ||
    "Unnamed Candidate";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  const experienceText =
    detailedProfile?.totalExperience?.trim() ||
    candidate.totalExperience?.trim() ||
    (typeof (detailedProfile?.totalExperienceYears ?? candidate.totalExperienceYears) === "number"
      ? `${detailedProfile?.totalExperienceYears ?? candidate.totalExperienceYears} year${(detailedProfile?.totalExperienceYears ?? candidate.totalExperienceYears) === 1 ? "" : "s"}`
      : null);

  const headline = detailedProfile?.headline || candidate.headline;
  const summary = detailedProfile?.summary || candidate.summary;
  const location = detailedProfile?.location || candidate.location;
  const skillNames =
    detailedProfile?.skills?.map((skill) => skill.skillName) || candidate.skills;

  return (
    <Link
      href={`/profile/${candidate.clerkId}`}
      onMouseEnter={() => onPrefetchDetail(candidate.clerkId)}
      onFocus={() => onPrefetchDetail(candidate.clerkId)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0C2B4E]/40 hover:shadow-[0_24px_50px_-28px_rgba(12,43,78,0.28)]"
    >
      <div className="h-1 w-full bg-linear-to-r from-[#0C2B4E] via-[#1D546C] to-cyan-500" />

      <div className="border-b border-slate-100 p-5 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#EAF3F9] to-[#D8E8F1] shadow-[0_12px_24px_-16px_rgba(12,43,78,0.45)] ring-2 ring-white transition-all duration-300 group-hover:scale-105 group-hover:ring-[#0C2B4E]/20">
          {candidate.profilePicUrl ? (
            <Image
              src={candidate.profilePicUrl}
              alt={fullName}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-blue-600">{initials}</span>
          )}
        </div>

        <h3 className="text-base font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-700">
          {fullName}
        </h3>

        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Candidate Profile
        </p>

        {headline && (
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-500">
            {headline}
          </p>
        )}

        {!headline && summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-500">
            {summary}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {location && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0C2B4E] shadow-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
            </span>
            <span className="truncate font-medium">{location}</span>
          </div>
        )}

        {experienceText && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0C2B4E] shadow-sm">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
            </span>
            <span className="font-medium">{experienceText}</span>
          </div>
        )}

        {skillNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skillNames.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#0C2B4E]/10 bg-[#0C2B4E]/6 px-2.5 py-1 text-xs font-semibold text-[#0C2B4E] transition-colors group-hover:border-[#0C2B4E]/20 group-hover:bg-[#0C2B4E]/10"
              >
                {skill}
              </span>
            ))}
            {skillNames.length > 4 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">
                +{skillNames.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0C2B4E]/15 bg-[#0C2B4E]/5 py-2.5 text-sm font-semibold text-[#0C2B4E] transition-all duration-200 group-hover:bg-linear-to-r group-hover:from-[#0C2B4E] group-hover:to-[#1D546C] group-hover:text-white group-hover:border-[#0C2B4E]">
          View Profile
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};

export default CandidatesPage;

