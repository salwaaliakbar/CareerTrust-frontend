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
    <section id="features" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Why Choose CareerTrust?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We{' '}re redefining trust in Pakistan{' '} employment sector with
            innovative features and AI-powered solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-base p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 ${feature.colorClass} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7" />
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