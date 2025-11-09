import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/jobseeker/Herosection";
import StepsCarousel from "@/components/jobseeker/StepsCarousel";
// import CTASection from "@/components/home/CTASection";
import JobseekerCTA from "@/components/jobseeker/JobseekerCTA";

export default function JobseekerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Jobseeker hero (search + filters) */}
      <HeroSection />

  {/* Steps carousel explaining job seeker flow */}
  <StepsCarousel />

  {/* Jobseeker-specific CTA: quick link to job listings */}
  <JobseekerCTA />

  {/* <CTASection /> */}

      {/* You can add more jobseeker-specific sections below (features, CTA, etc.) */}

      <Footer />
    </div>
  );
}
