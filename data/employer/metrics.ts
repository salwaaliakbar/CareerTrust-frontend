import type { ComponentType, SVGProps } from "react";

export type MetricData = {
  iconName: "Users" | "Zap" | "Lightbulb";
  title: string;
  value?: string;
  description?: string;
};

export const EMPLOYER_METRICS: MetricData[] = [
  {
    iconName: "Users",
    title: "Verified candidates",
    value: "20k+",
    description: "Profiles verified by CareerTrust",
  },
  {
    iconName: "Zap",
    title: "Fast hiring",
    value: "Avg. 3 days",
    description: "Shorten time-to-hire with smart screening",
  },
  {
    iconName: "Lightbulb",
    title: "Smart screening",
    description: "Automated one-click candidate screening",
  },
];

export const ICON_NAMES: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {};

export default EMPLOYER_METRICS;
