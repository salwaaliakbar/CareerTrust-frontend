import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/jobseeker/Herosection";
import StepsCarousel from "@/components/jobseeker/StepsCarousel";
import JobseekerCTA from "@/components/jobseeker/JobseekerCTA";
import TrustStats from "@/components/jobseeker/TrustStats";
import FeaturedJobs from "@/components/jobseeker/FeaturedJobs";
import MoveToLoginCTA from "@/components/jobseeker/MoveToLoginCTA";

export default function JobseekerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Jobseeker hero (search + filters) */}
      <HeroSection />

      {/* Steps carousel explaining job seeker flow */}
      <StepsCarousel />

      {/* Trust statistics */}
      <TrustStats />

      {/* Jobseeker-specific CTA: quick link to job listings */}
      <JobseekerCTA />

       {/* Featured jobs - show opportunities right after hero */}
      <FeaturedJobs />

      {/* Login/Signup CTA */}
      <MoveToLoginCTA />

      <Footer />
    </div>
  );
}
