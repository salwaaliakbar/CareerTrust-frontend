import { TRUST_STATS } from "@/data/jobseeker/trustStats";

const TrustStats = () => {
  const delayClass = [
    "animation-delay-100",
    "animation-delay-300",
    "animation-delay-500",
    "animation-delay-700",
  ];

  return (
    <section className="py-20 mt-2 bg-linear-to-b from-[#f0f6fc] via-[#f7fbff] to-[#f4f8fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0C2B4E] mb-4 fade-in-down">
            Trusted by Thousands
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto fade-in animation-delay-100">
            CareerTrust connects job seekers with verified employers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl border border-[#1D546C]/15 px-8 py-6 text-center group shadow-[0_18px_38px_-30px_rgba(9,34,60,0.75)] hover:-translate-y-1 hover:shadow-[0_26px_48px_-26px_rgba(9,34,60,0.78)] transition-all duration-500 fade-in-up ${delayClass[i % delayClass.length]}`}
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-[#1D546C]/10 p-3 mb-4 group-hover:bg-[#1D546C]/20 transition-colors duration-300">
                <stat.icon className="w-7 h-7 text-[#0C2B4E]" />
              </div>
              <div className="text-4xl font-bold text-[#0C2B4E] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
