"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Loader2,
  MapPin,
  MessageSquareText,
  PenSquare,
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

  const handleSelect = (company: EligibleCompanyForReview) => {
    setSelectedCompanyId(company.company.id);
    setRating(company.existingReview?.rating ?? 0);
    setReviewText(company.existingReview?.reviewText ?? "");
    setSuccessMessage(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedCompany) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      await submitCompanyReview(
        {
          companyId: selectedCompany.company.id,
          rating,
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

      setSuccessMessage("Your company review has been saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-2">
              <Link
                href="/jobseeker/dashboard"
                className="text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <MessageSquareText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Give Company Reviews
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  You can review only the company where you are currently
                  working.
                </p>
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
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-4">
                {companies.map((item) => {
                  const isSelected = item.company.id === selectedCompanyId;
                  return (
                    <button
                      key={item.company.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full rounded-2xl border bg-white p-6 text-left shadow-sm transition ${
                        isSelected
                          ? "border-blue-300 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                            {item.company.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.company.logo}
                                alt={item.company.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-7 w-7 text-slate-400" />
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
                          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            Review saved
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
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

                    <div className="mb-6 flex flex-wrap items-center gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="transition hover:scale-105"
                          aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                        >
                          <Star
                            className={`h-8 w-8 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      rows={8}
                      placeholder="Write your review about the company culture, growth, management, work environment, or anything useful for other jobseekers."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />

                    {successMessage && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
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
                      disabled={
                        submitting ||
                        rating === 0 ||
                        reviewText.trim().length === 0
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PenSquare className="h-4 w-4" />
                      )}
                      {selectedCompany.existingReview
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                  </>
                ) : null}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
