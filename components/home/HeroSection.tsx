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
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-10 leading-tight text-center drop-shadow-lg">
              Trust in Your <span className="text-primary">Professional</span>{" "}
              Journey
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 leading-relaxed text-center max-w-5xl mx-auto opacity-95 drop-shadow-sm">
              CareerTrust is Pakistan smart employment platform that bridges
              the trust gap between job seekers and employers through verified
              employment records, transparent reviews, and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup?role=jobseeker"
                className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-white font-medium shadow-sm"
              >
                Find Your Opportunity
              </Link>
              <ArrowRight className="w-5 h-5 text-white mx-2" />
              <Link
                href="/signup?role=employer"
                className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-white font-medium shadow-sm"
              >
                Hire Top Talent
              </Link>
            </div>

            {/* Trust Indicators
            <div className="mt-12 space-y-3">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Verified Employment Records</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Transparent Company Reputation Scores</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>AI-Powered Smart Job Matching</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;