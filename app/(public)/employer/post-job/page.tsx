"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobPostForm from "@/components/employer/JobPostForm";
import { JobFormData } from "@/types/job.types";
import { createJob } from "@/services/api/jobs.service";
import { checkCompanyStatus } from "@/services/api/employerCompany.service";
import Swal from "sweetalert2";
import logger from "@/lib/logger";
import { EMPLOYER } from "@/constants/constant";

export default function PostJobPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCompany, setIsCheckingCompany] = useState(true);
  const [employerId, setEmployerId] = useState<number | null>(null);

  // Check if user is an employer and has company profile
  useEffect(() => {
    async function checkAccess() {
      if (isLoaded && user) {
        const userRole = user.unsafeMetadata?.role as string;

        if (userRole !== EMPLOYER) {
          await Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only employers can post jobs",
          });
          router.push("/");
          return;
        }

        // Get employer ID from metadata or use a temporary ID
        // TODO: Replace with actual employer ID from your auth system
        const empId = (user.unsafeMetadata?.employerId as number) || 1;
        setEmployerId(empId);

        try {
          // Check if employer has company profile (pass Clerk ID)
          const status = await checkCompanyStatus(user.id, getToken);

          if (!status.hasCompany || status.needsSetup) {
            await Swal.fire({
              icon: "info",
              title: "Company Profile Required",
              html: `
                <p class="mb-4">Before posting jobs, you need to create your company profile.</p>
                <p class="text-sm text-gray-600">This helps candidates learn about your company and builds trust.</p>
              `,
              confirmButtonText: "Create Company Profile",
              confirmButtonColor: "#3b82f6",
              allowOutsideClick: false,
            });
            router.push("/employer/company/setup");
            return;
          }
        } catch (error) {
          logger.error("Error checking company status:", error);
          // Continue anyway - backend will handle validation
        } finally {
          setIsCheckingCompany(false);
        }
      }
    }

    checkAccess();
  }, [isLoaded, user, router]);

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
      logger.info("Submitting job post:", data);

      // Prepare job data with employerId
      const jobData = {
        ...data,
        employerId, // Required by backend
        featured: data.featured || false,
        postedDate: new Date().toISOString(),
      };

      // Submit to API
      const result = await createJob(jobData, getToken);

      logger.info("Job created successfully:", result);

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Job Posted Successfully!",
        text: "Your job posting is now live and visible to candidates.",
        confirmButtonText: "View Jobs",
        showCancelButton: true,
        cancelButtonText: "Post Another Job",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/jobs");
        } else {
          // Reset form by reloading page
          window.location.reload();
        }
      });
    } catch (error) {
      logger.error("Error creating job:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Please try again later";

      // Check if error is about missing company profile
      if (errorMessage.includes("company profile")) {
        await Swal.fire({
          icon: "error",
          title: "Company Profile Required",
          text: errorMessage,
          confirmButtonText: "Create Company Profile",
          confirmButtonColor: "#3b82f6",
        });
        router.push("/employer/company/setup");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Post Job",
          text: errorMessage,
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Discard Job Post?",
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

  if (!isLoaded || isCheckingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            {isCheckingCompany ? "Verifying company profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Post a New Job
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fill in the details below to create a job posting and start
            attracting top talent
          </p>
        </div>

        {/* Job Post Form */}
        <JobPostForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </main>

      <Footer />
    </div>
  );
}
