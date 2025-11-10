import Link from "next/link";
import { Lightbulb, Users, Zap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Metric = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  value?: string;
  description?: string;
};

const demoMetrics: Metric[] = [
  { icon: Users, title: "Verified candidates", value: "20k+", description: "Profiles verified by CareerTrust" },
  { icon: Zap, title: "Fast hiring", value: "Avg. 3 days", description: "Shorten time-to-hire with smart screening" },
  { icon: Lightbulb, title: "Smart screening", description: "Automated one-click candidate screening" },
];

export default function EmployerWhy({ metrics = demoMetrics }: { metrics?: Metric[] }) {
  return (
    <section aria-labelledby="employer-why" className="py-12 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="employer-why" className="text-2xl font-extrabold text-slate-900 mb-4">Why employers choose CareerTrust</h2>
        <p className="text-slate-600 max-w-2xl mb-8">Hire verified talent faster — reduce screening time and surface qualified candidates with confidence.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-4 bg-white rounded-lg shadow-sm flex items-start gap-4">
                <div className="p-3 bg-sky-100 rounded-full">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{m.title}</div>
                  {m.value && <div className="text-2xl font-bold text-slate-900">{m.value}</div>}
                  {m.description && <div className="text-sm text-slate-500">{m.description}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/employer/post" className="inline-flex items-center px-6 py-3 bg-sky-700 text-white rounded-md font-semibold" aria-label="Post a job">Post a job</Link>
          <Link href="/employer/contact" className="inline-flex items-center px-6 py-3 border border-sky-200 rounded-md text-sky-700" aria-label="Contact sales">Contact sales</Link>
        </div>
      </div>
    </section>
  );
}
