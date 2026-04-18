import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function CTASection() {
  return (
    <section className="py-22 px-4 bg-[#f4f8fc] relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto relative rounded-4xl overflow-hidden border border-[#1f4f74]/40 shadow-[0_28px_70px_-30px_rgba(7,26,46,0.8)] bg-linear-to-br from-[#0b253f] via-[#0f3558] to-[#1d546c] animate-gradient">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-12 w-64 h-64 bg-[#8ad2ff] rounded-full blur-3xl float" />
          <div className="absolute bottom-8 left-8 w-72 h-72 bg-[#f4c56a] rounded-full blur-3xl float-delayed" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[34px_34px]" />
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-[#06182a]/70 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-10 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 fade-in-up border border-white/30">
              <Sparkles className="w-4 h-4 text-[#f4c56a]" />
              <span className="text-white/95 text-sm font-medium">
                Join CareerTrust{`'`}s fastest-growing job platform
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 fade-in animation-delay-100">
              Ready to Build a Trusted Career Journey?
            </h2>

            <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto fade-in animation-delay-200">
              Start with verified profiles, transparent hiring signals, and better matches.
              CareerTrust helps both candidates and employers move faster with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in animation-delay-300">
              <Link
                href="/signup"
                aria-label="Get started free"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold bg-[#f4c56a] text-[#102e4c] shadow-lg hover:bg-[#ffd689] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c56a]/50"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                aria-label="Learn more about CareerTrust"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold border border-white/45 text-white bg-transparent hover:bg-white/12 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Learn More
              </Link>
            </div>

            <p className="mt-8 text-white/70 text-sm fade-in animation-delay-400">
              No credit card required • Free account forever • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
