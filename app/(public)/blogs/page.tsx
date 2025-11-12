import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogsClient from "@/components/blogs/BlogsClient";
import { fetchBlogs } from "@/services/api/blogs.service";

export default async function BlogsPage() {
  // Fetch blogs from API
  const blogs = await fetchBlogs();

  return (
    <div>
      <Header />
      <BlogsClient blogs={blogs} />
      <Footer />
    </div>
  );
}
