import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { problemPoints, solutionPoints } from "./aboutData";

export default function WhoWeAreSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 border-b border-slate-200/80 smooth-enter">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,116,217,0.08),transparent_45%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1A4F8B]">
            Problem To Solution
          </p>
          <h2 className="fade-in-up animation-delay-100 mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Solving trust gaps in modern hiring
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="fade-in-up rounded-2xl border border-rose-200 bg-rose-50/60 p-7 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Hiring Problems</h3>
            <div className="mt-4 space-y-4">
              {problemPoints.map((item, index) => (
                <div
                  key={item.title}
                  className={`fade-in-up rounded-xl border border-rose-100 bg-white px-4 py-3 ${index === 0 ? "animation-delay-100" : index === 1 ? "animation-delay-200" : "animation-delay-300"}`}
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="fade-in-up animation-delay-100 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-7 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">CareerTrust Solution</h3>
            <div className="mt-4 space-y-4">
              {solutionPoints.map((item, index) => (
                <div
                  key={item.title}
                  className={`fade-in-up rounded-xl border border-emerald-100 bg-white px-4 py-3 ${index === 0 ? "animation-delay-100" : index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-300" : "animation-delay-400"}`}
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
