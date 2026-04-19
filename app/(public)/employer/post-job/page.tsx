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
import {
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCompany, setIsCheckingCompany] = useState(true);
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

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

        // Use Clerk ID — numeric employerId is not stored in metadata
        setEmployerId(user.id);

        try {
          // Check if employer has company profile (pass Clerk ID)
          const status = await checkCompanyStatus(user.id, getToken);
          setCompanyName(status.companyName || null);

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
  }, [isLoaded, user, router, getToken]);

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
        confirmButtonText: "Go to Dashboard",
        showCancelButton: true,
        cancelButtonText: "Post Another Job",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/employer/dashboard");
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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_18px_40px_-24px_rgba(15,23,42,0.38)]">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="text-slate-600 font-semibold">
            {isCheckingCompany ? "Verifying company profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500" />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 bg-[#0B1F45]" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.05] bg-size-[40px_40px] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]" />

          <div className="relative z-10 px-7 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Employer Job Studio
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  Post a New Job
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-200/85 sm:text-base">
                  Create a polished job post that matches your employer branding and reaches the right candidates faster.
                </p>

                {companyName && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-50 backdrop-blur-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Posting for {companyName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
               
                <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200/80">
                    Quick Start
                  </p>
                  <p className="mt-1 text-sm text-blue-100/90">
                    Draft, review, and publish in one flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(12,43,78,0.35)]">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Job Form
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Build your posting
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600 sm:inline-flex">
                <LayoutDashboard className="h-4 w-4 text-blue-500" />
                Employer theme
              </div>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <JobPostForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
