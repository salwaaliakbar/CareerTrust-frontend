import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogsClient from "@/components/blogs/BlogsClient";

export default function BlogsPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={null}>
        <BlogsClient />
      </Suspense>
      <Footer />
    </div>
  );
}
