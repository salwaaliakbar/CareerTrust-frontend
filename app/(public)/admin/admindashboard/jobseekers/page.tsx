"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Users, Search, Filter, Eye, Mail, Phone, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { AdminService } from "@/services/api/admin.service";

interface JobSeekerData {
  jobseekerId: number;
  clerkId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  location: string | null;
  totalExperience: string | null;
  highestDegree: string | null;
  isProfileComplete: boolean;
  createdAt: string;
}

export default function JobSeekersPage() {
  const { getToken } = useAuth();
  const [jobseekers, setJobseekers] = useState<JobSeekerData[]>([]);
  const [filteredJobseekers, setFilteredJobseekers] = useState<JobSeekerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterComplete, setFilterComplete] = useState<string>("all");

  useEffect(() => {
    fetchJobseekers();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, filterComplete, jobseekers]);

  const fetchJobseekers = async () => {
    try {
      const token = await getToken();
      const response = await AdminService.getAllJobseekers(token);
      setJobseekers(response.data.jobseekers || []);
      setFilteredJobseekers(response.data.jobseekers || []);
    } catch (error) {
      console.error("Error fetching jobseekers:", error);
      setJobseekers([]);
      setFilteredJobseekers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...jobseekers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (js) =>
          js.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          js.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          js.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          js.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Profile completion filter
    if (filterComplete !== "all") {
      filtered = filtered.filter((js) =>
        filterComplete === "complete" ? js.isProfileComplete : !js.isProfileComplete
      );
    }

    setFilteredJobseekers(filtered);
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
      <div className="absolute -top-20 -left-12 w-[420px] h-[420px] rounded-full blur-3xl bg-gradient-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-4 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
          <span className="text-sm font-semibold text-[#0C2B4E]">JobSeeker Management</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0C2B4E] mb-2">JobSeekers</h1>
        <p className="text-gray-600">Manage and monitor all registered job seekers</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total JobSeekers</p>
              <p className="text-3xl font-bold text-[#0C2B4E]">{jobseekers.length}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#0C2B4E]/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-[#0C2B4E]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Complete Profiles</p>
              <p className="text-3xl font-bold text-green-600">
                {jobseekers.filter((js) => js.isProfileComplete).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 fade-in animation-delay-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Incomplete Profiles</p>
              <p className="text-3xl font-bold text-orange-600">
                {jobseekers.filter((js) => !js.isProfileComplete).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-orange-600" />
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
              placeholder="Search by name, email, headline, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterComplete}
              onChange={(e) => setFilterComplete(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]/20 focus:border-[#0C2B4E] transition-all bg-white"
            >
              <option value="all">All Profiles</option>
              <option value="complete">Complete Only</option>
              <option value="incomplete">Incomplete Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* JobSeekers Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200/60 overflow-hidden fade-in animation-delay-400">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">JobSeeker</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Headline</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Experience</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Education</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobseekers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No job seekers found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredJobseekers.map((jobseeker, index) => (
                  <tr
                    key={jobseeker.jobseekerId}
                    className="hover:bg-gray-50 transition-colors duration-200 fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C2B4E] to-[#1A3D64] flex items-center justify-center text-white font-semibold shadow-sm">
                          {jobseeker.fullName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {jobseeker.fullName || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">ID: {jobseeker.jobseekerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{jobseeker.email || "N/A"}</span>
                        </div>
                        {jobseeker.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{jobseeker.phone}</span>
                          </div>
                        )}
                        {jobseeker.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{jobseeker.location}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-[250px]">
                        {jobseeker.headline || "No headline"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {jobseeker.totalExperience || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {jobseeker.highestDegree || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          jobseeker.isProfileComplete
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-orange-100 text-orange-700 border border-orange-200"
                        }`}
                      >
                        {jobseeker.isProfileComplete ? "Complete" : "Incomplete"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(jobseeker.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 rounded-lg bg-[#0C2B4E]/10 text-[#0C2B4E] hover:bg-[#0C2B4E] hover:text-white transition-all duration-200 group">
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
      {filteredJobseekers.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600 fade-in animation-delay-500">
          Showing <span className="font-semibold text-[#0C2B4E]">{filteredJobseekers.length}</span> of{" "}
          <span className="font-semibold text-[#0C2B4E]">{jobseekers.length}</span> job seekers
        </div>
      )}
    </div>
  );
}
