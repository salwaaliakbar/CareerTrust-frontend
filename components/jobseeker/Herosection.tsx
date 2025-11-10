import JobSearchBar from "./JobSearchBar";
import Carousel from "../ui/Carousel";

function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 px-4">
      {/* Decorative images (dimmed) — appear behind the content on md+ screens and auto-swap */}
      <Carousel leftSrc="/assets/images/jobseeker1.jpg" rightSrc="/assets/images/jobseeker3.png" intervalMs={5000} />

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="flex item-center justify-center mt-8">
          <div className="w-full">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6  leading-tight text-center drop-shadow-lg">
              Find verified jobs and apply with confidence
            </h1>
            <p className="text-lg sm:text-xl text-white mb-17 leading-relaxed text-center max-w-4xl mx-auto opacity-95 drop-shadow-sm">
              Search verified opportunities and filter by location, role, and more.
            </p>

            {/* Client-side job search bar with filters */}
            <div className="mt-6">
              <JobSearchBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;