import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f8fc] py-20 px-4 smooth-enter">
      <div className="mx-auto max-w-7xl rounded-4xl border border-[#1f4f74]/40 bg-linear-to-br from-[#0b253f] via-[#0f3558] to-[#1d546c] shadow-[0_28px_70px_-30px_rgba(7,26,46,0.8)]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-8 right-10 h-64 w-64 rounded-full bg-[#8ad2ff] blur-3xl float" />
          <div className="absolute bottom-6 left-8 h-72 w-72 rounded-full bg-[#7db7ff] blur-3xl float-delayed" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[34px_34px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center sm:px-10 smooth-enter">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl fade-in-up animation-delay-100">
            Ready to grow with trust?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85 fade-in animation-delay-200">
            Whether you are hiring or building your career, CareerTrust gives
            you the confidence to move forward with verified information and
            meaningful insights.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row fade-in animation-delay-300">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8ad2ff] px-6 py-3 text-sm font-semibold text-[#0C2B4E] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a1dcff]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/45 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
