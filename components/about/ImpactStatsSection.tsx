import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { aboutStats, delayClasses } from "./aboutData";

const icons = [Users, ShieldCheck, Sparkles];

export default function ImpactStatsSection() {
  return (
    <section className="relative smooth-enter bg-linear-to-br from-[#123B66] via-[#154778] to-[#1A4F8B] pb-14 pt-4 border-b border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {aboutStats.map((item, index) => {
          const Icon = icons[index] ?? Sparkles;
          return (
            <article
              key={item.value}
              className={`smooth-enter rounded-2xl border border-white/35 bg-white/95 p-6 shadow-xl shadow-[#0C2B4E]/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${delayClasses[index] ?? "animation-delay-100"}`}
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0C2B4E] to-[#1A4F8B] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
