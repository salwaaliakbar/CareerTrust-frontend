import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalPolicyTemplate, {
  type PolicySection,
} from "@/components/legal/LegalPolicyTemplate";

const privacySections: PolicySection[] = [
  {
    title: "Introduction",
    paragraphs: [
      "CareerTrust is a Smart Employment and Review Platform that connects jobseekers and employers through verified hiring workflows.",
      "This Privacy Policy explains how we collect, use, protect, and process information when you use CareerTrust features such as account registration, resume upload, job applications, and review systems.",
    ],
  },
  {
    title: "Information We Collect",
    paragraphs: [
      "We collect information required to operate trusted hiring on CareerTrust.",
    ],
    bullets: [
      "Identity and account data such as name, email address, role, and profile details.",
      "Career data including resume content, education history, skills, and experience used for profile creation and matching.",
      "Platform activity data such as job applications, employer job postings, review submissions, and reputation interactions.",
      "Technical usage data including authentication sessions and service logs needed to secure platform operations.",
    ],
  },
  {
    title: "How We Use Information",
    bullets: [
      "Provide account access and role-based functionality for jobseekers, employers, and administrators.",
      "Enable resume parsing, profile structuring, and smart job recommendations.",
      "Support hiring verification workflows, including dual confirmation records between employers and employees.",
      "Deliver platform notifications, trust and reputation signals, and service communication updates.",
      "Improve platform reliability, user safety, and fraud prevention.",
    ],
  },
  {
    title: "Data Security",
    paragraphs: [
      "CareerTrust applies access controls, secure authentication, and operational safeguards to protect user information.",
      "While no platform can guarantee absolute security, we continuously improve technical and process-level defenses to reduce risk and unauthorized access.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "CareerTrust relies on selected third-party providers to deliver core platform functionality.",
    ],
    bullets: [
      "Clerk is used for authentication, account sessions, and secure sign-in/sign-up workflows.",
      "Cloudinary is used for media and file handling workflows where applicable.",
      "We only share data necessary for these services to function according to platform needs.",
    ],
  },
  {
    title: "User Rights",
    bullets: [
      "Access and review your profile information.",
      "Request correction of inaccurate profile or account data.",
      "Request deletion of account data, subject to legal, security, and platform integrity obligations.",
      "Manage notification preferences and profile visibility settings where supported.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      "If you have questions regarding this Privacy Policy or your data on CareerTrust, please contact us through the Contact page.",
      "Contact route: /contact",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LegalPolicyTemplate
        title="Privacy Policy"
        subtitle="How CareerTrust handles your account, resume, verification, and hiring data across the platform."
        effectiveDate="April 18, 2026"
        sections={privacySections}
      />
      <Footer />
    </>
  );
}
