import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

export type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPolicyTemplateProps = {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: PolicySection[];
};

export default function LegalPolicyTemplate({
  title,
  subtitle,
  effectiveDate,
  sections,
}: LegalPolicyTemplateProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8fc]">
      <section className="relative overflow-hidden border-b border-white/10 bg-linear-to-br from-[#0C2B4E] via-[#123B66] to-[#1D546C] px-4 pb-14 pt-16 sm:pt-20 text-white">
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-[#0C2B4E]/45 via-[#0C2B4E]/55 to-[#123B66]/85" />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-20 mx-auto max-w-5xl text-center">
          <span className="smooth-enter inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
            <ShieldCheck className="h-4 w-4" />
            CareerTrust Legal
          </span>
          <h1 className="smooth-enter animation-delay-100 mx-auto mt-6 max-w-4xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="fade-in-up animation-delay-200 mx-auto mt-5 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg">
            {subtitle}
          </p>
          <p className="fade-in-up animation-delay-300 mt-6 text-sm font-medium text-sky-100/90">
            Effective date: {effectiveDate}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <article className="fade-in-up rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C2B4E]">
                <FileText className="h-4 w-4" />
                Legal Document
              </div>
              <div className="inline-flex items-center gap-2 text-sm">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-medium text-[#1A4F8B] transition-colors duration-200 hover:text-[#0C2B4E]"
                >
                  Contact us
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              {sections.map((section, sectionIndex) => (
                <section
                  key={section.title}
                  className={`fade-in-up ${sectionIndex === 0 ? "animation-delay-100" : sectionIndex === 1 ? "animation-delay-200" : sectionIndex === 2 ? "animation-delay-300" : sectionIndex === 3 ? "animation-delay-400" : sectionIndex === 4 ? "animation-delay-500" : sectionIndex === 5 ? "animation-delay-600" : "animation-delay-700"}`}
                >
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>

                  {Array.isArray(section.paragraphs) && section.paragraphs.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-7 text-slate-600 sm:text-base">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base">
                          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A4F8B]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
