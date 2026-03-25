import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#0C2B4E]/10 to-white p-6">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 w-40 h-40 rounded-full bg-[#0C2B4E] flex items-center justify-center text-white text-3xl font-bold shadow-md">
            404
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0C2B4E] mb-2">Page not found</h2>
            <p className="text-gray-600 mb-4">
              The page you were looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3 justify-center md:justify-start">
              <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0C2B4E] text-white rounded-lg shadow hover:bg-[#173a62] transition">
                Go to Home
              </Link>

              <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400 text-center">
          If you followed a link, it may be broken — try returning to the homepage or reach out to us.
        </div>
      </div>
    </div>
  );
}