// app/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorkSection";
import CTASection from "@/components/home/CTASection";
import { JOBSEEKER, EMPLOYER } from "@/constants/constant";

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
    redirect("/jobseeker")
  } else if (userRole === EMPLOYER) {
    redirect("/employer");
  }
//   else{
// redirect("/employer")
//   }
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
