"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/about/Herosection";
import WhoWeAreSection from "@/components/about/WhoWeAreSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import TrustPillarsSection from "@/components/about/TrustPillarsSection";
import ProcessFlowSection from "@/components/about/ProcessFlowSection";
import LeadershipSection from "@/components/about/LeadershipSection";
import AboutCTASection from "@/components/about/AboutCTASection";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-white">
        <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
          <HeroSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <WhoWeAreSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <MissionVisionSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <TrustPillarsSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <ProcessFlowSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <LeadershipSection />
        </ScrollRevealSection>
        <ScrollRevealSection threshold={0.14}>
          <AboutCTASection />
        </ScrollRevealSection>
      </main>
      <Footer />
    </>
  );
}

export const LOGIN = "/login";
export const SIGNUP = "/signup";
