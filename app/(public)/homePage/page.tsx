// app/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorkSection";
import CTASection from "@/components/home/CTASection";
import { JOBSEEKER, EMPLOYER } from "@/constants/constant";
import StatsSection from "@/components/home/StatsSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import ScrollRevealSection from "@/components/ui/ScrollRevealSection";

export default async function HomePage() {
  const { userId } = await auth();

  console.log(userId);

  // Redirect to login if not authenticated
  // if (!userId) {
  //   redirect("/login");
  // }

  const user = await currentUser();
  console.log(user);
  const userRole = user?.unsafeMetadata?.role as string;
  if (userRole === JOBSEEKER) {
    redirect("/jobseeker/dashboard")
  } else if (userRole === EMPLOYER) {
    redirect("/employer");
  }
//   else{
// redirect("/employer")
//   }
  return (
    <div className="min-h-screen bg-[#f4f8fc]">
      <ScrollRevealSection threshold={0.08} rootMargin="0px 0px -8% 0px">
        <HeroSection />
      </ScrollRevealSection>
      <ScrollRevealSection threshold={0.14}>
        <StatsSection />
      </ScrollRevealSection>
      <ScrollRevealSection threshold={0.14}>
        <HowItWorksSection />
      </ScrollRevealSection>
      <ScrollRevealSection threshold={0.14}>
        <FeaturesSection />
      </ScrollRevealSection>
      <ScrollRevealSection threshold={0.14}>
        <TestimonialSection />
      </ScrollRevealSection>
      <ScrollRevealSection threshold={0.14}>
        <CTASection />
      </ScrollRevealSection>
    </div>
  );
}
