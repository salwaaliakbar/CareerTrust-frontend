"use client";

import { useState } from "react";
import { Company, CompanyFormData } from "@/types/company.types";
import { updateCompany } from "@/services/api/companies.service";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Calendar,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

interface CompanyEditFormProps {
  company: Company;
  onCancel: () => void;
  onSuccess: (updatedCompany: Company) => void;
}

export default function CompanyEditForm({
  company,
  onCancel,
  onSuccess,
}: CompanyEditFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company.name,
    industry: company.industry,
    location: company.location,
    description: company.description,
    logo: company.logo,
    website: company.website || "",
    foundedYear: company.foundedYear || new Date().getFullYear(),
    companySize: company.companySize || "",
    employees: company.employees,
    benefits: company.benefits?.join(", ") || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "employees" || name === "foundedYear"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert benefits string to array
      const updateData: Partial<CompanyFormData> = {
        ...formData,
        benefits: formData.benefits
          ? formData.benefits.split(",").map((b) => b.trim())
          : undefined,
      };

      const updatedCompany = await updateCompany(company.id, updateData);

      if (updatedCompany) {
        await Swal.fire({
          title: "Success!",
          text: "Company profile updated successfully",
          icon: "success",
          confirmButtonColor: "#0C2B4E",
        });
        onSuccess(updatedCompany);
      } else {
        throw new Error("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      await Swal.fire({
        title: "Error",
        text: "Failed to update company profile. Please try again.",
        icon: "error",
        confirmButtonColor: "#0C2B4E",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base p-8 rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Edit Company Profile
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Karachi, Lahore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://www.company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Employees *
              </label>
              <input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Founded Year
              </label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 2010"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001+">1001+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Company Description
          </h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Tell us about your company, culture, mission, and values..."
          />
          <p className="text-sm text-gray-500 mt-2">
            {formData.description.length} / 1000 characters
          </p>
        </div>

        {/* Benefits Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Employee Benefits
          </h3>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Enter benefits separated by commas (e.g., Health Insurance, Remote Work, Gym Membership)"
          />
          <p className="text-sm text-gray-500 mt-2">
            Separate multiple benefits with commas
          </p>
        </div>

        {/* Logo Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Company Logo
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0C2B4E] to-[#1D546C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {formData.logo}
              </span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                maxLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter logo initials (max 3 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter up to 3 characters for your company logo
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
