import Link from "next/link";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import Carousel from "../ui/Carousel";

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-13 pb-36 md:pb-44 px-4">
      {/* Decorative images (dimmed) — appear behind the content on md+ screens and auto-swap */}
      <Carousel
        leftSrc="/assets/images/general2.png"
        rightSrc="/assets/images/general1 - Copy.png"
        intervalMs={5000}
      />

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="flex item-center justify-center">
          <div>
            <div className="flex justify-center mb-4">
            {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-white text-sm font-medium">
              Trusted by 50,000+ professionals
            </span>
          </div>
          </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight text-center drop-shadow-lg fade-in-down">
              Trust in Your <span className="text-sky-300">Professional</span>{" "}
              Journey
            </h1>
            <p className="text-lg sm:text-xl text-white mb-8 leading-relaxed text-center max-w-3xl mx-auto opacity-95 drop-shadow-sm fade-in animation-delay-100">
              CareerTrust is Pakistan smart employment platform that bridges the
              trust gap between job seekers and employers through verified
              employment records, transparent reviews, and AI-driven insights.
            </p>

            {/* Role Selection */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center fade-in animation-delay-200 mt-15">
              <Link href="/signup?role=jobseeker" className="w-full sm:w-auto">
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-primary-foreground/20 transition-smooth cursor-pointer hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-300 shadow-lg ring-1 ring-white/20 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-[#0C2B4E]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">
                        I{`'`}m a Job Seeker
                      </h3>
                      <p className="text-sm text-white">Find your dream job</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-smooth ml-auto" />
                  </div>
                </div>
              </Link>
              <Link href="/signup?role=employer" className="w-full sm:w-auto">
                <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-primary-foreground/20 transition-smooth cursor-pointer hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-300 shadow-lg ring-1 ring-white/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#0C2B4E]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">
                        I{`'`}m an Employer
                      </h3>
                      <p className="text-sm text-white">
                        Post jobs & find talent
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-smooth ml-auto" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Wave Divider (lifted above carousel overlay) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-300">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden="true"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
            // className="drop-shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
