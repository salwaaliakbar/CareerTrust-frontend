import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogsClient from "@/components/blogs/BlogsClient";

const blogs = [
  {
    id: 1,
    title: "10 Tips for Acing Your Next Job Interview",
    excerpt:
      "Master the art of interviewing with these proven strategies. Learn how to present yourself confidently and make a lasting impression on potential employers.",
    author: "Sarah Ahmed",
    date: "Nov 10, 2025",
    category: "Career Development",
    readTime: "5 min read",
    image: "interview-tips",
  },
  {
    id: 2,
    title: "Remote Work: Building a Productive Home Office",
    excerpt:
      "Create the perfect work-from-home setup. Discover ergonomic tips, productivity hacks, and how to maintain work-life balance in a remote environment.",
    author: "Ahmed Khan",
    date: "Nov 8, 2025",
    category: "Work Culture",
    readTime: "6 min read",
    image: "remote-work",
  },
  {
    id: 3,
    title: "LinkedIn Profile Optimization: 2025 Guide",
    excerpt:
      "Your LinkedIn profile is your professional brand. Learn how to optimize every section to attract recruiters and land your dream job.",
    author: "Fatima Malik",
    date: "Nov 5, 2025",
    category: "Professional Branding",
    readTime: "7 min read",
    image: "linkedin-guide",
  },
  {
    id: 4,
    title: "Negotiating Your Salary: A Practical Guide",
    excerpt:
      "Don't leave money on the table. Learn effective negotiation strategies to secure the compensation package you deserve.",
    author: "Hassan Ali",
    date: "Nov 1, 2025",
    category: "Career Development",
    readTime: "8 min read",
    image: "salary-negotiation",
  },
  {
    id: 5,
    title: "Industry Trends in Tech: What's Coming in 2025",
    excerpt:
      "Stay ahead of the curve. Explore emerging technologies, skill demands, and career opportunities in the tech industry for the coming year.",
    author: "Ayesha Rauf",
    date: "Oct 28, 2025",
    category: "Industry Insights",
    readTime: "9 min read",
    image: "tech-trends",
  },
  {
    id: 6,
    title: "Building Strong Professional Networks",
    excerpt:
      "Networking is essential for career growth. Learn how to build meaningful professional relationships that last and benefit your career trajectory.",
    author: "Usama Siddiqui",
    date: "Oct 25, 2025",
    category: "Professional Branding",
    readTime: "6 min read",
    image: "networking",
  },
  {
    id: 7,
    title: "Resume Writing Tips That Get You Noticed",
    excerpt:
      "Your resume is your first impression. Master the art of writing a compelling resume that passes ATS systems and impresses hiring managers.",
    author: "Zara Hassan",
    date: "Oct 22, 2025",
    category: "Career Development",
    readTime: "7 min read",
    image: "resume-tips",
  },
  {
    id: 8,
    title: "Work-Life Balance: Strategies for Success",
    excerpt:
      "Burnout is real. Discover practical strategies to maintain a healthy work-life balance and excel in your career without sacrificing well-being.",
    author: "Omar Farooq",
    date: "Oct 19, 2025",
    category: "Work Culture",
    readTime: "5 min read",
    image: "work-life-balance",
  },
  {
    id: 9,
    title: "Upskilling in 2025: Courses You Should Consider",
    excerpt:
      "Stay competitive in the job market. Explore the best online courses and certifications that will boost your career prospects this year.",
    author: "Nadia Yasmin",
    date: "Oct 16, 2025",
    category: "Skill Development",
    readTime: "8 min read",
    image: "upskilling",
  },
];

export default function BlogsPage() {
  return (
    <div>
      <Header />
      <BlogsClient blogs={blogs} />
      <Footer />
    </div>
  );
}
