import Image from "next/image";

export default function WhoWeAreSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 border-b border-slate-200/80 smooth-enter">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(14,116,217,0.08),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="smooth-enter-left">
          <p className="fade-in-up text-sm font-semibold uppercase tracking-[0.18em] text-[#1A4F8B]">
            Who We Are
          </p>
          <h2 className="fade-in-up animation-delay-100 mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Building Pakistan&apos;s most trusted employment infrastructure
          </h2>
          <p className="fade-in-up animation-delay-200 mt-5 text-base leading-7 text-slate-600">
            CareerTrust exists to remove uncertainty from hiring. We combine
            verification, structured reputation signals, and practical AI to
            help professionals and employers make clear, confident decisions.
          </p>
          <p className="fade-in-up animation-delay-300 mt-4 text-base leading-7 text-slate-600">
            Our goal is simple: make trust measurable at every step of the
            talent journey, from first application to long-term growth.
          </p>
        </div>

        <div className="smooth-enter-right animation-delay-200 relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-sky-100 to-indigo-100 blur-2xl opacity-70" />
          <Image
            src="/assets/images/office_3.jpg"
            alt="CareerTrust team collaborating in office"
            width={1200}
            height={760}
            className="h-108 w-full rounded-3xl object-cover shadow-2xl shadow-[#0C2B4E]/20 transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
