"use client";
import { useMemo, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import BlogCard from "@/components/blogs/BlogCard";
import { useSearchParams, useRouter } from "next/navigation";

type Blog = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
};

export default function BlogsClient({ blogs }: { blogs: Blog[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  // initialize filters from URL
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    Promise.resolve().then(() => {
      setSearchTerm(q);
      setSelectedCategory(cat);
    });
  }, [searchParams]);

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.category))).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        blog.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#0C2B4E] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Career Insights & Tips</h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl">
            Stay updated with the latest career advice, industry trends, and professional development tips
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <select
              aria-label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchTerm) params.set("q", searchTerm);
                  if (selectedCategory) params.set("category", selectedCategory);
                  router.push(`/blogs${params.toString() ? `?${params.toString()}` : ""}`);
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium shadow-sm hover:bg-amber-600"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  router.push(`/blogs`);
                }}
                className="px-3 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="card-base p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-sky-700" />
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ""}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 rounded border-gray-300 text-sky-700"
                  />
                  <span className="text-gray-600 text-sm">All Categories</span>
                </label>

                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 rounded border-gray-300 text-sky-700"
                    />
                    <span className="text-gray-600 text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Blogs Grid */}
          <div className="flex-1">
            <div className="mb-8">
              <p className="text-gray-600">
                Showing <strong>{filteredBlogs.length}</strong> article{filteredBlogs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => <BlogCard key={blog.id} {...blog} />)
              ) : (
                <div className="col-span-full card-base p-12 text-center">
                  <BookPlaceholder />
                  <p className="text-gray-600 text-lg">No articles found</p>
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
