"use client";

// components/home/HowItWorksSection.tsx
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/data/home/steps";

const steps = STEPS;
const stepDelayClass = [
  "animation-delay-100",
  "animation-delay-300",
  "animation-delay-500",
  "animation-delay-700",
];

function HowItWorksSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      ref={containerRef}
      className="py-20 px-4 bg-linear-to-b from-[#f0f6fc] via-[#f8fbff] to-[#edf5fd] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#8cb7dd] to-transparent pointer-events-none" />
      <div className="absolute -left-24 top-8 w-105 h-105 rounded-full blur-3xl bg-[#0c2b4e]/10 pointer-events-none" />
      <div className="absolute -right-24 bottom-0 w-105 h-105 rounded-full blur-3xl bg-[#1d546c]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dcefff] border border-[#bdddf4] mb-5 fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#0c2b4e]" />
            <span className="text-sm font-semibold text-[#0c2b4e]">Workflow</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0c2b4e] fade-in">
            How CareerTrust Works
          </h2>
          <p className="text-lg sm:text-xl text-[#4b627a] fade-in animation-delay-100">
            A clear, guided process to build credibility and unlock better opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center md:justify-start md:pl-6">
            <div className="rounded-3xl overflow-hidden border border-[#c5dff4] shadow-[0_24px_54px_-30px_rgba(12,43,78,0.55)] w-full max-w-md fade-in animation-delay-200 bg-white">
              <Image
                src="/assets/images/PhoneImg - Copy.png"
                alt="How It Works Illustration"
                width={720}
                height={720}
                className="w-full h-full object-cover pointer-events-none"
                priority
              />
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const palettes = [
                  { bg: "bg-[#d8efff]", text: "text-[#0c2b4e]", ring: "ring-[#9acaf0]", border: "border-[#9acaf0]" },
                  { bg: "bg-[#e4e8ff]", text: "text-[#3d4b95]", ring: "ring-[#bcc5f3]", border: "border-[#bcc5f3]" },
                  { bg: "bg-[#d8f2e7]", text: "text-[#1f5b45]", ring: "ring-[#9fd8c0]", border: "border-[#9fd8c0]" },
                  { bg: "bg-[#e4e8ff]", text: "text-[#3d4b95]", ring: "ring-[#bcc5f3]", border: "border-[#bcc5f3]" },
                ];
                const pal = palettes[idx % palettes.length];

                return (
                  <div
                    key={step.number}
                    className={`p-6 bg-white rounded-2xl border border-[#d6e5f3] border-l-4 ${pal.border} shadow-[0_16px_38px_-30px_rgba(8,34,61,0.7)] hover:shadow-[0_22px_42px_-26px_rgba(8,34,61,0.72)] transition-all duration-500 hover:-translate-y-1 ${stepDelayClass[idx % stepDelayClass.length]} ${
                      inView ? "smooth-enter-right opacity-100" : "opacity-0 translate-x-6"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className={`absolute -inset-1 rounded-xl ${pal.bg} opacity-95`} />
                        <div className={`relative w-12 h-12 bg-white rounded-full flex items-center justify-center ${pal.text} font-bold text-lg ring-1 ring-inset ${pal.ring}`}>
                          {step.number}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#0f2f52] mb-1">{step.title}</h3>
                        <p className="text-[#50677f] leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;