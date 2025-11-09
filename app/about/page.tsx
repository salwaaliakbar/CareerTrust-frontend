// import React from "react";

"use client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// import {
//   Users,
//   Briefcase,
//   Globe,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

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
      name: "Sarah Johnson",
      role: "COO",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
    },
    {
      name: "David Martinez",
      role: "CFO",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop",
    },
    {
      name: "Emily Anderson",
      role: "CMO",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % founders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + founders.length) % founders.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Calculate which images to show
  const getVisibleFounders = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentSlide + i + founders.length) % founders.length;
      visible.push({ ...founders[index], position: i });
    }
    return visible;
  };

  const visibleFounders = getVisibleFounders();
  const values = [
    {
      title: "Helps consumers and companies",
      content:
        "Vis at partem hendrerit, his te facete tacimates concludaturque, duo ex fabulas menandri. Idque saperet assentior mea an. Nisl copiosae reformidans duo ea, no doming elaboraret sed. Malorum cotidieque an cum.",
    },
    {
      title: "Shoppers and retailers benefits",
      content:
        "We create value for both shoppers and retailers by providing innovative solutions that enhance the shopping experience. Our platform bridges the gap between consumers and businesses, fostering trust and transparency in every transaction.",
    },
    {
      title: "Making e-commerce so divers",
      content:
        "Our commitment to diversity in e-commerce means creating inclusive experiences for all users. We embrace different perspectives, cultures, and needs to build a marketplace that truly serves everyone, everywhere.",
    },
    {
      title: "Assess their service daily",
      content:
        "Continuous improvement is at our core. We assess our services daily to ensure we meet the highest standards of quality and customer satisfaction. Your feedback drives our innovation and helps us serve you better every day.",
    },
  ];
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
          <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Fixed Background */}
            <div
              className="relative h-screen bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: "url('/assets/images/office_1.jpg')",
              }}
            >
              <div className="bg-black bg-opacity-50 h-full flex items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Welcome to CareerTrust</h1>
              </div>
            </div>
          </div>
          <div className="flex">
            <figure>
              <img src="/assets/images/office_2.jpg" alt="" srcset="" />
            </figure>
            <div>
              <h2>Succes is our GOAL!</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vel
                iusto nihil porro totam dolor reprehenderit atque ab consequatur
                sapiente earum facilis, inventore ipsum ullam, similique magni
                nemo praesentium molestias voluptatem fugit! Aspernatur harum
                quos recusandae itaque, sunt incidunt tenetur.
              </p>
            </div>
          </div>
          <div className="flex">
            <div>
              <h2>Passion Drive Us</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vel
                iusto nihil porro totam dolor reprehenderit atque ab consequatur
                sapiente earum facilis, inventore ipsum ullam, similique magni
                nemo praesentium molestias voluptatem fugit! Aspernatur harum
                quos recusandae itaque, sunt incidunt tenetur.
              </p>
            </div>

            <figure>
              <img src="/assets/images/office_3.jpg" alt="" srcset="" />
            </figure>
          </div>
          <div className="min-h-screen bg-gradient-to-br from-[rgb(12,43,78)] via-[rgb(15,52,94)] to-[rgb(18,61,110)] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Our Values
                </h2>
                <p className="text-blue-200 text-lg">
                  Cum doctus civibus efficiantur in imperdiet deterruisset.
                </p>
              </div>

              {/* Content Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Tabs */}
                <div className="space-y-1">
                  {values.map((value, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left px-6 py-4 border-l-4 transition-all duration-300 ${
                        activeTab === index
                          ? "border-white bg-white bg-opacity-10"
                          : "border-transparent text-blue-300 hover:bg-white hover:bg-opacity-5"
                      }`}
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

                {/* Right Side - Content */}
                <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-10 min-h-[300px]">
                  <div className="leading-relaxed">
                    <p className="text-lg">{values[activeTab].content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-screen bg-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Our founders
                </h2>
                <p className="text-gray-600 text-lg">
                  Cum doctus civibus efficiantur in imperdiet deterruisset.
                </p>
              </div>

              {/* Carousel */}
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

                {/* Images Container */}
                <div className="relative h-96 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    {visibleFounders.map((founder, idx) => {
                      const position = founder.position;
                      const isCenter = position === 0;

                      // Calculate transform based on position
                      let transform = `translateX(${position * 220}px)`;
                      let scale = 1;
                      let opacity = 1;
                      let zIndex = 5;

                      if (position === -2 || position === 2) {
                        scale = 0.7;
                        opacity = 0.4;
                        zIndex = 1;
                      } else if (position === -1 || position === 1) {
                        scale = 0.85;
                        opacity = 0.7;
                        zIndex = 3;
                      } else if (position === 0) {
                        scale = 1;
                        opacity = 1;
                        zIndex = 10;
                      }

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
                              alt={founder.name}
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

                {/* Dots Navigation */}
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
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const LOGIN = "/login";
export const SIGNUP = "/signup";
