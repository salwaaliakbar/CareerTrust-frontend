"use client";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import BlogCard from "@/components/blogs/BlogCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllBlogs } from "@/redux/store/slices/blogsSlice";

const PAGE_SIZE = 12;

export default function BlogsClient() {
  const dispatch = useAppDispatch();
  const { items: blogs, loading, totalCount, currentPage, totalPages } = useAppSelector(
    (state) => state.blogs,
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const appliedSearchTerm = searchParams.get("q") || "";
  const appliedCategory = searchParams.get("category") || "";
  const [searchTerm, setSearchTerm] = useState(appliedSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(appliedCategory);
  const appliedPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  useEffect(() => {
    dispatch(
      getAllBlogs({
        page: appliedPage,
        limit: PAGE_SIZE,
        search: appliedSearchTerm,
        category: appliedCategory,
      }),
    );
  }, [dispatch, appliedPage, appliedSearchTerm, appliedCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.category))).sort();
  }, [blogs]);

  const pushBlogsRoute = (nextPage: number, nextSearch: string, nextCategory: string) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("q", nextSearch);
    if (nextCategory) params.set("category", nextCategory);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/blogs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApply = () => {
    pushBlogsRoute(1, searchTerm, selectedCategory);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("");
    router.push("/blogs");
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    pushBlogsRoute(nextPage, appliedSearchTerm, appliedCategory);
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

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-8 pb-14 sm:pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)] overflow-hidden">
          <div className="absolute inset-0" />
          <div className="relative bg-[#0B1F45] text-white px-6 sm:px-8 lg:px-10 py-9 sm:py-10">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Editorial Hub
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 fade-in">
                Career Insights & Tips
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl fade-in animation-delay-100">
                Stay updated with the latest career advice, industry trends, and professional development tips.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 max-w-4xl fade-in animation-delay-200">
                <div className="md:col-span-5 relative group">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 transition-colors duration-300 group-hover:text-blue-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 bg-white/95 text-slate-900 rounded-xl border border-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] transition-all duration-300"
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    aria-label="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/95 text-slate-900 rounded-xl border border-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] transition-all duration-300"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 px-4 py-3 bg-[#f4c56a] text-[#0C2B4E] rounded-xl font-semibold shadow-sm hover:bg-[#f4c56a]/90 transition-all duration-300 active:scale-95"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-white/95 text-slate-700 rounded-xl border border-blue-100/70 hover:bg-slate-50 transition-all duration-300 active:scale-95"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading articles...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0 fade-in animation-delay-300">
              <div className="card-base p-6 sticky top-24 rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.45)]">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-bold text-slate-900">Categories</h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-700"
                    />
                    <span className="text-slate-600 text-sm">All Categories</span>
                  </label>

                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-700"
                      />
                      <span className="text-slate-600 text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Blogs Grid */}
            <div className="flex-1">
              <div className="mb-8">
                <p className="text-slate-600">
                  Showing <strong>{blogs.length}</strong> of <strong>{totalCount}</strong> article{totalCount !== 1 ? "s" : ""}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div key={blog.id} className="fade-in animation-delay-400">
                      <BlogCard {...blog} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full card-base p-12 text-center fade-in animation-delay-400">
                    <BookPlaceholder />
                    <p className="text-slate-600 text-lg">No articles found</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your search filters</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40"
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
                          ? "bg-blue-700 border-blue-700 text-white"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BookPlaceholder() {
  return (
    <div className="mx-auto mb-4">
      <svg className="w-12 h-12 text-gray-300 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="1.5" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
