import { BadgeCheck, Lock, Sparkles } from "lucide-react";
import { delayClasses } from "./aboutData";

const commitments = [
  {
    icon: Lock,
    title: "Security & Privacy First",
    text: "From authentication to profile workflows, CareerTrust is designed to protect sensitive hiring and identity data.",
  },
  {
    icon: Sparkles,
    title: "Practical AI, Real Outcomes",
    text: "Our AI features are built to improve real hiring decisions with clear, actionable profile and recommendation insights.",
  },
  {
    icon: BadgeCheck,
    title: "Long-Term Trust Signals",
    text: "Verification, review transparency, and structured reputation context help teams hire with confidence over time.",
  },
];

export default function LeadershipSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200 smooth-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            CareerTrust Commitments
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600 fade-in animation-delay-100">
            Beyond features, we focus on responsible hiring infrastructure that
            keeps trust, transparency, and quality at the center.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {commitments.map((item, index) => {
            const Icon = item.icon;

            return (
            <article
              key={item.title}
              className={`fade-in-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${delayClasses[index] ?? "animation-delay-100"}`}
            >
              <div className="flex h-72 w-full items-center justify-center bg-linear-to-b from-slate-50 to-slate-100">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Icon className="h-12 w-12 text-[#1A4F8B]" aria-hidden="true" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
