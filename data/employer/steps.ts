export type StepData = {
  title: string;
  desc: string;
  iconName: "Briefcase" | "Users" | "Handshake" | "Award";
  color: string;
};

const EMPLOYER_STEPS: StepData[] = [
  {
    title: "Post a job",
    desc: "Create a role and screen settings",
    iconName: "Briefcase",
    color: "bg-sky-800",
  },
  {
    title: "Review candidates",
    desc: "One-click screening & verified profiles",
    iconName: "Users",
    color: "bg-sky-700",
  },
  {
    title: "Hire",
    desc: "Shortlist and make an offer",
    iconName: "Handshake",
    color: "bg-sky-600",
  },
  {
    title: "Reputation history",
    desc: "View your trust score timeline and verification events",
    iconName: "Award",
    color: "bg-sky-500",
  },
];

export default EMPLOYER_STEPS;
