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
    <article className="card-base overflow-hidden smooth-enter card-hover group relative border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-sky-50/0 to-sky-50/0 group-hover:from-sky-50/40 group-hover:to-sky-50/60 transition-all duration-500 pointer-events-none" />

      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-linear-to-r from-sky-400 to-sky-600 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <span className="text-white text-4xl font-bold opacity-20 transition-opacity duration-300 group-hover:opacity-30">{category.charAt(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full transition-all duration-300 group-hover:bg-sky-200 group-hover:shadow-md group-hover:scale-105">
            {category}
          </span>
          <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">{readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 transition-all duration-300 group-hover:text-sky-700 group-hover:translate-x-1">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200 transition-all duration-300 group-hover:border-sky-200">
          <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-sky-700 group-hover:translate-x-0.5">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-sky-700 group-hover:translate-x-0.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center gap-2 text-sky-700 font-medium transition-all duration-300 hover:gap-3 group-hover:text-sky-900"
        >
          Read Article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
