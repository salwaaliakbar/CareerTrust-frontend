// components/DigitalEmploymentPassport.tsx
"use client";

import React from "react";
import {
  CheckCircle2,
  Building2,
  Calendar,
} from "lucide-react";
import { EmploymentRecord } from "@/types/jobseeker.types";
import { getVerificationBadge } from "@/lib/utils";

interface DigitalEmploymentPassportProps {
  verifiedEmployment: EmploymentRecord[];
}

export default function DigitalEmploymentPassport({
  verifiedEmployment,
}: DigitalEmploymentPassportProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-linear-to-b from-emerald-600 to-teal-600 rounded-full shadow-lg"></div>
              Digital Employment Passport
            </h2>
            <p className="text-sm text-slate-500 mt-2 ml-5 font-medium">
              Your verified work history on CareerTrust
            </p>
          </div>
          <div className="flex items-center gap-2 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-xl border-2 border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-black text-emerald-700">
              {verifiedEmployment.length} Verified
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {verifiedEmployment.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-emerald-200">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-30 text-emerald-400" />
              <p className="text-sm font-bold text-emerald-700 mb-2">
                No verified employment yet
              </p>
              <p className="text-xs text-emerald-600 font-medium">
                Upload documents for your work experience to get verified
              </p>
            </div>
          ) : (
            verifiedEmployment.map((emp) => (
              <div
                key={emp.id}
                className="group/passport relative p-6 bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-200 to-transparent rounded-full blur-3xl opacity-50 group-hover/passport:opacity-70 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">
                          {emp.position}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">{emp.company}</span>
                        </div>
                      </div>
                    </div>
                    {getVerificationBadge("verified")}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span className="font-semibold">
                      {emp.startDate} -{" "}
                      {emp.currentlyWorking ? "Present" : emp.endDate}
                    </span>
                  </div>

                  {emp.description && (
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {emp.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t-2 border-emerald-200">
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      {emp.documents.length} documents verified
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}