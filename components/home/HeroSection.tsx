import Link from "next/link";
import { ArrowRight, Briefcase, ShieldCheck, Users } from "lucide-react";
import Carousel from "../ui/Carousel";
import TypedText from "../ui/TypedText";

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-28 md:pt-14 md:pb-36 px-4">
      <Carousel
        leftSrc="/assets/images/general2.png"
        rightSrc="/assets/images/general1 - Copy.png"
        intervalMs={5000}
      />
      <div className="absolute inset-0 z-10 bg-linear-to-br from-[#051221]/85 via-[#0c2b4e]/75 to-[#1d546c]/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="flex items-center justify-center">
          <div>
            <div className="flex justify-center mb-5 fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-md rounded-full px-5 py-2 border border-white/25">
                <ShieldCheck className="w-4 h-4 text-[#f4c56a]" />
                <span className="text-white/95 text-sm font-semibold tracking-wide">
                  Trusted by 50,000+ professionals
                </span>
              </div>
            </div>

            <h1 className="max-w-3xl lg:max-w-4xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-center drop-shadow-lg fade-in-down">
              Hire and Get Hired with{" "}
              <span className="text-[#8ad2ff]">
                <TypedText
                  words={["Verified Professional Trust"]}
                  typingSpeed={120}
                  deletingSpeed={70}
                  pauseMs={2200}
                  loop={false}
                  className="text-[#8ad2ff]"
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed text-center max-w-3xl mx-auto drop-shadow-sm fade-in animation-delay-100">
              CareerTrust bridges hiring confidence with employment
              verification, transparent reputation signals, and AI-driven
              matching for job seekers and employers across Pakistan.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in animation-delay-200">
              <Link href="/signup?role=jobseeker" className="w-full sm:w-auto">
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/25 hover:bg-white/20 transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0b233f]/40">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8ad2ff] shadow-lg ring-1 ring-white/20 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-[#0C2B4E]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">
                        I{`'`}m a Job Seeker
                      </h3>
                      <p className="text-sm text-white/85">
                        Find your next trusted role
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                  </div>
                </div>
              </Link>

              <Link href="/signup?role=employer" className="w-full sm:w-auto">
                <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/25 hover:bg-white/20 transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0b233f]/40">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8ad2ff] shadow-lg ring-1 ring-white/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#0C2B4E]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">
                        I{`'`}m an Employer
                      </h3>
                      <p className="text-sm text-white/85">
                        Source pre-verified candidates
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-9 text-center fade-in animation-delay-300">
              <p className="text-sm text-white/75 tracking-wide">
                Verified records • Reputation intelligence • AI-powered
                recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

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
            fill="#f4f8fc"
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
