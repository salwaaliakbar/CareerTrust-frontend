import Link from "next/link";

export default function JobseekerCTA() {
  return (
    <section className="py-16 px-4 bg-[#1D546C]">
      <div className="max-w-4xl mx-auto text-center text-[#F4F4F4] fade-in">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 fade-in animation-delay-100">Find your next opportunity</h2>
        <p className="text-lg md:text-xl text-sky-100 mb-6 fade-in animation-delay-200">Search thousands of verified jobs and apply with one click using your saved profile.</p>
        <Link
          href="/jobs"
          aria-label="Find jobs"
          className="inline-block bg-[#F4F4F4] text-[#1D546C] hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 fade-in animation-delay-300"
        >
          Find Jobs
        </Link>
      </div>
    </section>
  );
}
