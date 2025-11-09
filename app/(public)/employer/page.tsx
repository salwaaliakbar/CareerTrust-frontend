import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/employer/Herosection";
import EmployerWhy from "@/components/employer/EmployerWhy";
import FeaturedCandidates from "@/components/employer/FeaturedCandidates";
import EmployerSteps from "@/components/employer/EmployerSteps";
import CTASection from "@/components/employer/CTASection";

export default function EmployerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection />

        {/* How it works for employers */}
        <EmployerSteps />

        {/* Featured candidates (client carousel) */}
        <FeaturedCandidates />

        <CTASection />
        {/* Value props / why section */}
        {/* <EmployerWhy /> */}
      </main>

      <Footer />
    </div>
  );
}
