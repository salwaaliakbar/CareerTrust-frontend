import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Star,
  Clock,
  Users,
  Share2,
  Heart,
  ArrowLeft,
} from "lucide-react";

type Job = {
  id: number | string;
  title: string;
  company: string;
  location: string;
  salary: string;
  rating: number;
  reviews: number;
  match: number;
  posted: string;
  applicants: number;
  category: string;
  employmentType: string;
  experience: string;
  description: string;
  skills: string[];
  company_info: {
    name: string;
    rating: number;
    reviews: number;
    employees: number;
    description: string;
  };
};

const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Pakistan",
    location: "Karachi, Pakistan",
    salary: "PKR 150,000 - 200,000",
    rating: 4.8,
    reviews: 245,
    match: 95,
    posted: "2 days ago",
    applicants: 24,
    category: "Software Development",
    employmentType: "Full-time",
    experience: "5+ years",
    description: `
We are looking for an experienced Senior React Developer to join our growing team at TechCorp Pakistan. 
This is an exciting opportunity to work on innovative projects and lead a team of developers.

About the Role:
- Design and develop scalable React applications
- Lead code reviews and mentor junior developers
- Collaborate with product and design teams
- Implement best practices and coding standards

Requirements:
- 5+ years of professional development experience
- Expert knowledge of React and modern JavaScript
- Experience with TypeScript
- Strong understanding of web performance and optimization
- Experience with Redux or other state management libraries
- Familiarity with CI/CD pipelines

What We Offer:
- Competitive salary and benefits package
- Remote work flexibility
- Professional development opportunities
- Health insurance coverage
- Performance bonuses
- Collaborative and innovative work environment
    `,
    skills: ["React", "JavaScript", "TypeScript", "Redux", "Node.js", "REST APIs"],
    company_info: {
      name: "TechCorp Pakistan",
      rating: 4.8,
      reviews: 245,
      employees: 2000,
      description: "Leading tech company focusing on software development and AI solutions",
    },
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
    posted: "5 days ago",
    applicants: 12,
    category: "Software Development",
    employmentType: "Full-time",
    experience: "3+ years",
    description: "Build scalable web applications with modern technologies.",
    skills: ["Node.js", "React", "Postgres"],
    company_info: { name: "Digital Solutions", rating: 4.6, reviews: 128, employees: 350, description: "Digital transformation agency" },
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
    posted: "7 days ago",
    applicants: 8,
    category: "Design & Development",
    employmentType: "Full-time",
    experience: "2+ years",
    description: "Create beautiful and responsive user interfaces.",
    skills: ["React", "CSS", "Figma"],
    company_info: { name: "Innovation Labs", rating: 4.7, reviews: 89, employees: 120, description: "Product innovation studio" },
  },
];

export default function JobDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const job = JOBS.find((j) => String(j.id) === String(id)) || JOBS[0];

  const similarJobs = JOBS.filter((j) => String(j.id) !== String(job.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-base p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 font-semibold">{job.company}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" aria-label="Save job" title="Save job" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                  <button type="button" aria-label="Share job" title="Share job" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salary</p>
                  <p className="font-semibold text-gray-900">{job.salary}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                  <p className="font-semibold text-gray-900">{job.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{job.experience}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-semibold">{job.rating}</span>
                  <span className="text-gray-500">({job.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{job.applicants} applicants</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Posted {job.posted}</span>
                </div>
              </div>
            </div>

            <div className="card-base p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">{job.description}</div>
            </div>

            <div className="card-base p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill) => (
                  <div key={skill} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">{skill}</div>
                ))}
              </div>
            </div>

            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {job.company_info.name}</h2>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.company_info.name}</h3>
                  <p className="text-gray-600 mb-4">{job.company_info.description}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Company Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{job.company_info.rating}</span>
                        <span className="text-gray-500">({job.company_info.reviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Employees</p>
                      <p className="font-semibold text-gray-900">{job.company_info.employees.toLocaleString()}+</p>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-[#0C2B4E] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{job.company_info.name.slice(0,2).toUpperCase()}</span>
                </div>
              </div>
              <Link href={`/companies/1`} className="text-primary hover:text-blue-900 font-semibold inline-flex items-center gap-2">View Company Profile →</Link>
            </div>
          </div>

          <div>
            <button type="button" className="w-full btn-primary mb-6">Apply for This Job</button>

            <div className="card-base p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Match Score</p>
                  <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        {/* Use Tailwind arbitrary width class generated from job.match to avoid inline styles
                            Note: Tailwind may purge dynamic class names in production build; if that occurs,
                            add a safelist entry for the pattern w-[<number>%] in tailwind.config.cjs. */}
                        <div className={`h-full bg-green-500 w-[${job.match}%]`} />
                      </div>
                    <span className="text-sm font-semibold text-gray-900">{job.match}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Category</p>
                  <p className="font-semibold text-gray-900">{job.category}</p>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similarJobs.map((similarJob) => (
                  <Link key={similarJob.id} href={`/jobs/${similarJob.id}`} className="block p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{similarJob.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{similarJob.company}</p>
                    <p className="text-xs text-gray-500">{similarJob.salary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
