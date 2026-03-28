"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobPostForm from "@/components/employer/JobPostForm";
import { JobFormData } from "@/types/job.types";
import { updateJob, fetchJobById } from "@/services/api/jobs.service";
import Swal from "sweetalert2";
import logger from "@/lib/logger";
import { EMPLOYER } from "@/constants/constant";
import { Loader2 } from "lucide-react";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<JobFormData | null>(null);
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  // Check if user is an employer and fetch job data
  useEffect(() => {
    async function loadJobData() {
      if (isLoaded && user) {
        const userRole = user.unsafeMetadata?.role as string;

        if (userRole !== EMPLOYER) {
          await Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only employers can edit jobs",
          });
          router.push("/");
          return;
        }

        // Use Clerk ID — numeric employerId is not stored in metadata
        setEmployerId(user.id);

        try {
          setIsLoading(true);
          // Fetch existing job data
          const job = await fetchJobById(jobId);

          if (!job) {
            await Swal.fire({
              icon: "error",
              title: "Job Not Found",
              text: "The job you're trying to edit doesn't exist.",
            });
            router.push("/employer/dashboard");
            return;
          }

          // Store logo for header display
          if (job.companyLogo) setCompanyLogo(job.companyLogo);
          if (job.company) setCompanyName(job.company);

          // Convert job data to form format
          const formData: JobFormData = {
            title: job.title,
            description: job.description,
            company: job.company,
            location: job.location,
            salary: job.salary || "",
            jobType: job.jobType,
            experience: job.experience,
            skills: Array.isArray(job.skills)
              ? job.skills.join(", ")
              : job.skills,
            deadline: job.deadline || "",
            featured: job.featured || false,
          };

          setInitialData(formData);
        } catch (error) {
          logger.error("Error loading job data:", error);
          await Swal.fire({
            icon: "error",
            title: "Error Loading Job",
            text: "Failed to load job data. Please try again.",
          });
          router.push("/employer/dashboard");
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (jobId) {
      loadJobData();
    }
  }, [isLoaded, user, router, jobId]);

  const handleSubmit = async (data: JobFormData) => {
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
      logger.info("Updating job:", jobId, data);

      // Prepare job data with employerId, exclude company field (it's read-only)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, ...jobDataWithoutCompany } = data;
      const jobData: JobFormData = {
        ...jobDataWithoutCompany,
      };

      // Submit to API (skills will be converted to array in the service)
      const result = await updateJob(jobId, jobData, getToken);

      logger.info("Job updated successfully:", result);

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Job Updated Successfully!",
        text: "Your job posting has been updated.",
        confirmButtonText: "View Job",
        showCancelButton: true,
        cancelButtonText: "Back to Dashboard",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/employer/jobs/${jobId}`);
        } else {
          router.push("/employer/dashboard");
        }
      });
    } catch (error) {
      logger.error("Error updating job:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Please try again later";

      Swal.fire({
        icon: "error",
        title: "Failed to Update Job",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Discard Changes?",
      text: "All your changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, discard",
      cancelButtonText: "Continue editing",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/employer/dashboard");
      }
    });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          {/* Company logo / fallback icon */}
          <div className="flex justify-center mb-5">
            {companyLogo &&
            (companyLogo.startsWith("http") || companyLogo.startsWith("/")) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogo}
                alt={companyName ?? "Company"}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-xl ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl ring-4 ring-blue-100">
                {companyName ? (
                  <span className="text-white font-black text-2xl">
                    {companyName
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                ) : (
                  <Loader2 className="w-10 h-10 text-white/60" />
                )}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Edit Job Posting
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Update your job posting details and save changes
          </p>
        </div>

        {/* Job Post Form */}
        <JobPostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
      </main>

      <Footer />
    </div>
  );
}
