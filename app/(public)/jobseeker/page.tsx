import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/jobseeker/Herosection";
import StepsCarousel from "@/components/jobseeker/StepsCarousel";
import JobseekerCTA from "@/components/jobseeker/JobseekerCTA";
import TrustStats from "@/components/jobseeker/TrustStats";
import FeaturedJobs from "@/components/jobseeker/FeaturedJobs";
import MoveToLoginCTA from "@/components/jobseeker/MoveToLoginCTA";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";

export default function JobseekerPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fc]">
      <Header />

      <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
        <HeroSection />
      </ScrollRevealSection>

      <ScrollRevealSection threshold={0.14}>
        <TrustStats />
      </ScrollRevealSection>

      <ScrollRevealSection threshold={0.14}>
        <StepsCarousel />
      </ScrollRevealSection>

       <ScrollRevealSection threshold={0.14}>
        <JobseekerCTA />
      </ScrollRevealSection>

      <ScrollRevealSection threshold={0.14}>
        <FeaturedJobs />
      </ScrollRevealSection>

      <ScrollRevealSection threshold={0.14}>
        <MoveToLoginCTA />
      </ScrollRevealSection>

      <Footer />
    </div>
  );
}
