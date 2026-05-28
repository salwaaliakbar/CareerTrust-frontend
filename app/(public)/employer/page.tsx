import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/employer/Herosection";
import FeaturedCandidates from "@/components/employer/FeaturedCandidates";
import EmployerSteps from "@/components/employer/EmployerSteps";
import CTASection from "@/components/employer/CTASection";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";

export default function EmployerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
          <HeroSection />
        </ScrollRevealSection>

        {/* How it works for employers */}
        <ScrollRevealSection threshold={0.14}>
          <EmployerSteps />
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <FeaturedCandidates />
        </ScrollRevealSection>

        <ScrollRevealSection threshold={0.14}>
          <CTASection />
        </ScrollRevealSection>
        {/* Value props / why section */}
        {/* <EmployerWhy /> */}
      </main>

      <Footer />
    </div>
  );
}
