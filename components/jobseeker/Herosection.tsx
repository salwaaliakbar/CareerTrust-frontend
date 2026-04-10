import JobSearchBar from "./JobSearchBar";
import Carousel from "../ui/Carousel";
import TypedText from "../ui/TypedText";

function HeroSection() {
  return (
    <section className="relative pt-10 pb-28 md:pt-14 md:pb-32 px-4 overflow-hidden">
      <Carousel leftSrc="/assets/images/jobseeker1.jpg" rightSrc="/assets/images/jobseeker3.png" intervalMs={5000} />
      <div className="absolute inset-0 z-10 bg-linear-to-br from-[#071c31]/85 via-[#0c2b4e]/78 to-[#1d546c]/72 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="flex items-center justify-center">
          <div className="w-full">
            <div className="flex justify-center mb-8 fade-in-up">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur-sm">
                Jobseeker Zone • Verified Opportunities
              </span>
            </div>

            <h1 className="max-w-3xl lg:max-w-4xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-center drop-shadow-lg smooth-enter">
              Find{" "}
              <TypedText
                words={["verified jobs"]}
                typingSpeed={120}
                deletingSpeed={70}
                pauseMs={2200}
                loop={false}
                className="text-sky-300"
              />{" "}
              and apply with
              <span className="block text-sky-300">
                <TypedText
                  words={["full confidence"]}
                  typingSpeed={120}
                  deletingSpeed={70}
                  pauseMs={2200}
                  loop={false}
                  className="text-sky-300"
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white mb-20 leading-relaxed text-center max-w-4xl mx-auto opacity-95 drop-shadow-sm fade-in animation-delay-100">
              Search verified opportunities and filter by location, role, and more.
            </p>

            <div className="mt-4 fade-in-up animation-delay-300">
              <JobSearchBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;