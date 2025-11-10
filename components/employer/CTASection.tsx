import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-[#1D546C]">
      <div className="max-w-4xl mx-auto text-[#F4F4F4]">
        <div className="flex flex-col items-center md:items-stretch md:flex-row md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Discover trusted companies</h2>
            <p className="text-lg md:text-xl text-sky-100 mb-0">Browse company profiles, see open roles, and connect with top employers on CareerTrust.</p>
          </div>

          <div className="shrink-0">
            <Link
              href="/companies"
              aria-label="Explore companies"
              className="inline-block bg-[#F4F4F4] text-[#1D546C] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-lg transition"
            >
              Explore Companies
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
