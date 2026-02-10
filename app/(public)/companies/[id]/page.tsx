"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompanyEditForm from "@/components/companies/CompanyEditForm";
import { Star, Users, Briefcase, MapPin, ArrowLeft, Edit2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getCompanyById } from "@/redux/store/slices/companiesSlice";
import { Company } from "@/types/company.types";

export default function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const {
    selectedCompany: company,
    loading,
    lastFetchTimeById,
  } = useAppSelector((state) => state.companies);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  const companyId = Number(id);
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[companyId];
  const isCached =
    lastFetchTime &&
    now - lastFetchTime < CACHE_DURATION &&
    company?.id === companyId;

  // Check if current user is the company owner (employer role)
  const userRole = user?.unsafeMetadata?.role as string | undefined;
  const isCompanyOwner = userRole === "employer"; // You can add more specific checks like company userId match

  useEffect(() => {
    if (!isCached) {
      dispatch(getCompanyById(id));
    }
  }, [id, isCached, dispatch]);

  useEffect(() => {
    if (company) {
      setCurrentCompany(company);
    }
  }, [company]);

  const handleEditSuccess = (updatedCompany: Company) => {
    setCurrentCompany(updatedCompany);
    setIsEditing(false);
    // Refresh the company data
    dispatch(getCompanyById(id));
  };

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

  if (!currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Companies
          </Link>
          <div className="card-base p-8 text-center">
            <p className="text-gray-600 text-lg">Company not found</p>
            <p className="text-gray-500 text-sm mt-2">
              The company you're looking for doesn't exist or has been removed.
            </p>
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
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold smooth-enter-left animation-delay-100 transition-all duration-300 hover:translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Companies
          </Link>
          {isCompanyOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-all duration-300 smooth-enter animation-delay-100"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <CompanyEditForm
            company={currentCompany}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 smooth-enter animation-delay-200">
              <div className="card-base p-8 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="smooth-enter animation-delay-300">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {currentCompany.name}
                    </h1>
                    <p className="text-xl text-gray-600 font-semibold">
                      {currentCompany.industry}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {currentCompany.location}, Pakistan
                    </p>
                    {currentCompany.website && (
                      <a
                        href={currentCompany.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-1 inline-block"
                      >
                        {currentCompany.website}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 smooth-enter-right animation-delay-400">
                    <div className="w-20 h-20 bg-linear-to-br from-[#0C2B4E] to-[#1D546C] rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {currentCompany.logo}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {currentCompany.openJobs} Open
                      </div>
                      <div className="text-sm text-gray-500">Positions</div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 mb-6 hover:text-gray-700 transition-colors duration-300">
                  {currentCompany.description}
                </div>

                <div className="flex gap-6 text-sm fade-in animation-delay-500 flex-wrap">
                  <div className="p-4 bg-yellow-50/50 rounded-lg hover:bg-yellow-100/50 transition-colors duration-300">
                    <p className="text-gray-500 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {currentCompany.rating}
                      </span>
                      <span className="text-gray-500">
                        ({currentCompany.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-colors duration-300">
                    <p className="text-gray-500 mb-1">Employees</p>
                    <p className="font-semibold text-gray-900">
                      {currentCompany.employees.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50/50 rounded-lg hover:bg-green-100/50 transition-colors duration-300">
                    <p className="text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">
                      {currentCompany.location}
                    </p>
                  </div>
                  {currentCompany.foundedYear && (
                    <div className="p-4 bg-purple-50/50 rounded-lg hover:bg-purple-100/50 transition-colors duration-300">
                      <p className="text-gray-500 mb-1">Founded</p>
                      <p className="font-semibold text-gray-900">
                        {currentCompany.foundedYear}
                      </p>
                    </div>
                  )}
                </div>

                {currentCompany.benefits &&
                  currentCompany.benefits.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Employee Benefits
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentCompany.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="card-base p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-600">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Open Positions at {currentCompany.name}
                </h2>
                <div className="space-y-4">
                  {Array.from({ length: currentCompany.openJobs }).map(
                    (_, idx) => (
                      <Link
                        key={idx}
                        href={`/jobs`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-300 group fade-in"
                        style={{ animationDelay: `${600 + idx * 100}ms` }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">{`Position ${idx + 1}`}</h3>
                            <p className="text-xs text-gray-600">
                              Location: {currentCompany.location}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">
                            Apply →
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>

            <aside className="smooth-enter-right animation-delay-300">
              <div className="card-base p-6 mb-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-400">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Company Facts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50/50 rounded-lg hover:bg-blue-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {currentCompany.employees.toLocaleString()} employees
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50/50 rounded-lg hover:bg-green-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{currentCompany.openJobs} open positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-purple-50/50 rounded-lg hover:bg-purple-100/50 transition-all duration-300 hover:text-primary hover:translate-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentCompany.location}</span>
                  </div>
                </div>
              </div>

              <div className="card-base p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 fade-in animation-delay-500">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get updates when {currentCompany.name} posts new jobs.
                </p>
                <button
                  type="button"
                  className="w-full btn-primary bg-linear-to-r from-primary to-primary/80 text-gray-900 font-bold py-2 rounded-lg transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Follow Company
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
