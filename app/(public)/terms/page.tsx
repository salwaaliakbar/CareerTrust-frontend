import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalPolicyTemplate, {
  type PolicySection,
} from "@/components/legal/LegalPolicyTemplate";

const termsSections: PolicySection[] = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using CareerTrust, you agree to follow these Terms of Service and all applicable platform policies.",
      "If you do not agree with these terms, you should not use CareerTrust services.",
    ],
  },
  {
    title: "User Responsibilities",
    bullets: [
      "Provide accurate and current information during account creation and profile updates.",
      "Use CareerTrust only for lawful employment, hiring, and professional reputation activities.",
      "Maintain confidentiality of account credentials and report unauthorized access promptly.",
      "Respect other users and avoid false, abusive, or misleading actions on the platform.",
    ],
  },
  {
    title: "Account Rules",
    bullets: [
      "One user should not operate multiple deceptive or impersonation-based accounts.",
      "Role misuse (for example, pretending to be an employer or jobseeker) is prohibited.",
      "CareerTrust may request verification or supporting information for account integrity and trust controls.",
    ],
  },
  {
    title: "Job Posting Rules (Employers)",
    bullets: [
      "Job postings must be accurate, non-deceptive, and aligned with legitimate hiring needs.",
      "Employers must not post fraudulent opportunities or collect applicant data for unrelated purposes.",
      "Hiring updates and verification actions should reflect real decisions and workflow status.",
    ],
  },
  {
    title: "Application Rules (Jobseekers)",
    bullets: [
      "Jobseekers must submit truthful profile, resume, and application information.",
      "Impersonation, forged qualifications, or manipulated employment records are prohibited.",
      "Users must engage respectfully with employers and follow communication standards on CareerTrust.",
    ],
  },
  {
    title: "Prohibited Activities",
    bullets: [
      "Attempting unauthorized access to platform systems, user data, or protected resources.",
      "Posting malicious content, spam, or abusive material.",
      "Manipulating reputation, reviews, verification outcomes, or recommendation workflows unfairly.",
      "Using CareerTrust in ways that harm platform security, trust, or service reliability.",
    ],
  },
  {
    title: "Termination of Accounts",
    paragraphs: [
      "CareerTrust may suspend or terminate accounts that violate these terms, platform policies, or legal obligations.",
      "We may also restrict access where needed to protect user safety, service integrity, or regulatory compliance.",
    ],
  },
  {
    title: "Disclaimer of Liability",
    paragraphs: [
      "CareerTrust provides tools to support hiring transparency and trust but does not guarantee employment outcomes, hiring decisions, or business results.",
      "To the extent permitted by law, CareerTrust is not liable for indirect damages arising from user actions, third-party behavior, or service interruptions.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <LegalPolicyTemplate
        title="Terms of Service"
        subtitle="Rules, responsibilities, and platform standards for jobseekers, employers, and administrators on CareerTrust."
        effectiveDate="April 18, 2026"
        sections={termsSections}
      />
      <Footer />
    </>
  );
}
