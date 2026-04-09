import { FEATURE } from "@/data/home/featuredData";

function FeaturesSection() {
  const delayClass = [
    "animation-delay-300",
    "animation-delay-400",
    "animation-delay-500",
    "animation-delay-600",
    "animation-delay-700",
    "animation-delay-800",
  ];

  return (
    <section
      id="features"
      className="pt-20 pb-24 px-4 bg-linear-to-b from-[#edf5fd] via-[#f7fbff] to-[#f4f8fc] relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-12 w-105 h-105 rounded-full blur-3xl bg-linear-to-br from-[#0c2b4e]/14 via-[#1a3d64]/8 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#0c2b4e0a_1px,transparent_1px),linear-gradient(to_bottom,#0c2b4e0a_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d9ebfb] border border-[#bad8f0] mb-6 backdrop-blur-sm fade-in">
            <div className="w-2 h-2 rounded-full bg-[#0c2b4e] animate-pulse" />
            <span className="text-sm font-semibold text-[#0c2b4e]">Core Capabilities</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-[#0c2b4e] fade-in animation-delay-100">
            Why Teams Choose CareerTrust
          </h2>
          <p className="text-lg text-[#4b627a] max-w-3xl mx-auto leading-relaxed fade-in animation-delay-200">
            From verified records to explainable recommendation signals, every feature is built to reduce hiring risk and increase confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE.map((feature, index) => {
            const Icon = feature.icon;
            const isAccent = feature.colorClass.includes("accent");
            
            const bgClass = isAccent ? "bg-[#fbe6be]" : "bg-[#d8efff]";
            const textClass = isAccent ? "text-[#8c5a0b]" : "text-[#0c2b4e]";
            const borderColor = isAccent ? "border-[#edc274]" : "border-[#9fcff1]";

            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-7 border-l-4 ${borderColor} border border-[#d9e6f2] transition-all duration-500 fade-in ${
                  "shadow-[0_16px_36px_-28px_rgba(11,34,58,0.75)] hover:shadow-[0_24px_50px_-24px_rgba(11,34,58,0.78)] hover:-translate-y-1"
                } ${delayClass[index % delayClass.length]}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${
                  isAccent
                    ? "from-transparent via-[#d2a24e] to-transparent"
                    : "from-transparent via-[#0c2b4e] to-transparent"
                } rounded-t-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100`} />

                <div className="relative mb-6">
                  <div className={`absolute -inset-2 rounded-xl ${bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />

                  <div className={`relative w-14 h-14 rounded-xl ${bgClass} border border-[#d8e5f3] flex items-center justify-center ${textClass} shadow-sm transition-all duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#102d4a] mb-3 group-hover:text-[#0c2b4e] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#546d85] leading-relaxed text-sm">
                  {feature.description}
                </p>

                <div className={`absolute bottom-0 right-0 w-20 h-20 ${bgClass} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;