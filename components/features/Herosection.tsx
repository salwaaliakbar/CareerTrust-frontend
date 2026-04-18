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
            Our Features & Services
          </h1>
          <p className="text-xl text-sky-100 max-w-5xl mb-6">
            Discover how CareerTrust blends verification, AI intelligence, and
            transparent hiring workflows to redefine Pakistan's job market.
          </p>
        </div>
      </div>
    </section>
  );
}
