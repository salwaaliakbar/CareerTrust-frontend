import { STATS } from "@/data/home/StatData";
import React from "react";
import { statsData } from "@/types/home.types";

export function StatsSection() {
  const stats = STATS;
  const delayClass = [
    "animation-delay-100",
    "animation-delay-200",
    "animation-delay-300",
    "animation-delay-400",
  ];

  return (
    <section className="py-16 px-4 bg-[#f4f8fc]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat: statsData, index: number) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl p-6 border border-[#d9e6f2] shadow-[0_14px_34px_-20px_rgba(10,34,63,0.38)] hover:shadow-[0_20px_45px_-22px_rgba(10,34,63,0.45)] hover:-translate-y-1 transition-all duration-500 group fade-in-up ${delayClass[index % delayClass.length]}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d8efff] flex items-center justify-center border border-[#b9dcf6] group-hover:bg-[#bfe5ff] transition-colors duration-300">
                  <stat.icon className="w-6 h-6 text-[#0c2b4e]" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-bold text-[#0a223f] mb-1">{stat.value}</h3>
                  <p className="font-semibold text-[#0f2f52] mb-1">{stat.label}</p>
                  <p className="text-sm text-[#4b627a]">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;