"use client";

import { useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Users, Briefcase, MapPin, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCompanyById } from "@/src/store/slices/companiesSlice";

export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { selectedCompany: company, loading, lastFetchTimeById } = useAppSelector(state => state.companies);
  
  const companyId = Number(id);
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[companyId];
  const isCached = lastFetchTime && now - lastFetchTime < CACHE_DURATION && company?.id === companyId;

  useEffect(() => {
    if (!isCached) {
      dispatch(getCompanyById(id));
    }
  }, [id, isCached, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading company...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Link href="/companies" className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Companies
          </Link>
          <div className="card-base p-8 text-center">
            <p className="text-gray-600 text-lg">Company not found</p>
            <p className="text-gray-500 text-sm mt-2">The company you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link href="/companies" className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6 smooth-enter-left animation-delay-100 transition-all duration-300 hover:translate-x-1">
          <ArrowLeft className="w-5 h-5" />
          Back to Companies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 smooth-enter animation-delay-200">
            <div className="card-base p-8 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="smooth-enter animation-delay-300">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  <p className="text-xl text-gray-600 font-semibold">{company.industry}</p>
                  <p className="text-sm text-gray-500 mt-2">{company.location}, Pakistan</p>
                </div>
                <div className="flex flex-col items-end gap-3 smooth-enter-right animation-delay-400">
                  <div className="w-20 h-20 bg-linear-to-br from-[#0C2B4E] to-[#1D546C] rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-lg">
                    <span className="text-white font-bold text-lg">{company.logo}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{company.openJobs} Open</div>
                    <div className="text-sm text-gray-500">Positions</div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300">{company.description}</div>

              <div className="flex gap-6 text-sm fade-in animation-delay-500">
                <div className="p-4 bg-yellow-50/50 rounded-lg hover:bg-yellow-100/50 transition-colors duration-300">
                  <p className="text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{company.rating}</span>
                    <span className="text-gray-500">({company.reviews} reviews)</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-colors duration-300">
                  <p className="text-gray-500 mb-1">Employees</p>
                  <p className="font-semibold text-gray-900">{company.employees.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50/50 rounded-lg hover:bg-green-100/50 transition-colors duration-300">
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{company.location}</p>
                </div>
              </div>
            </div>

            <div className="card-base p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Positions at {company.name}</h2>
              <div className="space-y-4">
                {Array.from({ length: company.openJobs }).map((_, idx) => (
                  <Link key={idx} href={`/jobs`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-300 group fade-in" style={{animationDelay: `${600 + idx * 100}ms`}}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">{`Position ${idx + 1}`}</h3>
                        <p className="text-xs text-gray-600">Location: {company.location}</p>
                      </div>
                      <div className="text-sm text-gray-500 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">Apply →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="smooth-enter-right animation-delay-300">
            <div className="card-base p-6 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-400">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                  <Users className="w-4 h-4" />
                  <span>{company.employees.toLocaleString()} employees</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50/50 rounded-lg hover:bg-green-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{company.openJobs} open positions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-purple-50/50 rounded-lg hover:bg-purple-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
              </div>
            </div>

            <div className="card-base p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow</h3>
              <p className="text-sm text-gray-600 mb-3">Get updates when {company.name} posts new jobs.</p>
              <button type="button" className="w-full btn-primary bg-linear-to-r from-primary to-primary/80 text-gray-900 font-bold py-2 rounded-lg transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">Follow Company</button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
