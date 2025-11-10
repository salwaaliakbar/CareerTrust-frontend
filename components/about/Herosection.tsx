import Carousel from "../ui/Carousel";
import Link from "next/link";
import { Users, Briefcase, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 px-4 bg-sky-700">
      {/* Decorative images (dimmed) — behind the content on md+ screens and auto-swap */}
      <Carousel
        leftSrc="/assets/images/office_1.jpg"
        rightSrc="/assets/images/employer3.jpg"
        intervalMs={6000}
      />

      <div className="relative max-w-7xl mx-auto z-20 flex items-center justify-center min-h-[48vh]">
        <div className="text-white text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 leading-tight mt-6">
            Welcome to CareerTrust
          </h1>
          <p className="text-xl text-sky-100 max-w-5xl mb-6">
            CareerTrust is Pakistan’s Smart Employment and Review Platform built
            to redefine transparency and trust in the hiring ecosystem. We
            provide verified employment histories, structured reputation
            profiles, and AI-powered insights that empower both job seekers and
            employers to make informed, confident, and accountable career
            decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
