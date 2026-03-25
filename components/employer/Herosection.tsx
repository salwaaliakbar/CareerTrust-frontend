import Carousel from "../ui/Carousel";
import Link from "next/link";
import { Users, Briefcase, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 px-4 bg-sky-700">
      {/* Decorative images (dimmed) — behind the content on md+ screens and auto-swap */}
      <Carousel
        leftSrc="/assets/images/employer1.jpg"
        rightSrc="/assets/images/employer3.jpg"
        intervalMs={6000}
      />

      <div className="relative max-w-7xl mx-auto z-20 flex items-center justify-center min-h-[48vh]">
        <div className="text-white text-center">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold mb-8 leading-tight mt-6 fade-in-down">
            Hire faster, hire smarter
          </h1>
          <p className="text-lg text-sky-100 max-w-2xl mb-6 fade-in animation-delay-100">
            Reach verified candidates, streamline hiring with one-click
            screening, and build a trusted employer brand on CareerTrust.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-15 fade-in animation-delay-200">
            <Link
              href="/employer/post-job"
              className="inline-flex items-center justify-center px-14 py-3 bg-white text-[#0C2B4E] rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Post a job"
              title="Post a job"
            >
              Post a Job
            </Link>

            <Link
              href="/employer/candidates"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Browse candidates"
              title="Browse candidates"
            >
              Browse Candidates
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-15 max-w-2xl mx-auto fade-in animation-delay-300">
            <div className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">20k+</div>
                <div className="text-sm text-sky-100">Verified candidates</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">5k+</div>
                <div className="text-sm text-sky-100">Jobs posted</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Avg. 3 days</div>
                <div className="text-sm text-sky-100">to hire</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
