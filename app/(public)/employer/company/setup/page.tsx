"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import {
  Building2,
  MapPin,
  Users,
  FileText,
  Briefcase,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Globe,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  createCompanyProfile,
  checkCompanyStatus,
  getCompanyProfile,
  updateCompanyProfile,
} from "@/services/api/employerCompany.service";
import { CreateCompanyRequest } from "@/services/api/employerCompany.service";
import Swal from "sweetalert2";
import logger from "@/lib/logger";
import { EMPLOYER } from "@/constants/constant";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Transportation",
  "Hospitality",
  "Other",
];

export default function CompanySetupPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [existingCompanyId, setExistingCompanyId] = useState<number | null>(
    null,
  );
  const [employerId, setEmployerId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<CreateCompanyRequest, "employerId">>();

  const selectedIndustry = watch("industry");

  // Check access and load existing company if any
  useEffect(() => {
    async function checkAccess() {
      if (isLoaded && user) {
        const userRole = user.unsafeMetadata?.role as string;

        if (userRole !== EMPLOYER) {
          await Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only employers can access this page",
          });
          router.push("/");
          return;
        }

        // Use Clerk ID as the employer identifier (numeric employerId is never stored in metadata)
        setEmployerId(user.id);

        try {
          // Check if company already exists (pass Clerk ID)
          const status = await checkCompanyStatus(user.id, getToken);

          if (status.hasCompany) {
            setIsEditing(true);
            // Load existing company data
            const company = await getCompanyProfile(user.id, getToken);
            if (company) {
              setExistingCompanyId(company.id);
              setValue("name", company.name);
              // If the stored industry is not in the standard list, treat as "Other"
              if (industries.includes(company.industry)) {
                setValue("industry", company.industry);
              } else {
                setValue("industry", "Other");
                setCustomIndustry(company.industry);
              }
              setValue("location", company.location);
              setValue("employees", company.employees);
              setValue("description", company.description);
              setValue("logo", company.logo);
              setValue("linkedinUrl", company.linkedinUrl || "");
              setValue("website", (company as any).website || "");
            }
          }
        } catch (error) {
          logger.error("Error loading company data:", error);
        }
      }
    }

    checkAccess();
  }, [isLoaded, user, router, setValue, getToken]);

  const onSubmit = async (data: Omit<CreateCompanyRequest, "employerId">) => {
    // Resolve "Other" industry to the custom typed value
    if (data.industry === "Other") {
      if (!customIndustry.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Industry Required",
          text: "Please type your industry in the field below the dropdown.",
        });
        return;
      }
      data.industry = customIndustry.trim();
    }

    if (!employerId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Employer ID not found. Please try logging in again.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      logger.info("Submitting company profile:", data);

      const companyData: CreateCompanyRequest = {
        ...data,
        employerId,
      };

      let result;
      if (isEditing && existingCompanyId) {
        // Update existing company
        result = await updateCompanyProfile(
          existingCompanyId,
          employerId,
          data,
          getToken,
        );
        logger.info("Company updated successfully:", result);
      } else {
        // Create new company
        result = await createCompanyProfile(companyData, getToken);
        logger.info("Company created successfully:", result);
      }

      await Swal.fire({
        icon: "success",
        title: isEditing ? "Company Updated!" : "Company Profile Created!",
        text: isEditing
          ? "Your company profile has been updated successfully."
          : "Your company profile is now set up. You can start posting jobs!",
        confirmButtonText: "Post a Job",
        showCancelButton: true,
        cancelButtonText: "Go to Dashboard",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/employer/post-job");
        } else {
          router.push("/employer/dashboard");
        }
      });
    } catch (error) {
      logger.error("Error saving company profile:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Save Company Profile",
        text: error instanceof Error ? error.message : "Please try again later",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            {isEditing
              ? "Update Company Profile"
              : "Setup Your Company Profile"}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {isEditing
              ? "Update your company information to keep candidates informed"
              : "Create your company profile to start posting jobs and attracting top talent"}
          </p>
        </div>

        {/* Company Setup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              Company Information
            </h2>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "Company name must be at least 2 characters",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tech Solutions Inc."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    {...register("industry", {
                      required: "Industry is required",
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedIndustry === "Other" && (
                  <input
                    type="text"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please specify your industry"
                  />
                )}
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Karachi, Lahore, Islamabad"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Number of Employees */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Employees <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    {...register("employees", {
                      required: "Number of employees is required",
                      min: { value: 1, message: "Must be at least 1" },
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50"
                  />
                </div>
                {errors.employees && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.employees.message}
                  </p>
                )}
              </div>

              {/* Company Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 50,
                        message: "Description must be at least 50 characters",
                      },
                    })}
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell candidates about your company, culture, mission, and values..."
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Company Website URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Website URL (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Your company&apos;s official website
                </p>
              </div>

              {/* Company Logo URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Logo URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    {...register("logo")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Provide a URL to your company logo image
                </p>
              </div>

              {/* Company LinkedIn URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company LinkedIn Page URL (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    {...register("linkedinUrl", {
                      pattern: {
                        value:
                          /^https:\/\/(www\.)?linkedin\.com\/(company|in)\//,
                        message:
                          "Must be a valid LinkedIn company or profile URL",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.linkedin.com/company/your-company"
                  />
                </div>
                {errors.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.linkedinUrl.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Link to your company's LinkedIn page for verification
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/employer/dashboard")}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isEditing
                    ? "Update Company Profile"
                    : "Create Company Profile"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
