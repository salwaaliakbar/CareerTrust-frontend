"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/about/Herosection";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const founders = [
    {
      name: "Julia Holmes",
      role: "CEO",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    },
    {
      name: "David Martinez",
      role: "CFO",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop",
    },
  ];

  const values = [
    {
      title: "Empowering Job Seekers and Employers",
      content:
        "CareerTrust bridges the gap between job seekers and employers by ensuring every opportunity is backed by authenticity. Through verified employment histories and structured reputation profiles, we empower individuals to grow confidently and help companies hire with trust and clarity.",
    },
    {
      title: "Transparency That Builds Confidence",
      content:
        "We believe trust is built on transparency. CareerTrust verifies every employment record and review using secure validation processes, eliminating fake experiences and biased feedback. Our system ensures that both employers and professionals can make informed, reliable decisions.",
    },
    {
      title: "AI-Powered Growth and Fairness",
      content:
        "Artificial intelligence powers CareerTrust to deliver smart job recommendations, resume parsing, and sentiment analysis for reviews. These intelligent features make hiring more accurate, unbiased, and personalized—helping everyone find the right match faster.",
    },
    {
      title: "Innovation with Integrity",
      content:
        "Continuous improvement drives everything we do. From secure authentication to real-time analytics, CareerTrust evolves with technology to maintain fairness, accountability, and efficiency. Our goal is to redefine Pakistan’s employment landscape with innovation rooted in integrity.",
    },
  ];

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % founders.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + founders.length) % founders.length);
  const goToSlide = (index: number) => setCurrentSlide(index);
  const visibleFounders = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const position = i - 2;
      const index =
        (currentSlide + position + founders.length) % founders.length;
      return { ...founders[index], position };
    });
  }, [currentSlide, founders]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSection />

        {/* About Sections */}
        <section className="flex flex-col md:flex-row items-center gap-8 p-8 fade-in">
          <figure className="w-full md:w-1/2 fade-in animation-delay-100">
            <img
              src="/assets/images/office_2.jpg"
              alt="Office environment"
              className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
            />
          </figure>
          <div className="w-full md:w-1/2 fade-in animation-delay-200">
            <h2 className="text-2xl font-bold mb-2">Success is our GOAL!</h2>
            <p>
              At CareerTrust, success means more than landing a job—it’s about
              building trust, credibility, and long-term professional growth. We
              empower both job seekers and employers through verified employment
              records, authentic reviews, and transparent insights. Our mission
              is to eliminate doubt from the hiring process so every opportunity
              leads to meaningful and trusted success.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 p-8 fade-in animation-delay-300">
          <div className="w-full md:w-1/2 fade-in animation-delay-400">
            <h2 className="text-2xl font-bold mb-2">Passion Drives Us</h2>
            <p>
              We are driven by a passion to redefine how careers are built and
              trusted. From AI-powered recommendations to verified company
              reputations, every feature of CareerTrust is crafted with
              purpose—to empower individuals, strengthen organizations, and
              promote fairness in Pakistan’s job market. Our dedication to
              innovation and integrity fuels the progress of every professional
              journey.
            </p>
          </div>
          <figure className="w-full md:w-1/2">
            <img
              src="/assets/images/office_3.jpg"
              alt="Team working"
              className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 fade-in animation-delay-500"
            />
          </figure>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 p-8 fade-in animation-delay-600">
          <figure className="w-full md:w-1/2 fade-in animation-delay-700">
            <img
              src="/assets/images/office_2.jpg"
              alt="Team using technology"
              className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
            />
          </figure>
          <div className="w-full md:w-1/2 fade-in animation-delay-800">
            <h2 className="text-2xl font-bold mb-2">
              Building Trust Through Technology
            </h2>
            <p>
              Technology is at the heart of CareerTrust. Our platform integrates
              AI-powered modules for job matching, resume parsing, and
              sentiment-based review analysis—creating a smarter, fairer, and
              more reliable hiring environment. With features like face
              recognition and verified employment histories, we ensure every
              profile and company reputation is backed by authenticity. Through
              innovation, we’re building a digital ecosystem where trust is
              measurable, transparent, and long-lasting.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="min-h-screen bg-gradient-to-br from-[rgb(12,43,78)] via-[rgb(15,52,94)] to-[rgb(18,61,110)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our Values
              </h2>
              <p className="text-blue-200 text-lg">
                Guided by trust, innovation, and transparency, we strive to
                reshape how Pakistan’s job market operates. Every feature of
                CareerTrust reflects our commitment to authenticity, fairness,
                and growth for both employers and job seekers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Tabs */}
              <div className="space-y-1 fade-in animation-delay-200">
                {values.map((value, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left px-6 py-4 border-l-4 transition-all duration-300 hover:shadow-lg transition transform hover:-translate-y-1 fade-in ${
                      activeTab === index
                        ? "border-white text-white bg-opacity-10"
                        : "border-transparent text-blue-300 hover:bg-opacity-5"
                    }`}
                    style={{animationDelay: `${300 + index * 100}ms`}}
                  >
                    <span
                      className={`font-semibold ${
                        activeTab === index ? "text-lg" : "text-base"
                      }`}
                    >
                      {value.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-10 min-h-[300px] transition-opacity duration-500 fade-in animation-delay-400">
                <p className="text-lg">{values[activeTab].content}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Carousel */}
        <section className="min-h-screen bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Founders
              </h2>
              <p className="text-gray-600 text-lg fade-in animation-delay-100">
                The visionaries behind CareerTrust are driven by a shared
                goal—to build a platform that transforms hiring through verified
                data, ethical technology, and human-centered innovation. Their
                leadership fuels our journey toward a transparent and trusted
                employment ecosystem.
              </p>
            </div>

            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>

              {/* Carousel Slides */}
              <div className="relative h-96 overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  {visibleFounders.map((founder, idx) => {
                    const position = founder.position;
                    const isCenter = position === 0;

                    let transform = `translateX(${position * 22}%)`;
                    let scale =
                      position === 0
                        ? 1
                        : position === -1 || position === 1
                        ? 0.85
                        : 0.7;
                    let opacity =
                      position === 0
                        ? 1
                        : position === -1 || position === 1
                        ? 0.7
                        : 0.4;
                    let zIndex =
                      position === 0
                        ? 10
                        : position === -1 || position === 1
                        ? 3
                        : 1;

                    return (
                      <div
                        key={idx}
                        className="absolute transition-all duration-500 ease-out"
                        style={{
                          transform: `${transform} scale(${scale})`,
                          opacity,
                          zIndex,
                        }}
                      >
                        <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-xl">
                          <img
                            src={founder.image}
                            alt={`Portrait of ${founder.name}, ${founder.role}`}
                            className="w-full h-full object-cover"
                          />
                          {isCenter && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgb(12,43,78)] to-transparent p-4">
                              <h3 className="text-white font-bold text-lg">
                                {founder.name}
                              </h3>
                              <p className="text-blue-200 text-sm">
                                {founder.role}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {founders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const LOGIN = "/login";
export const SIGNUP = "/signup";
