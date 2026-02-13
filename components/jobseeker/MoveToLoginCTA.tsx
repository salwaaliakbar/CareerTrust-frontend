import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const MoveToLoginCTA = () => {
  return (
    <section className="py-20 bg-[#1D546C] relative overflow-hidden text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-amber-500 rounded-full blur-3xl animate-pulse animation-delay-3s" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[#F4F4F4]/90 text-sm font-medium">
              Join CareerTrust{`'`}s fastest-growing job platform
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F4F4F4] mb-6">
            Ready to Take the Next Step in Your Career?
          </h2>

          <p className="text-lg text-[#F4F4F4]/80 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust CareerTrust to find their perfect role. Your dream job is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              aria-label="Sign in to your account"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold bg-amber-500 text-white shadow-lg hover:bg-amber-600 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              Sign In Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/signup"
              aria-label="Create a free account"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border-2 border-amber-500/50 text-amber-500 bg-transparent hover:bg-amber-500/10 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
            >
              Create Free Account
            </Link>
          </div>

          <p className="mt-8 text-[#F4F4F4]/60 text-sm">
            No credit card required • Free account forever • Start applying today
          </p>
        </div>
      </div>
    </section>
  );
};

export default MoveToLoginCTA;
