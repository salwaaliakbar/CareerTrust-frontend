import Link from "next/link";

export default function JobseekerCTA() {
  return (
    <section className="py-16 px-4 bg-[#f4f8fc]">
      <div className="max-w-7xl mx-auto text-center text-[#F4F4F4] fade-in bg-linear-to-br from-[#0c2b4e] via-[#134264] to-[#1d546c] rounded-2xl px-8 md:px-14 py-16 md:py-18 shadow-[0_28px_70px_-36px_rgba(5,25,45,0.75)] border border-[#2f6485]/30">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 fade-in animation-delay-100">Find your next opportunity</h2>
        <p className="text-lg md:text-xl text-sky-100 mb-6 fade-in animation-delay-200">Search thousands of verified jobs and apply with one click using your saved profile. Get personalized matches based on your skills, experience, and career goals so you can find the right role faster.</p>
        <Link
          href="/jobs"
          aria-label="Find jobs"
          className="inline-block bg-[#F4F4F4] text-[#1D546C] hover:bg-gray-100 px-7 py-3.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 fade-in animation-delay-300"
        >
          Find Jobs
        </Link>
      </div>
    </section>
  );
}
