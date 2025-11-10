import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobsClient from "@/components/jobs/JobsClient";

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Pakistan",
    location: "Karachi, Pakistan",
    salary: "PKR 150,000 - 200,000",
    rating: 4.8,
    reviews: 245,
    match: 95,
    postedDaysAgo: 2,
    description: "We're looking for an experienced React developer to join our growing team.",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Digital Solutions",
    location: "Lahore, Pakistan",
    salary: "PKR 120,000 - 180,000",
    rating: 4.6,
    reviews: 128,
    match: 88,
    postedDaysAgo: 5,
    description: "Build scalable web applications with modern technologies.",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "Innovation Labs",
    location: "Islamabad, Pakistan",
    salary: "PKR 100,000 - 150,000",
    rating: 4.7,
    reviews: 89,
    match: 92,
    postedDaysAgo: 7,
    description: "Create beautiful and responsive user interfaces.",
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    location: "Karachi, Pakistan",
    salary: "PKR 130,000 - 190,000",
    rating: 4.5,
    reviews: 156,
    match: 85,
    postedDaysAgo: 3,
    description: "Design and maintain robust backend systems.",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "StartupHub",
    location: "Lahore, Pakistan",
    salary: "PKR 140,000 - 210,000",
    rating: 4.9,
    reviews: 67,
    match: 78,
    postedDaysAgo: 1,
    description: "Lead product strategy and drive company growth.",
  },
  {
    id: 6,
    title: "UX/UI Designer",
    company: "Design Studios",
    location: "Karachi, Pakistan",
    salary: "PKR 80,000 - 130,000",
    rating: 4.6,
    reviews: 94,
    match: 82,
    postedDaysAgo: 4,
    description: "Design engaging user experiences for web and mobile.",
  },
];

export default function JobsPage() {
  return (
    <div>
      <Header />
      {/* JobsClient is a client component that receives the initial jobs list */}
      <JobsClient jobs={jobs} />
      <Footer />
    </div>
  );
}
