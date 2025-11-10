"use client";
import React from "react";
import Link from "next/link";
import { MessageCircle, CheckCircle } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  title?: string;
  location?: string;
  skills?: string[];
  avatar?: string;
  verified?: boolean;
};

const demo: Candidate[] = [
  { id: "c1", name: "Aisha Khan", title: "Frontend Engineer", location: "Lagos, NG", skills: ["React", "TypeScript"], verified: true },
  { id: "c2", name: "Daniel Mensah", title: "Backend Engineer", location: "Accra, GH", skills: ["Node", "Postgres"], verified: true },
  { id: "c3", name: "Grace O.", title: "Product Designer", location: "Nairobi, KE", skills: ["Figma", "UX"] },
];

export default function FeaturedCandidates({ candidates = demo }: { candidates?: Candidate[] }) {
  return (
    <section aria-labelledby="featured-candidates" className="py-15">
      <div className="max-w-7xl mx-auto px-4">
        <h3 id="featured-candidates" className="text-primary text-3xl font-extrabold mb-4 text-center">Featured candidates</h3>
        <p className="text-center text-gray-600 mb-15 max-w-2xl mx-auto">
          Discover top talent ready to join your team across various industries and locations. Need more candidates?{' '}
          <Link href="/employer/post" className="underline font-medium">Post a job</Link> to reach a larger pool.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
          {candidates.map((c) => (
            <article
              key={c.id}
              className=" bg-white rounded-2xl p-5 flex flex-col gap-4 ring-1 ring-slate-100 hover:shadow-lg hover:-translate-y-1 transform-gpu transition duration-200 border border-gray-200 shadow-sm"
              role="article"
              aria-labelledby={`candidate-${c.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-[#0C2B4E] font-bold text-lg ring-1 ring-slate-100">{c.name.split(" ")[0].charAt(0)}</div>
                  {c.verified ? (
                    <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                      <CheckCircle className="w-4 h-4 text-[#0C2B4E]" />
                    </span>
                  ) : null}
                </div>

                <div className="flex-1">
                  <h4 id={`candidate-${c.id}`} className="font-semibold text-slate-900">{c.name}</h4>
                  <div className="text-sm text-slate-500">{c.title} • {c.location}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(c.skills || []).map((s) => (
                      <span key={s} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <button type="button" className="flex-1 px-4 py-2 bg-sky-700 text-white rounded-lg font-medium hover:bg-sky-800">View profile</button>
                <button type="button" className="px-3 py-2 border rounded-lg flex items-center gap-2 text-slate-700 hover:bg-slate-50"><MessageCircle className="w-4 h-4"/> Message</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
