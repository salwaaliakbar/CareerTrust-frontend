import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function CTASection() {
  return (
    <section className="py-20 bg-[#1D546C] relative overflow-hidden text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-secondary rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Join CareerTrust{`'`}s fastest-growing job platform
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Take the Next Step in Your Career?
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Whether you{`'`}re looking for your next opportunity or seeking top talent, CareerTrust is here to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              aria-label="Get started free"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold bg-secondary text-white shadow-lg hover:bg-amber-600 hover:shadow-xl transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 bg-amber-500"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              aria-label="Learn more about CareerTrust"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-secondary/50 text-secondary bg-transparent hover:bg-secondary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
            >
              Learn More
            </Link>
          </div>

          <p className="mt-8 text-primary-foreground/60 text-sm">
            No credit card required • Free account forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
