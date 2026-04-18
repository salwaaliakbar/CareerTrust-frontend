import Carousel from "../ui/Carousel";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#0C2B4E] via-[#123B66] to-[#1A4F8B] px-4 pb-20 pt-2 sm:pt-8 border-b border-white/10">
      <Carousel
        leftSrc="/assets/images/office_1.jpg"
        rightSrc="/assets/images/employer3.jpg"
        intervalMs={6000}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-[#0C2B4E]/45 via-[#0C2B4E]/55 to-[#123B66]/85" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative z-20 mx-auto flex min-h-[56vh] max-w-7xl items-center justify-center">
        <div className="text-center text-white">
          <span className="smooth-enter inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
            <ShieldCheck className="h-4 w-4" />
            Trust-First Career Platform
          </span>

          <h1 className="smooth-enter animation-delay-100 mx-auto mt-6 max-w-5xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            About CareerTrust
          </h1>

          <p className="fade-in-up animation-delay-200 mx-auto mt-6 max-w-4xl text-base leading-7 text-sky-100 sm:text-lg">
            CareerTrust is Pakistan&apos;s smart employment and reputation platform, designed to bring clarity to hiring through verified experience, transparent feedback, and practical AI.
          </p>

          <div className="fade-in-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0C2B4E] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
            >
              Join CareerTrust
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
