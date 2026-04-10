import { BadgeCheck, Brain, ShieldCheck } from "lucide-react";
import { delayClasses, trustPillars } from "./aboutData";

const icons = [ShieldCheck, Brain, BadgeCheck];

export default function TrustPillarsSection() {
  return (
    <section className="bg-linear-to-br from-[#0C2B4E] via-[#123B66] to-[#1A4F8B] py-16 sm:py-20 border-y border-white/10 smooth-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Why CareerTrust Works
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-blue-100 fade-in animation-delay-100">
            We designed CareerTrust around trust architecture, not just job
            listings.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {trustPillars.map((pillar, index) => {
            const Icon = icons[index] ?? ShieldCheck;
            return (
              <article
                key={pillar.title}
                className={`stagger-item rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 ${delayClasses[index] ?? "animation-delay-100"}`}
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0C2B4E]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100">
                  {pillar.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
