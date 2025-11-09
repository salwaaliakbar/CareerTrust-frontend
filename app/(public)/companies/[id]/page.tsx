import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Users, Briefcase, MapPin, ArrowLeft } from "lucide-react";

type Company = {
  id: number | string;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
};

const COMPANIES: Company[] = [
  { id: 1, name: "TechCorp Pakistan", industry: "Technology", location: "Karachi", rating: 4.8, reviews: 245, employees: 2000, openJobs: 12, description: "Leading tech company focusing on software development and AI solutions", logo: "TC" },
  { id: 2, name: "Digital Solutions", industry: "Software Services", location: "Lahore", rating: 4.6, reviews: 128, employees: 500, openJobs: 8, description: "Innovative digital solutions and web development services", logo: "DS" },
  { id: 3, name: "Innovation Labs", industry: "R&D", location: "Islamabad", rating: 4.7, reviews: 89, employees: 350, openJobs: 5, description: "Research and development in cutting-edge technologies", logo: "IL" },
  { id: 4, name: "CloudTech Solutions", industry: "Cloud Services", location: "Karachi", rating: 4.5, reviews: 156, employees: 1200, openJobs: 15, description: "Cloud infrastructure and managed services provider", logo: "CTS" },
  { id: 5, name: "StartupHub", industry: "Startup Ecosystem", location: "Lahore", rating: 4.9, reviews: 67, employees: 150, openJobs: 6, description: "Accelerator and incubator supporting Pakistani startups", logo: "SH" },
  { id: 6, name: "Design Studios", industry: "Design & Creative", location: "Karachi", rating: 4.6, reviews: 94, employees: 200, openJobs: 4, description: "Creative design agency specializing in UX/UI and branding", logo: "DS" },
];

export default function CompanyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const company = COMPANIES.find((c) => String(c.id) === String(id)) || COMPANIES[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link href="/companies" className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Companies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-base p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  <p className="text-xl text-gray-600 font-semibold">{company.industry}</p>
                  <p className="text-sm text-gray-500 mt-2">{company.location}, Pakistan</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="w-20 h-20 bg-[#0C2B4E] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{company.logo}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{company.openJobs} Open</div>
                    <div className="text-sm text-gray-500">Positions</div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600 mb-6">{company.description}</div>

              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{company.rating}</span>
                    <span className="text-gray-500">({company.reviews} reviews)</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Employees</p>
                  <p className="font-semibold text-gray-900">{company.employees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{company.location}</p>
                </div>
              </div>
            </div>

            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Positions at {company.name}</h2>
              <div className="space-y-4">
                {Array.from({ length: company.openJobs }).map((_, idx) => (
                  <Link key={idx} href={`/jobs`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{`Position ${idx + 1}`}</h3>
                        <p className="text-xs text-gray-600">Location: {company.location}</p>
                      </div>
                      <div className="text-sm text-gray-500">Apply →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="card-base p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{company.employees.toLocaleString()} employees</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{company.openJobs} open positions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow</h3>
              <p className="text-sm text-gray-600 mb-3">Get updates when {company.name} posts new jobs.</p>
              <button type="button" className="w-full btn-primary">Follow Company</button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
