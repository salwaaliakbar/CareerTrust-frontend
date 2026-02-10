"use client";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, TrendingUp } from "lucide-react";
import CompanyCard from "@/components/companies/CompanyCard";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getAllCompanies } from "@/redux/store/slices/companiesSlice";

type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
  featured: boolean;
};

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { items: companies, loading } = useAppSelector(
    (state) => state.companies
  );

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section with enhanced styling */}
      <section className="relative overflow-hidden py-12 px-8">
        {/* Gradient and blur background */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="relative bg-linear-to-r from-[#0A1F44] via-[#1e3a5f] to-[#2d4a6f] rounded-3xl p-10 shadow-2xl border border-white/10 backdrop-blur-sm overflow-hidden max-w-7xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>

          <div className="relative z-10 pb-10 pt-4">
            <div className="fade-in-down animation-delay-0">
              <h1 className="text-4xl font-bold mb-3 text-white">Explore Companies</h1>
              <p className="text-gray-100 text-lg mb-4">
                Discover trusted employers and read verified reviews
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mt-4 fade-in animation-delay-300 group">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company name or industry..."
                className="w-full pl-10 pr-4 py-3 bg-white/95 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white placeholder-gray-500"
                aria-label="Search companies"
              />
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:via-white/10 group-hover:to-white/5 rounded-lg transition-all duration-500 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading companies...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 ml-6 fade-in animation-delay-200">
              <p className="text-gray-600">
                Showing <strong className="text-primary font-bold">{filteredCompanies.length}</strong>{' '}
                {filteredCompanies.length !== 1 ? "companies" : "company"}
              </p>
            </div>

            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company, idx) => (
                  <div key={company.id} className="fade-in animation-delay-100" style={{animationDelay: `${100 + idx * 100}ms`}}>
                    <CompanyCard company={company} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-base p-12 text-center fade-in animation-delay-300 rounded-2xl border border-gray-200 shadow-lg">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No companies found matching your search</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
