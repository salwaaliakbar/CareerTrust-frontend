import { CheckCircle } from "lucide-react";

export default function EmployerSteps() {
  const steps = [
    { title: "Post a job", desc: "Create a role and screen settings" },
    {
      title: "Review candidates",
      desc: "One-click screening & verified profiles",
    },
    { title: "Hire", desc: "Shortlist and make an offer" },
    {
      title: "Reputation history",
      desc: "View your trust score timeline and verification events",
    },
  ];

  return (
    <section aria-labelledby="employer-steps" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3
          id="employer-steps"
          className="text-primary text-3xl font-extrabold mb-4 text-center"
        >
          How it works for employers
        </h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto text-center">From posting a role to making an offer — a simple, fast flow that helps you surface verified candidates and build hiring confidence.</p>

        <ul className="grid grid-cols-1 sm:grid-cols-4 gap-6 list-none px-8 mt-15">
          {steps.map((s, i) => (
            <li key={i} className="relative bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 hover:shadow-lg hover:-translate-y-1 transform-gpu transition duration-200">
              <span className="absolute -left-2 top-6 h-10 w-1 rounded-r-lg bg-sky-600/20" aria-hidden="true" />

              <div className="flex items-start gap-4">
                <div className="p-3 bg-sky-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-[#0C4A6E]" />
                </div>

                <div>
                  <div className="text-lg font-semibold text-slate-900">{s.title}</div>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
