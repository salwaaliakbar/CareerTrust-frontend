import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import Carousel from "../ui/Carousel";

function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-4">
  {/* Decorative images (dimmed) — appear behind the content on md+ screens and auto-swap */}
  <Carousel leftSrc="/assets/images/general2.png" rightSrc="/assets/images/general1 - Copy.png" intervalMs={5000} />

  <div className="relative max-w-7xl mx-auto z-20">
        <div className="flex item-center justify-center mt-10">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-10 leading-tight text-center drop-shadow-lg fade-in-down">
              Trust in Your <span className="text-primary">Professional</span>{" "}
              Journey
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 leading-relaxed text-center max-w-5xl mx-auto opacity-95 drop-shadow-sm fade-in animation-delay-100">
              CareerTrust is Pakistan smart employment platform that bridges
              the trust gap between job seekers and employers through verified
              employment records, transparent reviews, and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in animation-delay-200">
              <Link
                href="/signup?role=jobseeker"
                className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-white font-medium shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Find Your Opportunity
              </Link>
              <ArrowRight className="w-5 h-5 text-white mx-2 transition-all duration-300 hover:translate-x-1" />
              <Link
                href="/signup?role=employer"
                className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-white font-medium shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Hire Top Talent
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;