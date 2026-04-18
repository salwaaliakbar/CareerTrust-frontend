"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/Herosection";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";
import ServiceCard from "@/components/services/ServiceCard";
import {
  SERVICES_LIST,
  WHY_CHOOSE_CARDS,
} from "@/data/services/servicesData";

export default function FeaturesPage() {
  const delays = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
    "animation-delay-700",
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#f4f8fc]">
        <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
          <HeroSection />
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="relative border-b border-slate-200/80 bg-linear-to-b from-[#edf5fd] via-[#f7fbff] to-[#f4f8fc] py-16">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0c2b4e0a_1px,transparent_1px),linear-gradient(to_bottom,#0c2b4e0a_1px,transparent_1px)] bg-size-[44px_44px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <h2 className="fade-in text-3xl font-bold text-[#0c2b4e] sm:text-4xl">
                  Platform Features Built for Trusted Hiring
                </h2>
                <p className="fade-in animation-delay-100 mx-auto mt-3 max-w-3xl text-base text-[#4b627a] sm:text-lg">
                  CareerTrust combines verification-first workflows, AI-assisted
                  hiring support, and transparent reputation signals to connect
                  trusted talent with trusted employers.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES_LIST.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    delayClass={delays[index % delays.length]}
                  />
                ))}
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="border-b border-slate-200 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <h2 className="fade-in text-3xl font-bold text-[#0c2b4e] sm:text-4xl">
                  Why Choose CareerTrust
                </h2>
                <p className="fade-in animation-delay-100 mx-auto mt-3 max-w-3xl text-base text-[#4b627a] sm:text-lg">
                  We make hiring more reliable with verified profiles,
                  explainable AI recommendations, and accountability in every
                  hiring stage.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {WHY_CHOOSE_CARDS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className={`fade-in-up rounded-2xl border border-[#dce8f5] bg-[#f8fbff] p-6 shadow-[0_12px_30px_-24px_rgba(12,43,78,0.72)] ${delays[index]}`}
                    >
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9ebfb] text-[#0c2b4e]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#102d4a]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#546d85]">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <section className="bg-[#f4f8fc] px-4 py-18">
            <div className="mx-auto max-w-7xl rounded-3xl border border-[#1f4f74]/35 bg-linear-to-br from-[#0b253f] via-[#0f3558] to-[#1d546c] px-6 py-14 text-white shadow-[0_28px_70px_-30px_rgba(7,26,46,0.8)] sm:px-10">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="fade-in text-3xl font-bold sm:text-4xl">
                  Ready to Build a Trusted Career Journey?
                </h2>
                <p className="fade-in animation-delay-100 mt-4 text-base text-blue-100 sm:text-lg">
                  Use CareerTrust to build a verified profile, discover better
                  job matches, and make transparent hiring decisions.
                </p>

                <div className="fade-in animation-delay-200 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4c56a] px-6 py-3 text-sm font-semibold text-[#102e4c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd689] sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/employer/post-job"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/45 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollRevealSection>
      </main>
      <Footer />
    </>
  );
}
