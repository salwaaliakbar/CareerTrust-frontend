import Image from "next/image";
import { delayClasses, leaders } from "./aboutData";

export default function LeadershipSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200 smooth-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Leadership Team
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600 fade-in animation-delay-100">
            Experienced leaders guiding CareerTrust with a shared commitment to
            trust, fairness, and innovation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {leaders.map((leader, index) => (
            <article
              key={leader.name}
              className={`fade-in-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${delayClasses[index] ?? "animation-delay-100"}`}
            >
              <Image
                src={leader.image}
                alt={`Portrait of ${leader.name}`}
                width={1000}
                height={800}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {leader.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#1A4F8B]">
                  {leader.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
