import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactFaqItem, ContactInfoItem } from "@/types/contact.types";

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "support@careertrust.com",
    description: "We'll respond within 24 hours",
    link: "mailto:support@careertrust.com",
    delayClass: "animation-delay-100",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 (300) 123-4567",
    description: "Monday to Friday, 9AM-6PM PKT",
    link: "tel:+923001234567",
    delayClass: "animation-delay-200",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Karachi, Pakistan",
    description: "CareerTrust Headquarters",
    link: null,
    delayClass: "animation-delay-300",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    description: "Average response time",
    link: null,
    delayClass: "animation-delay-400",
  },
];

export const CONTACT_FAQS: ContactFaqItem[] = [
  {
    question: "How long does it take to verify my employment?",
    answer:
      "Employment verification typically takes 2-5 business days. Both the employer and employee need to confirm the employment record.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can request account deletion from your settings. Your verified employment records will remain for transparency, but personal data will be removed.",
  },
  {
    question: "Is CareerTrust available outside Pakistan?",
    answer:
      "Currently, CareerTrust operates in Pakistan. We're planning to expand internationally in the coming months.",
  },
  {
    question: "How do I report inappropriate reviews?",
    answer:
      "You can report reviews through the review page. Our moderation team reviews all reports within 48 hours.",
  },
  {
    question: "What is your data privacy policy?",
    answer:
      "We follow strict data protection standards. Your data is encrypted and never shared with third parties without consent.",
  },
  {
    question: "How can I become a verified employer?",
    answer:
      "Complete the employer verification process in your company settings. We'll verify your company through official registrations.",
  },
];
