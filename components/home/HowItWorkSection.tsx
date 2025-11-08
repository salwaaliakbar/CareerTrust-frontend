// components/home/HowItWorksSection.tsx

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
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Simple steps to build your trusted professional profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="card-base p-8">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;