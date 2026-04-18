import { delayClasses, processSteps } from "./aboutData";

export default function ProcessFlowSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 border-b border-slate-200 smooth-enter">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(12,43,78,0.06),transparent_40%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1A4F8B]">
            How It Flows
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl animation-delay-100">
            Trust pipeline from data to decisions
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className={`fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${delayClasses[index] ?? "animation-delay-100"}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A4F8B]">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
