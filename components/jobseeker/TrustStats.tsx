import { TRUST_STATS } from "@/data/jobseeker/trustStats";

const TrustStats = () => {
  return (
    <section className="py-24 mt-8 bg-linear-to-b from-[#1D546C]/10 via-[#1D546C]/5 to-[#1D546C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0C2B4E] mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            CareerTrust connects job seekers with verified employers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#1D546C]/10 px-8 py-2 text-center group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-[#1D546C]/10 mb-4 group-hover:bg-[#1D546C]/20 transition-colors duration-300">
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
