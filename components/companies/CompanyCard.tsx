"use client";
import Link from "next/link";
import { Star, Users, Briefcase, MapPin } from "lucide-react";

type Company = {
  id: number | string;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
};

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.id}`}
      className="relative card-base p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 flex flex-col h-full justify-between overflow-hidden shadow-lg smooth-enter card-hover group"
      aria-label={`View ${company.name}`}
      title={`View ${company.name}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/40 group-hover:via-blue-50/20 group-hover:to-blue-50/40 transition-all duration-500 pointer-events-none" />

      {/* Left accent strip - animated */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-gray-200 via-primary/40 to-gray-200 group-hover:bg-linear-to-b group-hover:from-primary group-hover:via-primary/60 group-hover:to-primary transition-all duration-500 rounded-full" aria-hidden="true" />

      <div className="relative z-10">
        {/* Logo - animated */}
        <div className="w-20 h-20 bg-linear-to-br from-[#0C2B4E] to-[#1D546C] rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:ring-blue-100">
          <span className="text-white font-bold text-lg transition-transform duration-300 group-hover:rotate-12">{company.logo}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">{company.name}</h3>
        <p className="text-sm text-gray-500 mb-3">
          <span className="inline-block bg-linear-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold group-hover:from-primary/10 group-hover:to-primary/5 group-hover:text-primary transition-all duration-300">{company.industry}</span>
        </p>

        <p className="text-gray-600 text-sm mb-4 grow group-hover:text-gray-700 transition-colors duration-300">{company.description}</p>

        <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 text-sm transition-all duration-300 group-hover:text-primary">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900 group-hover:text-primary">{company.rating}</span>
            <span className="text-gray-500 group-hover:text-primary/70">({company.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 group-hover:text-primary">
            <Users className="w-4 h-4" />
            <span>{company.employees.toLocaleString()} employees</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 group-hover:text-primary">
            <Briefcase className="w-4 h-4" />
            <span>{company.openJobs} open positions</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 group-hover:text-primary">
            <MapPin className="w-4 h-4" />
            <span>{company.location}, Pakistan</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white py-3 rounded-lg font-semibold transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group-hover:from-primary group-hover:to-primary/80" type="button" aria-label={`View ${company.name}`}>
        View Company
      </button>
    </Link>
  );
}
