"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { EMPLOYER } from "@/constants/constant";
import { Candidate, DEMO_CANDIDATE } from "@/data/employer/candidate";
import { fetchFeaturedCandidates } from "@/services/api/employer.service";

export default function FeaturedCandidates({
  candidates = DEMO_CANDIDATE,
}: {
  candidates?: Candidate[];
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [liveCandidates, setLiveCandidates] = useState<Candidate[] | null>(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);

  const isEmployer = useMemo(
    () => isSignedIn && user?.unsafeMetadata?.role === EMPLOYER,
    [isSignedIn, user?.unsafeMetadata?.role],
  );

  useEffect(() => {
    const loadFeaturedCandidates = async () => {
      if (!isLoaded || !isEmployer) return;

      try {
        setIsLoadingFeatured(true);
        const data = await fetchFeaturedCandidates(getToken);
        const mappedCandidates =
          data?.candidates?.map((candidate) => ({
            id: String(candidate.id),
            name: candidate.fullName || "Unnamed Candidate",
            title: candidate.headline || "Open to opportunities",
            location: candidate.location || "Pakistan",
            skills: candidate.skills || [],
            avatar: candidate.profilePicUrl || undefined,
            verified: candidate.isProfileComplete,
          })) ?? [];

        if (mappedCandidates.length > 0) {
          setLiveCandidates(mappedCandidates);
        } else {
          setLiveCandidates(null);
        }
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedCandidates();
  }, [getToken, isEmployer, isLoaded]);

  const previewSkills = ["Communication", "Teamwork", "Problem Solving"];
  const visibleCandidates = isEmployer
    ? liveCandidates?.slice(0, 3) || candidates.slice(0, 3)
    : candidates.slice(0, 3);

  const postJobHref = isEmployer
    ? "/employer/post-job"
    : "/login?redirect=/employer/post-job";
  const browseCandidatesHref = isEmployer
    ? "/employer/candidates"
    : "/login?redirect=/employer/candidates";

  const cardTag = isEmployer ? "Verified Talent" : "Preview Card";

  return (
    <section
      aria-labelledby="featured-candidates"
      className="relative overflow-hidden bg-[#F4F6FB] py-16 md:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,64,175,0.09),transparent_52%)]" />
      <div className="absolute inset-0 opacity-[0.2] bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-size-[28px_28px]" />
      <div className="absolute top-6 right-1/4 h-96 w-96 rounded-full bg-[#0C2B4E]/8 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#1A4779]/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#0C2B4E]" />
            <span className="text-sm font-medium text-[#0C2B4E]">Top Talent</span>
          </div>

          <h3
            id="featured-candidates"
            className="mb-4 text-3xl font-bold tracking-tight text-[#0C2B4E] sm:text-4xl lg:text-5xl"
          >
            Featured Candidates
          </h3>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">
            Connect with exceptional talent ready to elevate your team.{" "}
            <Link
              href={postJobHref}
              className="group inline-flex items-center gap-1 font-semibold text-[#0C2B4E] transition-colors hover:text-[#1A3D64]"
            >
              Post a job
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </p>

          {!isEmployer && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              Preview mode: login as employer to unlock full candidate profiles.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isEmployer && isLoadingFeatured && !liveCandidates &&
            Array.from({ length: 3 }).map((_, idx) => (
              <article
                key={`featured-skeleton-${idx}`}
                className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="mb-6 flex items-start gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2">
                  <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-7 w-18 animate-pulse rounded-lg bg-slate-200" />
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-10 w-12 animate-pulse rounded-xl bg-slate-200" />
                </div>
              </article>
            ))}

          {(!isEmployer || !isLoadingFeatured || Boolean(liveCandidates)) &&
            visibleCandidates.map((c, idx) => (
            <article
              key={c.id}
              className={`group relative h-full fade-in-up ${
                idx === 0
                  ? "animation-delay-100"
                  : idx === 1
                    ? "animation-delay-200"
                    : "animation-delay-300"
              }`}
              role="article"
              aria-labelledby={`candidate-${c.id}`}
            >
              <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_28px_-18px_rgba(15,23,42,0.34)]">
                <div className="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-linear-to-r from-[#1A4779] via-[#2A5B96] to-[#5B8FC8] opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0C2B4E]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {cardTag}
                  </span>
                  <span className="text-xs text-slate-500">Candidate {idx + 1}</span>
                </div>

                <div className="mb-6 flex items-start gap-4">
                  <div className="relative">
                    {isEmployer && c.avatar ? (
                      <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-lg">
                        <Image
                          src={c.avatar}
                          alt={c.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#0C2B4E] to-[#1A4779] text-xl font-bold text-white shadow-lg">
                        {isEmployer ? c.name.split(" ")[0].charAt(0) : `S${idx + 1}`}
                      </div>
                    )}
                    {isEmployer && c.verified && (
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                        <CheckCircle className="h-4 w-4 fill-blue-100 text-[#0C2B4E]" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      id={`candidate-${c.id}`}
                      className="mb-1 truncate text-lg font-bold text-slate-900"
                    >
                      {isEmployer ? c.name : `Sample Candidate 0${idx + 1}`}
                    </h4>
                    <p className="mb-2 text-sm font-medium leading-5 text-slate-700">
                      {isEmployer ? c.title : "Preview profile - full details after login"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{isEmployer ? c.location : "Pakistan"}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Availability</p>
                    <p className="text-sm font-semibold text-slate-800">Immediate</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Work Mode</p>
                    <p className="text-sm font-semibold text-slate-800">Hybrid</p>
                  </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {(isEmployer ? c.skills || [] : previewSkills).map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={browseCandidatesHref}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0C2B4E] via-[#123560] to-[#1A4779] px-4 py-2.5 font-semibold text-white shadow-[0_14px_28px_-16px_rgba(15,23,42,0.55)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_18px_34px_-16px_rgba(15,23,42,0.65)] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1A3D64]/30"
                    aria-label={`View profile of ${c.name}`}
                  >
                    <UserRound className="h-4 w-4" />
                    {isEmployer ? "View Profile" : "Login to View"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center md:mt-14">
          <Link
            href={browseCandidatesHref}
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#0C2B4E]/10 bg-linear-to-r from-[#0C2B4E] via-[#123560] to-[#1A4779] px-7 py-3.5 font-semibold text-white shadow-[0_14px_28px_-16px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-16px_rgba(15,23,42,0.65)] focus:outline-none focus:ring-2 focus:ring-[#1A3D64]/30"
          >
            {isEmployer ? "View All Candidates" : "Login to View Candidates"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
