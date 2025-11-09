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
      className="relative card-base p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-shadow flex flex-col h-full justify-between overflow-hidden shadow-2xl"
      aria-label={`View ${company.name}`}
      title={`View ${company.name}`}
    >
      {/* Left accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" aria-hidden="true" />

      {/* Logo */}
      <div className="w-20 h-20 bg-[#0C2B4E] rounded-full flex items-center justify-center mb-4 shadow-md ring-4 ring-white">
        <span className="text-white font-bold text-lg">{company.logo}</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{company.name}</h3>
        <p className="text-sm text-gray-500 mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">{company.industry}</span>
        </p>

        <p className="text-gray-600 text-sm mb-4 grow">{company.description}</p>

        <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{company.rating}</span>
            <span className="text-gray-500">({company.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{company.employees.toLocaleString()} employees</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{company.openJobs} open positions</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{company.location}, Pakistan</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#0C2B4E] text-white py-2 rounded-lg font-semibold transition-colors shadow-md" type="button" aria-label={`View ${company.name}`}>
        View Company
      </button>
    </Link>
  );
}
