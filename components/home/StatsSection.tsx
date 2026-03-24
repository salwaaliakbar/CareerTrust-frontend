import { STATS } from "@/data/home/StatData";
import React from "react";
import { statsData } from "@/types/home.types";

export function StatsSection() {
    const stats = STATS;
  return (
    <section className="py-4 bg-sky-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat: statsData, index: number) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-smooth group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-row items-center text-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-sky-300 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-smooth">
                <stat.icon className="w-6 h-6 text-secondary" />
                
              </div>
              <div className="text-left">
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="font-medium text-foreground mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
              </div>
            </div>
          ))}
        </div>
       
      </div>
    </section>
  );
};

export default StatsSection;