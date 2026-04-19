import { LucideIcon } from "lucide-react";

export interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  link: string | null;
  delayClass: string;
}

export interface ContactFaqItem {
  question: string;
  answer: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResult {
  id: string;
  status: "pending" | "replied";
  isRead: boolean;
  message: string;
}
