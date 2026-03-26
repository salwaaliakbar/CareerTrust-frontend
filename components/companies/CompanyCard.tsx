"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Users, Briefcase, MapPin, ArrowUpRight } from "lucide-react";

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
  const [failedLogoSrc, setFailedLogoSrc] = useState("");

  const hasLogo =
    !!company.logo &&
    (company.logo.startsWith("http") || company.logo.startsWith("/")) &&
    failedLogoSrc !== company.logo;

  const initials = company.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/companies/${company.id}`}
      className="group relative flex flex-col h-full bg-linear-to-br from-white via-blue-50/30 to-white rounded-2xl border border-blue-100/80 shadow-[0_8px_22px_-16px_rgba(37,99,235,0.35)] hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      aria-label={`View ${company.name}`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">

        {/* Header: logo + industry badge */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo */}
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] flex items-center justify-center shadow-md ring-2 ring-white group-hover:ring-blue-100 group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
            {hasLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={() => setFailedLogoSrc(company.logo)}
              />
            ) : (
              <span className="text-white font-bold text-base tracking-wide">{initials}</span>
            )}
          </div>

          {/* Industry badge */}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-300">
            {company.industry}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-1 leading-tight">
          {company.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-slate-400 mb-3">
          <MapPin className="w-3 h-3" />
          <span>{company.location}, Pakistan</span>
        </div>

        {/* Description */}
        <p className="text-base text-slate-600 leading-relaxed mb-5 flex-1 line-clamp-3">
          {company.description}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-all duration-200">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{Number(company.rating || 0).toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400">reputation</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-all duration-200">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="text-sm font-bold text-slate-800">{company.employees >= 1000 ? `${(company.employees / 1000).toFixed(0)}k` : company.employees}</span>
            </div>
            <span className="text-xs text-slate-400">employees</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-all duration-200">
            <div className="flex items-center gap-0.5 mb-0.5">
              <Briefcase className="w-3 h-3 text-blue-400" />
              <span className="text-sm font-bold text-slate-800">{company.openJobs}</span>
            </div>
            <span className="text-xs text-slate-400">open roles</span>
          </div>
        </div>

        {/* CTA button */}
        <button
          type="button"
          aria-label={`View ${company.name}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779] text-white text-base font-bold transition-all duration-300 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.5)] hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.7)] active:scale-95"
        >
          View Company
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </div>
    </Link>
  );
}