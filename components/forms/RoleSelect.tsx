import React from "react";
import { User, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

type Role = "jobseeker" | "employer";

export default function RoleSelect({ onSelectRole }: { onSelectRole: (r: Role) => void }) {
  return (
    <div className="w-full max-w-2xl bg-[#F4F4F4] rounded-xl p-6 bg-linear-to-br from-white via-[#0C2B4E]/6 to-white">
      <div>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CareerTrust</h1>
          <p className="text-gray-600">Choose your path to build trust in Pakistan&apos;s job market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <button
            onClick={() => onSelectRole("jobseeker")}
            className="bg-white border border-gray-300 rounded-lg p-8 text-left hover:shadow-lg transition-all hover:border-[#0C2B4E] shadow-xl"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <User className="w-7 h-7 text-[#0C2B4E]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">I&apos;m a Job Seeker</h2>
            <p className="text-gray-600 mb-6">Find verified job opportunities tailored to your skills and build your trusted professional profile.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />AI-powered job recommendations</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Verified employment history</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Company reputation insights</li>
            </ul>
          </button>

          <button
            onClick={() => onSelectRole("employer")}
            className="bg-white border border-gray-300 rounded-lg p-8 text-left hover:shadow-lg transition-all hover:border-[#0C2B4E] shadow-xl"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-[#0C2B4E]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">I&apos;m an Employer</h2>
            <p className="text-gray-600 mb-6">Post jobs, discover vetted candidates, and build your company&apos;s trusted reputation in the market.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Post unlimited job listings</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Access verified candidate profiles</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Build company reputation</li>
            </ul>
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">{"Already have an account? "}
            <Link href="/login" className="text-[#0C2B4E] font-semibold hover:text-[#1A3D64]">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
