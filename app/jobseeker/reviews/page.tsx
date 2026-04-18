"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquareText,
  PenSquare,
  ShieldCheck,
  Star,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getEligibleCompaniesForReview,
  submitCompanyReview,
  type EligibleCompanyForReview,
} from "@/services/api/companyReview.service";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const normalizeReviewForComparison = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,;:!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default function JobseekerReviewsPage() {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [companies, setCompanies] = useState<EligibleCompanyForReview[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedLogoByCompanyId, setFailedLogoByCompanyId] = useState<
    Record<number, string>
  >({});
  const staggerClass = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
  ];

  useEffect(() => {
    const load = async () => {
      if (!isLoaded || !user) return;
      try {
        setLoading(true);
        const result = await getEligibleCompaniesForReview(getToken);
        setCompanies(result);
        if (result.length > 0) {
          const first = result[0];
          setSelectedCompanyId(first.company.id);
          setRating(first.existingReview?.rating ?? 0);
          setReviewText(first.existingReview?.reviewText ?? "");
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load companies",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getToken, isLoaded, user]);

  const selectedCompany =
    companies.find((item) => item.company.id === selectedCompanyId) ?? null;
  const submittedCount = companies.filter((item) => item.existingReview).length;
  const pendingCount = companies.length - submittedCount;
  const initialReviewText = selectedCompany?.existingReview?.reviewText ?? "";
  const initialRating = selectedCompany?.existingReview?.rating ?? 0;
  const hasExistingReview = Boolean(selectedCompany?.existingReview);
  const hasReviewChanges =
    normalizeReviewForComparison(reviewText) !==
      normalizeReviewForComparison(initialReviewText) ||
    rating !== initialRating;
  const isSubmitDisabled =
    submitting ||
    reviewText.trim().length === 0 ||
    (hasExistingReview && !hasReviewChanges);

  const handleSelect = (company: EligibleCompanyForReview) => {
    setSelectedCompanyId(company.company.id);
    setRating(company.existingReview?.rating ?? 0);
    setReviewText(company.existingReview?.reviewText ?? "");
    setSuccessMessage(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedCompany) return;

    const isUpdatingExistingReview = Boolean(selectedCompany.existingReview);

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      await submitCompanyReview(
        {
          companyId: selectedCompany.company.id,
          ...(rating > 0 ? { rating } : {}),
          reviewText,
        },
        getToken,
      );

      const refreshed = await getEligibleCompaniesForReview(getToken);
      setCompanies(refreshed);
      const updatedCompany =
        refreshed.find(
          (item) => item.company.id === selectedCompany.company.id,
        ) ?? null;
      if (updatedCompany) {
        setSelectedCompanyId(updatedCompany.company.id);
        setRating(updatedCompany.existingReview?.rating ?? rating);
        setReviewText(updatedCompany.existingReview?.reviewText ?? reviewText);
      }

      setSuccessMessage(
        isUpdatingExistingReview
          ? "Your company review has been updated."
          : "Your company review has been saved.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <main className="min-h-screen bg-[#F4F6FB] pt-8 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-8 smooth-enter">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_18px_55px_-18px_rgba(15,23,42,0.55)] fade-in-up">
            <div className="absolute inset-0 bg-[#0B1F45]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_20%_50%,#1e40af44_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#7c3aed33_0%,transparent_55%),radial-gradient(ellipse_at_60%_80%,#0ea5e922_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Trusted Reviews
                  </div>
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                    Company Reviews
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-blue-100/85 sm:text-base">
                    Add anonymous, verified feedback for your current workplace
                    and help improve reputation insights for all jobseekers.
                  </p>
                </div>

                <div className="grid w-full grid-cols-3 gap-3 md:w-auto md:min-w-90">
                  <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-100/80">
                      Eligible
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{companies.length}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-3 py-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                      Reviewed
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{submittedCount}</p>
                  </div>
                  <div className="rounded-xl border border-amber-300/30 bg-amber-500/15 px-3 py-3 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-100">
                      Pending
                    </p>
                    <p className="mt-1 text-xl font-black text-white">{pendingCount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 inline-flex items-start gap-2 rounded-xl border border-blue-300/30 bg-blue-500/20 px-4 py-2.5 text-sm text-blue-100">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Reviews are anonymized and accepted only for active employment records.
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="font-medium text-slate-500">
                Loading eligible companies…
              </p>
            </div>
          ) : error && companies.length === 0 ? (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-red-700">
                Unable to load review page
              </p>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-lg font-semibold text-slate-700">
                No company available for review
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Only active employees can review their current company, and the
                company must exist in the platform database.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-7 fade-in-up animation-delay-100">
                <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-blue-50/40 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900">Software House Information</h2>
                  <p className="text-sm text-slate-500">Select a company to write or update your review</p>
                </div>
                <div className="space-y-4 p-4">
                  {companies.map((item, idx) => {
                    const isSelected = item.company.id === selectedCompanyId;
                    const logo = item.company.logo;
                    const logoSrc =
                      logo && (logo.startsWith("http") || logo.startsWith("/"))
                        ? logo
                        : "";
                    const companyInitials = item.company.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase();
                    const hasValidLogo =
                      !!logoSrc && failedLogoByCompanyId[item.company.id] !== logoSrc;

                    return (
                      <button
                        key={item.company.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`w-full rounded-2xl border bg-linear-to-br from-white via-slate-50/40 to-white p-6 text-left shadow-sm transition ${
                          isSelected
                            ? "border-blue-300 ring-2 ring-blue-100 shadow-[0_8px_22px_-14px_rgba(37,99,235,0.35)]"
                            : "border-slate-200 hover:border-blue-200 hover:shadow-md"
                        } fade-in-up ${staggerClass[idx % staggerClass.length]}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#0A1F44] via-[#123560] to-[#1A4779]">
                              {hasValidLogo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={logoSrc}
                                  alt={item.company.name}
                                  className="h-full w-full object-cover"
                                  onError={() =>
                                    setFailedLogoByCompanyId((prev) => ({
                                      ...prev,
                                      [item.company.id]: logoSrc,
                                    }))
                                  }
                                />
                              ) : (
                                <span className="text-sm font-bold text-white tracking-wide">
                                  {companyInitials}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">
                                  {item.company.name}
                                </h2>
                                {item.company.isVerified && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.company.industry}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4" />
                                  {item.company.location}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  Working since{" "}
                                  {formatDate(item.employment.startDate)}
                                </span>
                              </div>
                              <p className="mt-3 text-sm font-medium text-slate-700">
                                Current role: {item.employment.position}
                              </p>
                            </div>
                          </div>
                          {item.existingReview ? (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Reviewed
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              Pending review
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-5 lg:sticky lg:top-24 fade-in-up animation-delay-200">
                <div className="p-6">
                {selectedCompany ? (
                  <>
                    <div className="mb-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Review Form
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {selectedCompany.company.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Share a concise, honest review for your current company.
                        Your active employment is validated before the review is
                        saved.
                      </p>
                    </div>

                    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-800">
                      Reviews are stored anonymously. AI extracts sentiment for
                      work-life balance, culture, career growth, and salary & benefits.
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      rows={8}
                      placeholder="Write your review about the company culture, growth, management, work environment, or anything useful for other jobseekers."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <p>Share clear and specific feedback for better trust signals.</p>
                      <p className="font-medium">{reviewText.length} chars</p>
                    </div>

                    {successMessage && (
                      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        {successMessage}
                      </div>
                    )}

                    {error && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitDisabled}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PenSquare className="h-4 w-4" />
                      )}
                      {hasExistingReview
                        ? hasReviewChanges
                          ? "Update Review"
                          : "No Changes Detected"
                        : "Submit Review"}
                    </button>

                    {hasExistingReview && !hasReviewChanges && (
                      <p className="mt-2 text-xs font-medium text-amber-700">
                        No changes detected. Edit your review text or rating to enable update.
                      </p>
                    )}
                  </>
                ) : null}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
