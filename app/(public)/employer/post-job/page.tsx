"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobPostForm from "@/components/employer/JobPostForm";
import { JobFormData } from "@/types/job.types";
import { createJob } from "@/services/api/jobs.service";
import Swal from "sweetalert2";
import logger from "@/lib/logger";
import { EMPLOYER } from "@/constants/constant";

export default function PostJobPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is an employer
  React.useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string;
      if (userRole !== EMPLOYER) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only employers can post jobs",
        }).then(() => {
          router.push("/");
        });
      }
    }
  }, [isLoaded, user, router]);

  const handleSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      logger.info("Submitting job post:", data);

      // Prepare job data
      const jobData = {
        ...data,
        featured: data.featured || false,
        postedDate: new Date().toISOString(),
        employerId: user?.id || "",
        employerName: user?.fullName || "",
      };

      // Submit to API
      const result = await createJob(jobData);

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

      Swal.fire({
        icon: "error",
        title: "Failed to Post Job",
        text: error instanceof Error ? error.message : "Please try again later",
        confirmButtonColor: "#dc2626",
      });
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
