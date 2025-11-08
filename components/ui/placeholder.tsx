// components/Placeholder.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="card-base p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="text-4xl font-bold text-primary">?</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
              {description}
            </p>
            <p className="text-gray-500 mb-8">
              This page is coming soon. Would you like us to build this section?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Placeholder;