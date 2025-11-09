// components/home/HowItWorksSection.tsx
import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create your account with identity verification for maximum trust.",
  },
  {
    number: 2,
    title: "Build Profile",
    description: "Upload your resume and let AI auto-fill your verified profile.",
  },
  {
    number: 3,
    title: "Get Matches",
    description: "Receive AI-powered job recommendations based on your experience.",
  },
  {
    number: 4,
    title: "Build Trust",
    description: "Verify employment and share reviews to strengthen your profile.",
  },
];

function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-25">
          <h2 className="text-primary text-3xl font-extrabold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Simple steps to build your trusted professional profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center md:justify-start mx-20">
            <div className="rounded-3xl overflow-hidden shadow-lg w-full max-w-md">
              <Image
                src="/assets/images/PhoneImg - Copy.png"
                alt="How It Works Illustration"
                width={720}
                height={720}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-6">
              {steps.map((step, idx) => {
            const palettes = [
              { bg: 'bg-sky-100', text: 'text-sky-700', ring: 'ring-sky-200', border: 'border-sky-100' },
              { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-200', border: 'border-amber-100' },
              { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200', border: 'border-emerald-100' },
              { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200', border: 'border-violet-100' },
            ];
            const pal = palettes[idx % palettes.length];

                return (
                  <div key={step.number} className={`p-6 bg-white rounded-2xl border border-gray-100 border-l-4 ${pal.border} hover:shadow-lg transition transform hover:-translate-y-1`}>
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className={`absolute -inset-1 rounded-xl ${pal.bg} opacity-90`} />
                        <div className={`relative w-12 h-12 bg-white rounded-full flex items-center justify-center ${pal.text} font-bold text-lg ring-1 ring-inset ${pal.ring}`}>
                          {step.number}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;