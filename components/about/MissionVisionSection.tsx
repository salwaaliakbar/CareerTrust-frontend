import { Target, Telescope } from "lucide-react";

export default function MissionVisionSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200 smooth-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1A4F8B]">
            Direction
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl animation-delay-100">
            Mission-driven. Future-focused.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="fade-in-up animation-delay-100 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0C2B4E] text-white">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
            <p className="mt-4 leading-7 text-slate-600">
              Build trust into hiring by making profile quality, employment
              validation, and feedback integrity reliable for every stakeholder.
            </p>
          </article>

          <article className="fade-in-up animation-delay-200 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0C2B4E] text-white">
              <Telescope className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
            <p className="mt-4 leading-7 text-slate-600">
              Create a smarter and transparent employment ecosystem where AI and
              verification improve opportunities, decisions, and long-term
              hiring outcomes.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
