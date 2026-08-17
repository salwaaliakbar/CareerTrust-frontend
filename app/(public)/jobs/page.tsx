import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobsClient from "@/components/jobs/JobsClient";

export default function JobsPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={null}>
        <JobsClient />
      </Suspense>
      <Footer />
    </div>
  );
}
