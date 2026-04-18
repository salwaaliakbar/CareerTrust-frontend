import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

type BlogCardProps = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
};

export default function BlogCard({
  id,
  title,
  excerpt,
  author,
  date,
  category,
  readTime,
  image,
}: BlogCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-blue-100/80 bg-linear-to-br from-white via-blue-50/30 to-white shadow-[0_8px_22px_-16px_rgba(37,99,235,0.35)] hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)] hover:border-blue-200 transition-all duration-300">
      {/* Top accent */}
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/35 group-hover:to-blue-50/55 transition-all duration-500 pointer-events-none" />

      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <div className="w-full h-full bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <span className="text-white text-4xl font-black opacity-25 transition-opacity duration-300 group-hover:opacity-35">{category.charAt(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full transition-all duration-300 group-hover:bg-blue-200 group-hover:shadow-md group-hover:scale-105">
            {category}
          </span>
          <span className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-700">{readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 transition-all duration-300 group-hover:text-blue-700 group-hover:translate-x-0.5">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 transition-colors duration-300 group-hover:text-slate-700">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200 transition-all duration-300 group-hover:border-blue-200">
          <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-blue-700 group-hover:translate-x-0.5">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-blue-700 group-hover:translate-x-0.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center gap-2 text-blue-700 font-semibold transition-all duration-300 hover:gap-3 group-hover:text-blue-900"
        >
          Read Article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
