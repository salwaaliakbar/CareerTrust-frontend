// components/home/CTASection.tsx
import Link from "next/link";

function CTASection() {
  return (
    <section className="py-20 px-4 bg-[#0C2B4E]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Career?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of professionals building verified careers with trust
        </p>
        <Link
          href="/signup"
          className="inline-block bg-yellow-600 text-white hover:bg-amber-600 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}

export default CTASection;