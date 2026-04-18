import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalPolicyTemplate, {
  type PolicySection,
} from "@/components/legal/LegalPolicyTemplate";

const cookieSections: PolicySection[] = [
  {
    title: "What Are Cookies",
    paragraphs: [
      "Cookies are small data files stored on your device when you use websites and web applications.",
      "CareerTrust uses cookies and similar technologies to keep sessions secure, remember preferences, and improve platform performance.",
    ],
  },
  {
    title: "How We Use Cookies",
    bullets: [
      "Authentication support for signed-in sessions and account protection flows.",
      "Session management to maintain role-based experiences across jobseeker, employer, and admin areas.",
      "Operational analytics to understand service performance and improve usability.",
      "Security monitoring and abuse prevention where technically required.",
    ],
  },
  {
    title: "Types of Cookies",
    bullets: [
      "Essential cookies: required for login, navigation, and secure platform operation.",
      "Preference cookies: store selected settings to improve user experience.",
      "Performance cookies: help measure technical behavior and improve reliability.",
      "Security cookies: support fraud detection and session integrity.",
    ],
  },
  {
    title: "Managing Cookies",
    paragraphs: [
      "You can control cookie behavior through browser settings, including blocking or deleting cookies.",
      "Disabling essential cookies may affect authentication, session continuity, and key CareerTrust features.",
    ],
  },
  {
    title: "Third-Party Cookies",
    paragraphs: [
      "Some cookies may be set by trusted third-party providers used by CareerTrust to deliver core services.",
    ],
    bullets: [
      "Clerk-related cookies may be used for secure authentication and session handling.",
      "Other operational providers may set cookies strictly for performance, infrastructure, or service security purposes.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <LegalPolicyTemplate
        title="Cookie Policy"
        subtitle="How CareerTrust uses cookies for secure authentication, session continuity, and platform performance."
        effectiveDate="April 18, 2026"
        sections={cookieSections}
      />
      <Footer />
    </>
  );
}
