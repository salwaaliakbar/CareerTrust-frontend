"use client";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, TrendingUp } from "lucide-react";
import CompanyCard from "@/components/companies/CompanyCard";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getAllCompanies } from "@/src/store/slices/companiesSlice";

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

      {/* Hero Section */}
      <section className="bg-[#0C2B4E] text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Explore Companies</h1>
          <p className="text-gray-100 text-lg mb-4">
            Discover trusted employers and read verified reviews
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mt-4">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company name or industry..."
              className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search companies"
            />
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
        <div className="mb-6 ml-6">
          <p className="text-gray-600">
            Showing <strong>{filteredCompanies.length}</strong>{' '}
            {filteredCompanies.length !== 1 ? "companies" : "company"}
          </p>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center">
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
