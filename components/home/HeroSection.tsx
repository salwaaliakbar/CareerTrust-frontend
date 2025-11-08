// components/home/HeroSection.tsx
import Link from "next/link";
import {
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react";

function HeroSection() {
  return (
    <section className="relative from-blue-50 via-white to-amber-50 pt-20 pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Trust in Your <span className="text-primary">Professional</span>{" "}
              Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              CareerTrust is Pakistan smart employment platform that bridges
              the trust gap between job seekers and employers through verified
              employment records, transparent reviews, and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup?role=jobseeker"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Find Your Opportunity <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup?role=employer"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Hire Top Talent
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Verified Employment Records</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Transparent Company Reputation Scores</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>AI-Powered Smart Job Matching</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute inset-0 from-primary/10 to-accent/10 rounded-2xl"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-2xl opacity-20 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent rounded-2xl opacity-20 blur-3xl"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Trusted by Thousands
                </h3>
                <p className="text-gray-600">Job Seekers & Employers Nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;