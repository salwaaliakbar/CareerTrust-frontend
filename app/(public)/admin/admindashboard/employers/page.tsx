"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Building2, Search, Filter, Eye, Mail, Globe, MapPin, Briefcase } from "lucide-react";

interface EmployerData {
  employerId: number;
  userId: number;
  companyName: string | null;
  companyURL: string | null;
  user: {
    email: string;
    createdAt: string;
    profile?: {
      fullName: string | null;
    };
  };
}

export default function EmployersPage() {
  const { getToken } = useAuth();
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [filteredEmployers, setFilteredEmployers] = useState<EmployerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchEmployers();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, filterStatus, employers]);

  const fetchEmployers = async () => {
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      const response = await fetch(`${apiUrl}/api/admin/employers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch employers");

      const data = await response.json();
      setEmployers(data.data.employers || []);
      setFilteredEmployers(data.data.employers || []);
    } catch (error) {
      console.error("Error fetching employers:", error);
      setEmployers([]);
      setFilteredEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...employers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          emp.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.user.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Company profile filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((emp) =>
        filterStatus === "with-company" ? emp.companyName : !emp.companyName
      );
    }

    setFilteredEmployers(filtered);
  };

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
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#F97316]/12 via-[#EA580C]/8 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          <span className="text-sm font-semibold text-[#F97316]">Employer Management</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">Employers</h1>
        <p className="text-gray-600">Manage and monitor all registered employers</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Employers</p>
              <p className="text-3xl font-bold text-[#0C2B4E]">{employers.length}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-[#0C2B4E]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">With Company Info</p>
              <p className="text-3xl font-bold text-green-600">
                {employers.filter((emp) => emp.companyName).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Without Company Info</p>
              <p className="text-3xl font-bold text-orange-600">
                {employers.filter((emp) => !emp.companyName).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-orange-600" />
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
              placeholder="Search by company name, email, or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all bg-white"
            >
              <option value="all">All Employers</option>
              <option value="with-company">With Company Info</option>
              <option value="without-company">Without Company Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employers Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200/60 overflow-hidden fade-in animation-delay-400">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Employer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Website</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No employers found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredEmployers.map((employer, index) => (
                  <tr
                    key={employer.employerId}
                    className="hover:bg-gray-50 transition-colors duration-200 fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white font-semibold shadow-sm">
                          {employer.user.profile?.fullName?.charAt(0) || employer.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {employer.user.profile?.fullName || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">ID: {employer.employerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {employer.companyName || "Not provided"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px]">{employer.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {employer.companyURL ? (
                        <a
                          href={employer.companyURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[#0C2B4E] hover:text-[#F97316] transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">Visit</span>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          employer.companyName
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-orange-100 text-orange-700 border border-orange-200"
                        }`}
                      >
                        {employer.companyName ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(employer.user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all duration-200 group">
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
      {filteredEmployers.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600 fade-in animation-delay-500">
          Showing <span className="font-semibold text-[#F97316]">{filteredEmployers.length}</span> of{" "}
          <span className="font-semibold text-[#F97316]">{employers.length}</span> employers
        </div>
      )}
    </div>
  );
}
