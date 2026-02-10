import { Users, Building2, Shield, TrendingUp } from "lucide-react";

const stats = [
  { icon: Building2, value: "8,500+", label: "Verified Companies" },
  { icon: Users, value: "2.1M", label: "Active Job Seekers" },
  { icon: Shield, value: "98%", label: "Trust Score" },
  { icon: TrendingUp, value: "45K+", label: "Jobs Posted Monthly" },
];

const TrustStats = () => {
  return (
    <section className="py-16 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-count-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/15 mb-3">
                <stat.icon className="w-6 h-6 text-secondary" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
