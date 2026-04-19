import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-[#F4F6FB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-[#F4F4F4] fade-in">
        <div className="relative overflow-hidden rounded-3xl border border-[#2f6485]/30 bg-linear-to-br from-[#0c2b4e] via-[#134264] to-[#1d546c] px-6 sm:px-10 py-10 md:py-12 shadow-[0_28px_70px_-36px_rgba(5,25,45,0.75)]">
          <div className="absolute -top-14 -right-10 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-size-[34px_34px]" />

          <div className="relative z-10 flex flex-col items-center md:items-stretch md:flex-row md:justify-between gap-6 md:gap-8 py-10">
            <div className="text-center md:text-left fade-in animation-delay-100 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Discover trusted companies</h2>
              <p className="text-lg md:text-xl text-sky-100 mb-0">Browse company profiles, see open roles, and connect with top employers on CareerTrust.</p>
            </div>

            <div className="shrink-0 fade-in animation-delay-200">
            <Link
              href="/companies"
              aria-label="Explore companies"
              className="inline-flex items-center justify-center bg-[#f4c56a] text-[#0C2B4E] hover:bg-[#f4c56a]/90 px-7 py-3.5 rounded-full font-semibold shadow-[0_12px_24px_-14px_rgba(244,197,106,0.58)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              Explore Companies
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
