"use client";
import React from "react";

interface ProfessionalSummaryProps {
  summary: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export default function ProfessionalSummary({ summary, onChange, disabled = false }: ProfessionalSummaryProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-sky-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800">Professional Summary</h2>
        </div>

        <div>
          <label className="block">
            <textarea
              name="summary"
              value={summary}
              onChange={onChange}
              disabled={disabled}
              rows={6}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 font-medium disabled:cursor-not-allowed"
              placeholder="Write a brief summary about your experience, skills and goals."
            />
          </label>
        </div>
      </div>
    </div>
  );
}