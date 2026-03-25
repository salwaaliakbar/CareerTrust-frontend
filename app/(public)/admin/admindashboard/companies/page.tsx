"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  Briefcase
} from "lucide-react";
import { CompanyData } from "@/types/admin.types";
import { AdminService } from "@/services/api/admin.service";

export default function CompaniesPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, filterStatus, companies]);

  const fetchCompanies = async () => {
    try {
      const token = await getToken();
      const response = await AdminService.getAllCompanies(token);
      setCompanies(response.data.companies || []);
      setFilteredCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...companies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (company) =>
          company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "verified") {
      filtered = filtered.filter((company) => company.isVerified === true);
    } else if (filterStatus === "unverified") {
      filtered = filtered.filter((company) => company.isVerified === false);
    }

    setFilteredCompanies(filtered);
  };

  const getVerifiedCount = () => companies.filter((c) => c.isVerified).length;
  const getUnverifiedCount = () => companies.filter((c) => !c.isVerified).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2B4E]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">Company Management</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">Companies</h1>
        <p className="text-gray-600">Manage and verify registered companies</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Companies</p>
              <p className="text-3xl font-bold text-[#0C2B4E]">{companies.length}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-[#0C2B4E]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
              <p className="text-3xl font-bold text-green-600">{getVerifiedCount()}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-150">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{getUnverifiedCount()}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Verification Rate</p>
              <p className="text-3xl font-bold text-blue-600">
                {companies.length > 0 
                  ? Math.round((getVerifiedCount() / companies.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200/60 fade-in animation-delay-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all bg-white"
            >
              <option value="all">All Companies</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200/60 overflow-hidden fade-in animation-delay-400">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Industry</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Verification</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Jobs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Registered</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No companies found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 transition-colors duration-200 fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => router.push(`/admin/admindashboard/companies/${company.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] flex items-center justify-center text-white font-semibold shadow-sm">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                          <p className="text-xs text-gray-500">ID: {company.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{company.industry}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{company.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          company.isVerified
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-orange-100 text-orange-700 border border-orange-200"
                        }`}
                      >
                        {company.isVerified ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {company.jobs?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/admindashboard/companies/${company.id}`);
                          }}
                          className="p-2 rounded-lg bg-[#0C2B4E]/10 text-[#0C2B4E] hover:bg-[#0C2B4E] hover:text-white transition-all duration-200 group"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredCompanies.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600 fade-in animation-delay-500">
          Showing <span className="font-semibold text-[#0C2B4E]">{filteredCompanies.length}</span> of{" "}
          <span className="font-semibold text-[#0C2B4E]">{companies.length}</span> companies
        </div>
      )}
    </div>
  );
}
