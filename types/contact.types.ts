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
