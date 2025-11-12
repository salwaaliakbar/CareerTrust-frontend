import {
  MessageCircle,
  CheckCircle,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

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
  {
    id: "c1",
    name: "Aisha Khan",
    title: "Frontend Engineer",
    location: "Lagos, NG",
    skills: ["React", "TypeScript"],
    avatar: "/assets/images/profile1.jpg",
    verified: true,
  },
  {
    id: "c2",
    name: "Daniel Mensah",
    title: "Backend Engineer",
    location: "Accra, GH",
    skills: ["Node", "Postgres"],
    avatar: "/assets/images/profile2.jpg",
    verified: true,
  },
  {
    id: "c3",
    name: "Grace O.",
    title: "Product Designer",
    location: "Nairobi, KE",
    skills: ["Figma", "UX"],
    avatar: "/assets/images/profile3.jpg",
  },
];

export default function FeaturedCandidates({
  candidates = demo,
}: {
  candidates?: Candidate[];
}) {
  return (
    <section
      aria-labelledby="featured-candidates"
      className="relative overflow-hidden"
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-grid-slate-200/50 pb-24"/>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0C2B4E]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0C2B4E]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 backdrop-blur-sm border border-[#0C2B4E]/50 mb-6">
            <Sparkles className="w-4 h-4 text-[#0C2B4E]" />
            <span className="text-sm font-medium text-[#0C2B4E]">
              Top Talent
            </span>
          </div>

          <h3
            id="featured-candidates"
            className="text-4xl sm:text-5xl font-bold mb-4 bg-[#0C2B4E] bg-clip-text text-transparent"
          >
            Featured Candidates
          </h3>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with exceptional talent ready to elevate your team.{" "}
            <a
              href="/employer/post"
              className="inline-flex items-center gap-1 text-[#0C2B4E] font-semibold hover:text-[#1A3D64] transition-colors group"
            >
              Post a job
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <article
              key={c.id}
              className="group relative"
              role="article"
              aria-labelledby={`candidate-${c.id}`}
            >
              {/* Glow effect on hover */}
              <div
                className={`absolute -inset-0.5 bg-[#0C2B4E] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}
              />

              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:border-blue-200/60 transition-all duration-300">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    {c.avatar ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src={c.avatar}
                          alt={c.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#0C2B4E] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {c.name.split(" ")[0].charAt(0)}
                      </div>
                    )}
                    {c.verified && (
                      <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md ring-2 ring-white">
                        <CheckCircle className="w-4 h-4 text-[#0C2B4E] fill-blue-100" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      id={`candidate-${c.id}`}
                      className="font-bold text-lg text-slate-900 mb-1 truncate"
                    >
                      {c.name}
                    </h4>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      {c.title}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{c.location}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(c.skills || []).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-[#0C2B4E] to-[#1A3D64] shadow-lg shadow-[#0C2B4E]/25 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A3D64]/30"
                    aria-label={`View profile of ${c.name}`}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    aria-label={`Message ${c.name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-[#0C2B4E] rounded-full font-semibold text-slate-700 hover:text-[#1A3D64] shadow-lg hover:shadow-xl transition-all duration-200 group">
            View All Candidates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
