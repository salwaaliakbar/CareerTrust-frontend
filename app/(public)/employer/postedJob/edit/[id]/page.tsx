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
import {
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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

        setEmployerId(user.id);

        try {
          setIsLoading(true);
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, ...jobDataWithoutCompany } = data;
      const jobData: JobFormData = {
        ...jobDataWithoutCompany,
      };

      const result = await updateJob(jobId, jobData, getToken);

      logger.info("Job updated successfully:", result);

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
          router.push(`/employer/postedJob/${jobId}`);
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="text-center rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur-xl">
          <Loader2 className="animate-spin h-12 w-12 text-cyan-300 mx-auto mb-4" />
          <p className="text-slate-200 font-medium">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Header />

      <main className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-size-[40px_40px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

            <div className="relative z-10 px-7 py-12 sm:px-10 sm:py-15">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-cyan-300/80" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                      Edit Posted Job
                    </span>
                  </div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    Update Job Details
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-200/85 sm:text-base">
                    Refine the job title, requirements, and visibility while keeping the posting consistent with your employer dashboard.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Link
                    href={`/employer/postedJob/${jobId}`}
                    className="inline-flex min-w-40 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-white/20"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_18px_45px_-28px_rgba(12,43,78,0.35)]">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Job Form
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Update the posting
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <JobPostForm
                  initialData={initialData}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isSubmitting={isSubmitting}
                  isEditMode={true}
                />
              </div>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}