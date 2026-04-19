import Image from "next/image";
import { Sparkles, ShieldCheck, BadgeCheck } from "lucide-react";

export default function TrustPillarsSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 border-b border-slate-200/80 smooth-enter">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(14,116,217,0.08),transparent_40%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="smooth-enter-left">
          <p className="fade-in-up text-sm font-semibold uppercase tracking-[0.18em] text-[#1A4F8B]">
            Platform Impact
          </p>
          <h2 className="fade-in-up animation-delay-100 mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Built to make hiring clearer, safer, and faster
          </h2>
          <p className="fade-in-up animation-delay-200 mt-5 text-base leading-7 text-slate-600">
            CareerTrust combines verified profiles, practical AI, and structured
            hiring transparency so employers and jobseekers can make decisions
            with confidence instead of guesswork.
          </p>

          <div className="fade-in-up animation-delay-300 mt-6 space-y-3">
            <div className="fade-in-up animation-delay-100 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#1A4F8B]" />
              <p className="text-sm text-slate-700">
                Verification-first records reduce uncertainty in candidate and
                employer credibility.
              </p>
            </div>
            <div className="fade-in-up animation-delay-200 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-[#1A4F8B]" />
              <p className="text-sm text-slate-700">
                AI-guided insights improve matching quality and accelerate shortlisting.
              </p>
            </div>
            <div className="fade-in-up animation-delay-300 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-[#1A4F8B]" />
              <p className="text-sm text-slate-700">
                Transparent reputation and dual verification build long-term trust.
              </p>
            </div>
          </div>
        </div>

        <div className="smooth-enter-right animation-delay-200 relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-sky-100 to-indigo-100 blur-2xl opacity-70" />
          <Image
            src="/assets/images/office_3.jpg"
            alt="CareerTrust team collaborating"
            width={1200}
            height={760}
            className="h-108 w-full rounded-3xl object-cover shadow-2xl shadow-[#0C2B4E]/20 transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
