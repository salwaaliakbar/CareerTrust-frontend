import {
  Bell,
  Bot,
  Briefcase,
  CheckCircle2,
  Eye,
  FileText,
  Lock,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    icon: UserCheck,
    title: "Verified Jobseeker Profiles",
    description:
      "Every profile is built around identity-backed user data, role checks, and resume-backed work history so employers can evaluate real candidates with higher confidence.",
  },
  {
    icon: FileText,
    title: "AI Resume Parsing",
    description:
      "Uploaded resumes are parsed to extract skills, education, and experience into structured profile fields, reducing manual entry and improving profile consistency.",
  },
  {
    icon: Bot,
    title: "Smart Job Recommendations",
    description:
      "CareerTrust uses AI-assisted matching to recommend opportunities aligned to verified skills, profile strength, and job requirements for better-fit applications.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Hiring & Verification",
    description:
      "The dual-confirmation flow lets both employer and employee validate employment outcomes, creating trusted records and reducing false hiring claims.",
  },
  {
    icon: MessageSquare,
    title: "Anonymous Review & Reputation System",
    description:
      "Jobseekers can submit protected feedback while the platform surfaces credibility signals and reputation trends to support transparent hiring decisions.",
  },
  {
    icon: Briefcase,
    title: "Employer Job Management",
    description:
      "Employers can post, update, and manage job pipelines with role-based access, application tracking, and status handling from one workflow.",
  },
  {
    icon: Bell,
    title: "Notification & Alerts System",
    description:
      "In-app alerts and email-ready notification flows keep users informed about applications, hiring responses, and important account actions in real time.",
  },
  {
    icon: Lock,
    title: "Role-Based Authentication with Clerk",
    description:
      "Secure sign-up and sign-in workflows with Clerk-backed identity and role mapping ensure the right access for jobseekers, employers, and admins.",
  },
  {
    icon: FileText,
    title: "Cloud File & Profile Document Handling",
    description:
      "CareerTrust supports structured handling of resumes and profile-related documents so candidate information stays accessible, consistent, and hiring-ready.",
  },
];

export const WHY_CHOOSE_CARDS = [
  {
    icon: CheckCircle2,
    title: "Trust by Design",
    description:
      "Verification-first workflows, role-aware access, and confirmed hiring events create a safer environment for jobseekers and employers.",
  },
  {
    icon: Eye,
    title: "Transparent Decisions",
    description:
      "From reputation indicators to profile-backed evidence, CareerTrust helps teams make hiring decisions with clearer context.",
  },
  {
    icon: Lock,
    title: "Secure & Accountable",
    description:
      "Clerk-based authentication, controlled data flows, and structured platform checks protect user identity and core hiring data.",
  },
] as const;
