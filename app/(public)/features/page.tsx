"use client";
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/Herosection";

export default function FeaturesPage() {
  const features = [
    {
      icon: "📜",
      title: "Employment Verification System",
      description:
        "Dual confirmation between employers and job seekers ensures verified and trusted employment records. Once validated, each record becomes part of a permanent career history that promotes credibility and confidence.",
    },
    {
      icon: "⭐",
      title: "Reputation & Review System",
      description:
        "CareerTrust introduces structured, verified reviews supported by AI-driven sentiment analysis. These reviews maintain fair, bias-free company reputation scores that strengthen transparency across workplaces.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Job Matching",
      description:
        "Using artificial intelligence, the system analyzes user profiles, verified experience, and skill sets to recommend personalized job opportunities—helping candidates connect with the right employers efficiently.",
    },
    {
      icon: "📄",
      title: "Resume Parsing & Profile Builder",
      description:
        "Our resume parser automatically extracts data from uploaded CVs, creating structured, editable profiles. This ensures accuracy, reduces manual effort, and keeps candidate data consistent and verified.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Interactive dashboards provide real-time insights into hiring patterns, company reputation trends, and sentiment analytics. Both employers and job seekers can make smarter decisions using transparent metrics.",
    },
    {
      icon: "🔐",
      title: "Secure Authentication & Role Management",
      description:
        "CareerTrust employs role-based authentication with JWT security, Supabase integration, and OpenCV-based face recognition. These measures guarantee identity authenticity and data protection for every user.",
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Grid */}
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[rgb(12,43,78)] mb-4">
              What Makes CareerTrust Unique
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Each feature is built around one vision — creating an ecosystem of
              verified, fair, and intelligent employment that benefits every
              stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-[rgb(12,43,78)] text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[rgb(12,43,78)] via-[rgb(15,52,94)] to-[rgb(18,61,110)] py-20 text-center text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Building a Future of Trust and Opportunity
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              At CareerTrust, we believe that every verified connection creates
              a stronger professional ecosystem. Together, we’re shaping a job
              market built on authenticity, fairness, and innovation.
            </p>
            <a
              href="/signup"
              className="inline-block bg-white text-[rgb(12,43,78)] font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
            >
              Get Started Today
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
