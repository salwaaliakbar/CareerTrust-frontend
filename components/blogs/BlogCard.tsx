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
    <article className="card-base overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-linear-to-r from-sky-400 to-sky-600 flex items-center justify-center">
          <span className="text-white text-4xl font-bold opacity-20">{category.charAt(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
            {category}
          </span>
          <span className="text-xs text-gray-500">{readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-sky-700">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center gap-2 text-sky-700 font-medium hover:gap-3 transition-all duration-200"
        >
          Read Article
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
