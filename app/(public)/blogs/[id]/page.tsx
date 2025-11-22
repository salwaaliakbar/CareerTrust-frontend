"use client";

import { useEffect } from "react";
import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getBlogById } from "@/src/store/slices/blogsSlice";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { selectedBlog: blog, loading, lastFetchTimeById } = useAppSelector(state => state.blogs);
  
  const blogId = Number(id);
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[blogId];
  const isCached = lastFetchTime && now - lastFetchTime < CACHE_DURATION && blog?.id === blogId;

  useEffect(() => {
    if (!isCached) {
      dispatch(getBlogById(id));
    }
  }, [id, isCached, dispatch]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Header />
        <main className="bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-600">Article not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="bg-gray-50 py-12 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 font-medium mb-8 smooth-enter-left animation-delay-100 transition-all duration-300 hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Header */}
          <header className="mb-10 fade-in animation-delay-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full smooth-enter animation-delay-300 transition-all duration-300 hover:scale-105">
                {blog.category}
              </span>
              <span className="text-sm text-gray-500 transition-colors duration-300 hover:text-gray-700">{blog.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight fade-in animation-delay-400">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b fade-in animation-delay-500">
              <div className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-x-1">
                <User className="w-5 h-5 text-sky-700" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-x-1">
                <Calendar className="w-5 h-5 text-sky-700" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-x-1">
                <Clock className="w-5 h-5 text-sky-700" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none fade-in animation-delay-600">
            <div 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Related Articles - To be implemented with API */}
          {/* <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              Related blogs will be fetched from API
            </div>
          </div> */}

          {/* Call to Action */}
          <div className="mt-12 bg-linear-to-r from-sky-700 to-sky-800 text-white p-8 rounded-2xl text-center fade-in animation-delay-700 shadow-lg hover:shadow-xl transition-all duration-500 group">
            <h3 className="text-2xl font-bold mb-3 transition-transform duration-300 group-hover:scale-105">Ready to advance your career?</h3>
            <p className="mb-6 opacity-90 transition-opacity duration-300 group-hover:opacity-100">
              Explore job opportunities from trusted employers on CareerTrust
            </p>
            <Link
              href="/jobs"
              className="inline-block px-6 py-3 bg-white text-sky-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Browse Jobs
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
