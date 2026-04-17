"use client";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import CompanyCard from "@/components/companies/CompanyCard";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  getAllCompanies,
  getCompanyReputations,
} from "@/redux/store/slices/companiesSlice";
import { useSearchParams, useRouter } from "next/navigation";

const PAGE_SIZE = 12;

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items: companies,
    loading,
    totalCount,
    currentPage,
    totalPages,
    reputationById,
  } = useAppSelector((state) => state.companies);

  const appliedSearchTerm = searchParams.get("q") || "";
  const appliedPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  useEffect(() => {
    dispatch(
      getAllCompanies({
        page: appliedPage,
        limit: PAGE_SIZE,
        search: appliedSearchTerm,
      }),
    );
  }, [dispatch, appliedPage, appliedSearchTerm]);

  useEffect(() => {
    setSearchTerm(appliedSearchTerm);
  }, [appliedSearchTerm]);

  useEffect(() => {
    if (!companies.length) return;
    dispatch(getCompanyReputations(companies.map((company) => company.id)));
  }, [dispatch, companies]);

  const pushCompaniesRoute = (nextPage: number, nextSearch: string) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("q", nextSearch);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/companies${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearch = () => {
    pushCompaniesRoute(1, searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    router.push("/companies");
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    pushCompaniesRoute(nextPage, appliedSearchTerm);
  };

  const pageButtons = (() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const pages = [] as number[];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  })();

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <Header />

      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Hero Section */}
      <section className="px-2 sm:px-4 lg:px-6 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 jobs-hero-mesh" />
            <div className="absolute inset-0 opacity-[0.05] jobs-hero-grid" />
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.22)_1px,transparent_1px)] bg-size-[34px_34px]" />
            <div className="absolute top-8 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
            <div className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-800" />

            <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-6 sm:py-10 lg:py-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <Search className="w-4 h-4 text-blue-300/80" />
                  <span className="text-blue-300/80 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                    Company Explorer
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight fade-in">
                  Discover Top Companies
                </h1>
                <p className="mt-3 text-blue-200/80 text-sm sm:text-base max-w-2xl leading-relaxed fade-in animation-delay-100">
                  Find trusted employers, read verified reviews, and explore career opportunities.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-3xl fade-in animation-delay-200">
                <div className="md:col-span-2 relative group">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300 group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Company name, industry..."
                    className="w-full pl-10 pr-4 py-3 bg-white/95 text-slate-900 rounded-xl border border-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] transition-all duration-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-100"
                  >
                    Search
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

      {/* Companies Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-400 tracking-widest uppercase">Loading companies</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 fade-in animation-delay-200">
              <p className="text-slate-600 text-base">
                Showing <strong className="text-slate-900 font-bold">{companies.length}</strong>{' '}
                of <strong className="text-slate-900 font-bold">{totalCount}</strong>{' '}
                {totalCount !== 1 ? "companies" : "company"}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </p>
            </div>

            {companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="fade-in animation-delay-100">
                    <CompanyCard
                      company={{
                        ...company,
                        rating:
                          reputationById[String(company.id)]?.reputationScore ??
                          company.rating,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center fade-in animation-delay-300">
                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-semibold">No companies found matching your search</p>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your search terms</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {pageButtons.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-9 min-w-9 px-2 rounded-lg border text-sm font-semibold ${
                      page === currentPage
                        ? "bg-sky-700 border-sky-700 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
