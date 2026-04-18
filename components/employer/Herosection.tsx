import Carousel from "../ui/Carousel";
import Link from "next/link";
import { Users, Briefcase, Clock } from "lucide-react";
import TypedText from "../ui/TypedText";

export default function HeroSection() {
  return (
    <section className="relative pt-14 pb-24 md:pb-28 px-4 bg-sky-700 overflow-hidden">
      {/* Decorative images (dimmed) — behind the content on md+ screens and auto-swap */}
      <Carousel
        leftSrc="/assets/images/employer1.jpg"
        rightSrc="/assets/images/employer3.jpg"
        intervalMs={6000}
      />

      <div className="absolute inset-0 z-10 bg-linear-to-br from-[#061b31]/82 via-[#0c2b4e]/74 to-[#1d546c]/68 pointer-events-none" />
      <div className="absolute -top-24 -right-16 z-10 h-72 w-72 rounded-full bg-sky-300/16 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 z-10 h-72 w-72 rounded-full bg-cyan-300/16 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-20 flex items-center justify-center min-h-[50vh]">
        <div className="w-full text-white text-center">
          <div className="inline-flex items-center rounded-full border border-white/22 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur-sm mb-6 fade-in-up">
            Employer Zone • Verified Hiring Pipeline
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold mb-8 leading-tight smooth-enter">
            Hire <span className="text-sky-300"><TypedText words={["faster"]} typingSpeed={120} deletingSpeed={70} pauseMs={2200} loop={false} className="text-sky-300" /></span>, hire <span className="text-sky-300"><TypedText words={["smarter"]} typingSpeed={120} deletingSpeed={70} pauseMs={2200} loop={false} className="text-sky-300" /></span>
          </h1>

          <p className="text-lg text-sky-100/95 max-w-3xl mx-auto mb-8 fade-in animation-delay-100">
            Reach verified candidates, streamline hiring with one-click
            screening, and build a trusted employer brand on CareerTrust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 fade-in animation-delay-200">
            <Link
              href="/employer/post-job"
              className="inline-flex min-w-47.5 items-center justify-center px-8 py-3.5 bg-white text-[#0C2B4E] rounded-full font-semibold shadow-[0_14px_28px_-16px_rgba(15,23,42,0.55)] hover:shadow-[0_18px_34px_-16px_rgba(15,23,42,0.65)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="Post a job"
              title="Post a job"
            >
              Post a Job
            </Link>

            <Link
              href="/employer/candidates"
              className="inline-flex min-w-47.5 items-center justify-center px-8 py-3.5 bg-white/8 border border-white/24 text-white rounded-full font-semibold hover:bg-white/14 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="Browse candidates"
              title="Browse candidates"
            >
              Browse Candidates
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto fade-in animation-delay-300">
            <div className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/8 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:-translate-y-0.5">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">20k+</div>
                <div className="text-sm text-sky-100/90">Verified candidates</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/8 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:-translate-y-0.5">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">5k+</div>
                <div className="text-sm text-sky-100/90">Jobs posted</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/8 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:-translate-y-0.5">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">Avg. 3 days</div>
                <div className="text-sm text-sky-100/90">to hire</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
