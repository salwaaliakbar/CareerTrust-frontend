"use client";

import React, { useState, useRef } from "react";
import { X, FileText, Upload, Check, AlertCircle } from "lucide-react";
import type { ApplicationData, ApplyModalProps } from "@/types/application.types";

const initialFormData: ApplicationData = {
  fullName: "",
  email: "",
  phone: "",
  coverLetter: "",
  resumeOption: "existing",
  resumeFile: undefined,
};

export default function ApplyModal({
  isOpen,
  jobTitle,
  companyName,
  resumeUrl,
  onClose,
  onSubmit,
  profileData,
}: ApplyModalProps) {
  const [formData, setFormData] = useState<ApplicationData>(initialFormData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeError, setResumeError] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState(false);

  const isExistingSelected = formData.resumeOption === "existing";
  const isNewSelected = formData.resumeOption === "new";

  // Initialize form data when modal opens
  const initializedFormData = React.useMemo(() => {
    if (!isOpen) return initialFormData;
    return {
      fullName: profileData?.fullName || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      coverLetter: "",
      resumeOption: resumeUrl ? "existing" : "new",
      resumeFile: undefined,
    };
  }, [isOpen, profileData, resumeUrl]);

  // Update form data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initializedFormData);
    }
  }, [isOpen, initializedFormData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError("File size must be less than 5MB");
        return;
      }
      // Validate file type
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setResumeError("Only PDF and DOCX files are allowed");
        return;
      }
      setResumeError("");
      setFormData((prev) => ({
        ...prev,
        resumeOption: "new",
        resumeFile: file,
      }));
    }
  };

  const handleResumeOptionChange = (option: "existing" | "new") => {
    setFormData((prev) => ({
      ...prev,
      resumeOption: option,
      resumeFile: option === "existing" ? undefined : prev.resumeFile || undefined,
    }));
    setResumeError("");
    if (option === "existing") {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearResumeFile = () => {
    setFormData((prev) => ({ ...prev, resumeFile: undefined }));
    setResumeError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setResumeError("Please fill in all required contact fields");
      return;
    }

    // Validate resume selection
    if (formData.resumeOption === "existing" && !resumeUrl) {
      setResumeError("No resume on file. Please upload a new resume.");
      return;
    }
    if (formData.resumeOption === "new" && !formData.resumeFile) {
      setResumeError("Please upload a resume file");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form to profile data
        setFormData({
          fullName: profileData?.fullName || "",
          email: profileData?.email || "",
          phone: profileData?.phone || "",
          coverLetter: "",
          resumeOption: resumeUrl ? "existing" : "new",
          resumeFile: undefined,
        });
        setResumeError("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  console.log("[ApplyModal] profileData:", profileData);
  console.log("[ApplyModal] resumeUrl:", resumeUrl);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white p-6 flex items-center justify-between border-b-4 border-[#0C2B4E]/30">
          <div className="flex-1">
            <h2 className="text-2xl font-black mb-1">{jobTitle}</h2>
            <p className="text-blue-100 font-semibold">{companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 ml-4 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="p-12 text-center bg-linear-to-b from-green-50 to-blue-50">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 text-lg">
              Thank you for applying! The employer will review your application soon.
            </p>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Contact Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0C2B4E] focus:ring-2 focus:ring-[#0C2B4E]/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0C2B4E] focus:ring-2 focus:ring-[#0C2B4E]/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0C2B4E] focus:ring-2 focus:ring-[#0C2B4E]/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ✓ Your contact information is automatically prefilled from your
                profile
              </p>
            </div>

            {/* Resume Section */}
            <div className="space-y-4 pt-4 border-t-2 border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="text-lg font-black text-gray-900">Resume</h3>
              </div>

              {/* Current Resume on File - if exists */}
              {resumeUrl && (
                <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-900 text-sm">
                        ✓ Current Resume on File
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Your profile resume is ready to be submitted
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Options */}
              <div className="space-y-3">
                {resumeUrl && (
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      isExistingSelected
                        ? "border-[#0C2B4E] bg-[#f0f7ff]"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resumeOption"
                      value="existing"
                      checked={isExistingSelected}
                      onChange={() => handleResumeOptionChange("existing")}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-bold text-gray-900 text-sm">
                        Use Resume from Profile
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Already uploaded and verified
                      </p>
                    </div>
                  </label>
                )}

                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    isNewSelected
                      ? "border-[#0C2B4E] bg-[#f0f7ff]"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="resumeOption"
                    value="new"
                    checked={isNewSelected}
                    onChange={() => handleResumeOptionChange("new")}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-gray-900 text-sm">
                      Upload New Resume
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submit a different resume for this application
                    </p>
                  </div>
                </label>
              </div>

              {/* File Upload Area */}
              {isNewSelected && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-[#0C2B4E] bg-[#f0f7ff]"
                      : "border-gray-300 hover:border-[#0C2B4E] hover:bg-blue-50/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      handleFileChange({
                        target: { files: [droppedFile] },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                >
                  <Upload className="w-10 h-10 text-[#0C2B4E] mx-auto mb-3" />
                  <p className="font-bold text-gray-900 mb-1">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-sm text-gray-500">PDF or DOCX • Max 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    title="Select a resume file"
                  />
                </div>
              )}

              {/* Selected File Display */}
              {formData.resumeFile && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {formData.resumeFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {(
                          formData.resumeFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB • Ready to send
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearResumeFile}
                    className="p-2 hover:bg-blue-200 rounded-lg transition-all duration-300 ml-2 shrink-0"
                    title="Remove resume"
                  >
                    <X className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              )}

              {/* Resume Error Message */}
              {resumeError && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 font-medium">{resumeError}</p>
                </div>
              )}
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-4 pt-4 border-t-2 border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Cover Letter
                </h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Optional
                </span>
              </div>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0C2B4E] focus:ring-2 focus:ring-[#0C2B4E]/20 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="Tell the employer why you're interested in this role... (optional)"
              />
              <p className="text-xs text-gray-500">
                A personal note can help you stand out. Keep it brief and
                relevant!
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-[#0C2B4E] to-[#1D546C] text-white font-black py-4 rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-lg"
            >
              {isSubmitting ? "⏳ Submitting Application..." : "✓ Submit Application"}
            </button>

            {/* Footer Info */}
            <p className="text-xs text-gray-500 text-center pt-2">
              By submitting this application, you agree to the terms and
              conditions
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
