"use client";
import React, { useState } from "react";
import { CheckCircle, Briefcase, Users, Handshake, Award } from "lucide-react";
import Link from "next/link";
import styles from "./EmployerSteps.module.css";
import EMPLOYER_STEPS, { StepData } from "../../data/employer/steps";

export default function EmployerSteps() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Map icon name strings from JSON to actual lucide-react icon components
  const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    Users,
    Handshake,
    Award,
  };

  const steps: StepData[] = EMPLOYER_STEPS.map(
    (s) => ({ ...s, iconComponent: ICONS[s.iconName as keyof typeof ICONS] || Briefcase })
  );

  return (
  <section aria-labelledby="employer-steps" className="relative py-16 md:py-20 overflow-hidden bg-linear-to-b from-[#F4F4F4] via-[#0C2B4E]/3 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl bg-linear-to-br from-[#0C2B4E]/10 via-[#1A3D64]/8 to-[#1D546C]/6 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 backdrop-blur-sm border border-[#0C2B4E]/50 mb-6 fade-in animation-delay-100">
            <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
            <span className="text-sm font-medium text-[#0C2B4E]">Simple Process</span>
          </div>
          
          <h3 id="employer-steps" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-[#0C2B4E]">
            How it works for employers
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From posting a role to making an offer — a simple, fast flow that helps you surface verified candidates and build hiring confidence.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - hidden on mobile, visible on desktop (positioning moved to CSS module) */}
          <div className={`hidden lg:block absolute top-24 h-1 bg-linear-to-r from-blue-200 via-teal-200 to-emerald-200 rounded-full ${styles.connectionLine}`} />
            <div className={`hidden lg:block absolute top-24 h-1 bg-linear-to-r from-[#1A3D64]/20 via-[#1D546C]/20 to-[#0C2B4E]/20 rounded-full ${styles.connectionLine}`} />
          
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 list-none relative">
            {steps.map((s, i) => {
              const Icon = ICONS[s.iconName as keyof typeof ICONS] || Briefcase;
              const isActive = activeStep === i;
              
              return (
                <li 
                  key={i} 
                  className="relative group"
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Step number indicator */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className={`relative z-10 w-14 h-14 rounded-2xl bg-linear-to-br ${s.color} p-0.5 shadow-lg transition-all duration-300 ${isActive ? 'scale-110 shadow-xl' : ''}`}>
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                        <span className="text-xl font-bold bg-linear-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent">
                          {i + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`relative mt-8 h-full bg-white/95 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-300 shadow-xl shadow-blue-100/50 -translate-y-2' 
                      : 'border-slate-200 shadow-lg hover:border-blue-200 hover:shadow-xl hover:-translate-y-1'
                  }`}>
                    {/* Gradient accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${s.color} rounded-t-2xl transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${s.color} mb-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        {s.title}
                        <CheckCircle className={`w-5 h-5 text-emerald-500 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>

                    {/* Bottom indicator */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${s.color} rounded-b-2xl transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* Connecting arrow - only between steps on desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -right-4 z-20">
                      <div className={`w-8 h-8 rounded-full bg-white border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-[#0C2B4E] scale-125' 
                          : 'border-slate-200'
                      }`}>
                        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                          <path d="M12 10L20 16L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-blue-500' : 'text-slate-300'} />
                        </svg>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-14 md:mt-16">
          <Link href="/employer/post-job" className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-2xl bg-linear-to-r from-[#0C2B4E] to-[#1A3D64] shadow-lg shadow-[#0C2B4E]/25 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A3D64]/30">
            <Briefcase className="w-5 h-5" />
            Get Started Now
          </Link>
        </div>
      </div>

      <div>
            <div className="relative h-px my-20">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1A3D64]/25 to-transparent opacity-75"></div>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1D546C]/20 to-transparent blur-sm"></div>
          </div>
        </div>
    </section>
  );
}