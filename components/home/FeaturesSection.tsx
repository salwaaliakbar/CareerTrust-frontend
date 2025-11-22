import { FEATURE } from "@/data/home/featuredData";

function FeaturesSection() {
  return (
    <section id="features" className="pt-15 px-4 bg-linear-to-b from-[#F4F4F4] via-[#0C2B4E]/4 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-12 w-[420px] h-[420px] rounded-full blur-3xl bg-linear-to-br from-[#0C2B4E]/12 via-[#1A3D64]/8 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-linear-to-r from-[#0C2B4E]/6 via-[#1A3D64]/5 to-transparent" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0C2B4E08_1px,transparent_1px),linear-gradient(to_bottom,#0C2B4E08_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0C2B4E]/10 border border-[#0C2B4E]/20 mb-6 backdrop-blur-sm fade-in">
            <div className="w-2 h-2 rounded-full bg-[#0C2B4E] animate-pulse" />
            <span className="text-sm font-semibold text-[#0C2B4E]">Trusted by Thousands</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-[#0C2B4E] fade-in animation-delay-100">
            Why Choose CareerTrust?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed fade-in animation-delay-200">
            We{`'`}re redefining trust across Pakistan{`'`}s employment sector with innovative features and AI-powered solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-12">
          {FEATURE.map((feature, index) => {
            const Icon = feature.icon;  
            // Use standard Tailwind color utilities so colors appear immediately
            // (avoids depending on custom tokens / tailwind rebuild)
            const isAccent = feature.colorClass.includes("accent");
            
            const bgClass = isAccent ? "bg-[#1A3D64]/10" : "bg-[#0C2B4E]/10";
            const textClass = isAccent ? "text-[#1A3D64]" : "text-[#0C2B4E]";
            const borderColor = isAccent ? "border-[#1A3D64]" : "border-[#0C2B4E]";

            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-7 border-l-4 ${borderColor} border border-gray-200/60 transition-all duration-300 fade-in ${
                  'shadow-md hover:shadow-lg hover:-translate-y-1'
                }`}
                style={{animationDelay: `${300 + index * 100}ms`}}
                >
                {/* Top gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${
                  isAccent 
                    ? 'from-transparent via-[#1A3D64] to-transparent' 
                    : 'from-transparent via-[#0C2B4E] to-transparent'
                } rounded-t-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100`} />

                {/* Icon container */}
                <div className="relative mb-6">
                  {/* Background glow */}
                  <div className={`absolute -inset-2 rounded-xl ${bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                  
                  {/* Icon box */}
                  <div className={`relative w-14 h-14 rounded-xl ${bgClass} flex items-center justify-center ${textClass} shadow-sm transition-all duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0C2B4E] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Bottom corner decoration */}
                <div className={`absolute bottom-0 right-0 w-20 h-20 ${bgClass} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              </div>
            );
          })}
        </div>
      </div>

     <div>
            <div className="relative h-px my-20">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1A3D64]/25 to-transparent opacity-75 shadow-2xl"></div>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#1D546C]/20 to-transparent blur-sm"></div>
          </div>
        </div>
    </section>
  );
}

export default FeaturesSection;