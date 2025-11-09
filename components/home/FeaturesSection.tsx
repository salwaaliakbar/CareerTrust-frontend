// components/home/FeaturesSection.tsx
import {
  TrendingUp,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Employment",
    description:
      "Dual confirmation system ensures accurate, trustworthy employment records. Both employers and employees verify employment history.",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    title: "Reputation Scores",
    description:
      "AI-powered sentiment analysis provides unbiased company reputation scores based on verified employee reviews.",
    colorClass: "bg-accent/10 text-accent",
  },
  {
    icon: Sparkles,
    title: "Smart Job Matching",
    description:
      "AI analyzes your skills and experience to recommend perfectly matched opportunities tailored to you.",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Anonymous Reviews",
    description:
      "Share honest feedback anonymously. Employees and employers provide mutual feedback without fear.",
    colorClass: "bg-accent/10 text-accent",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time insights and visualizations for both job seekers and employers to make data-driven decisions.",
    colorClass: "bg-primary/10 text-primary",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description:
      "Get real-time alerts for job matches, applications, reviews, and verification updates.",
    colorClass: "bg-accent/10 text-accent",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary text-3xl font-extrabold mb-4">Why Choose CareerTrust?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {"We\u2019re redefining trust across Pakistan's employment sector with innovative features and AI-powered solutions."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6 px-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // Use standard Tailwind color utilities so colors appear immediately
            // (avoids depending on custom tokens / tailwind rebuild)
            const isAccent = feature.colorClass.includes("accent");
            const bgClass = isAccent ? "bg-amber-100" : "bg-sky-100";
            const textClass = isAccent ? "text-amber-600" : "text-sky-700";
            const ringClass = isAccent ? "ring-amber-200" : "ring-sky-200";
            const leftBorder = "border-amber-100";

            return (
              <div
                key={index}
                className={`card-base p-8 bg-white rounded-2xl border border-gray-500 border-l-5 ${leftBorder} hover:shadow-lg transition transform hover:-translate-y-1`}
              >
                <div className="relative mb-6">
                  {/* faint colored shape behind the icon */}
                  <div className={`absolute -inset-1 rounded-xl ${bgClass} opacity-100`} />
                  <div className={`relative w-14 h-14 bg-white rounded-lg flex items-center justify-center ${textClass} ring-1 ring-inset ${ringClass}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;