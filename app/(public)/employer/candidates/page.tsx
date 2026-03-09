"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  Star,
} from "lucide-react";
import { fetchAllCandidates, Candidate } from "@/services/api/employer.service";

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: "Entry Level",
  junior: "Junior",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

const CandidatesPage = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isLoaded: isAuthLoaded } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  const isReady = isAuthLoaded && isUserLoaded;

  const loadCandidates = useCallback(async () => {
    if (!isReady) return;

    setLoading(true);
    try {
      const result = await fetchAllCandidates(
        { page, limit: LIMIT, search, location },
        getToken,
      );
      if (result) {
        setCandidates(result.candidates);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error("[Candidates Page] Error:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, page, search, location, getToken]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

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

  const hasFilters = search || location;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/employer/dashboard"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Browse Candidates
                </h1>
                <p className="text-slate-500 mt-0.5">
                  {total > 0
                    ? `${total} candidate${total !== 1 ? "s" : ""} found`
                    : "Discover talent for your team"}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, headline, or bio..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="sm:w-56 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Search
              </button>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Candidate Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Loading candidates…</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-700">
                No candidates found
              </p>
              <p className="text-slate-400 max-w-sm">
                {hasFilters
                  ? "Try adjusting your search filters"
                  : "No candidate profiles are available yet"}
              </p>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="text-sm text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  const fullName =
    [candidate.firstName, candidate.lastName].filter(Boolean).join(" ") ||
    "Unnamed Candidate";

  const initials =
    [candidate.firstName?.[0], candidate.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  return (
    <Link
      href={`/profile/${candidate.clerkId}`}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Card Top */}
      <div className="p-5 flex flex-col items-center text-center border-b border-slate-100">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-3 ring-2 ring-white shadow group-hover:ring-blue-200 transition-all">
          {candidate.profilePhoto ? (
            <Image
              src={candidate.profilePhoto}
              alt={fullName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-blue-600">{initials}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-700 transition-colors">
          {fullName}
        </h3>

        {/* Headline */}
        {candidate.headline && (
          <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-snug">
            {candidate.headline}
          </p>
        )}
      </div>

      {/* Card Bottom */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Location */}
        {candidate.location && (
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{candidate.location}</span>
          </div>
        )}

        {/* Experience Level */}
        {candidate.experienceLevel && (
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {EXPERIENCE_LABELS[candidate.experienceLevel] ??
                candidate.experienceLevel}
            </span>
          </div>
        )}

        {/* Skills */}
        {candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {candidate.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs font-medium rounded-full border border-slate-200">
                +{candidate.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <div className="w-full text-center py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
          View Profile
        </div>
      </div>
    </Link>
  );
};

export default CandidatesPage;
