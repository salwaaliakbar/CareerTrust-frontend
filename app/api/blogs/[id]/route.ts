import { NextRequest, NextResponse } from 'next/server';

// Static blog data with full content
const blogDetails: any = {
  1: {
    id: 1,
    title: "10 Tips for Acing Your Next Job Interview",
    excerpt:
      "Master the art of interviewing with these proven strategies. Learn how to present yourself confidently and make a lasting impression on potential employers.",
    content: `
      <h2>Introduction</h2>
      <p>Job interviews can be nerve-wracking, but with the right preparation and mindset, you can ace any interview. Here are 10 proven tips to help you succeed.</p>
      
      <h2>1. Research the Company</h2>
      <p>Before your interview, thoroughly research the company's mission, values, products, and recent news. This shows genuine interest and helps you tailor your responses.</p>
      
      <h2>2. Practice Common Questions</h2>
      <p>Prepare answers for common interview questions like "Tell me about yourself" and "Why do you want this job?" Practice out loud to build confidence.</p>
      
      <h2>3. Dress Professionally</h2>
      <p>First impressions matter. Dress appropriately for the company culture, erring on the side of professional.</p>
      
      <h2>4. Arrive Early</h2>
      <p>Plan to arrive 10-15 minutes early. This shows punctuality and gives you time to compose yourself.</p>
      
      <h2>5. Bring Copies of Your Resume</h2>
      <p>Have multiple copies of your resume ready, even if you've submitted it online.</p>
      
      <h2>6. Ask Thoughtful Questions</h2>
      <p>Prepare questions about the role, team, and company culture. This shows engagement and helps you assess fit.</p>
      
      <h2>7. Use the STAR Method</h2>
      <p>Answer behavioral questions using Situation, Task, Action, Result framework for clear, structured responses.</p>
      
      <h2>8. Show Enthusiasm</h2>
      <p>Express genuine excitement about the opportunity. Enthusiasm is contagious and memorable.</p>
      
      <h2>9. Follow Up</h2>
      <p>Send a thank-you email within 24 hours, reiterating your interest and key qualifications.</p>
      
      <h2>10. Be Yourself</h2>
      <p>Authenticity matters. Let your personality shine while maintaining professionalism.</p>
    `,
    author: "Sarah Ahmed",
    date: "Nov 10, 2025",
    category: "Career Development",
    readTime: "5 min read",
    image: "interview-tips",
  },
  2: {
    id: 2,
    title: "Remote Work: Building a Productive Home Office",
    excerpt:
      "Create the perfect work-from-home setup. Discover ergonomic tips, productivity hacks, and how to maintain work-life balance in a remote environment.",
    content: `
      <h2>Creating Your Ideal Workspace</h2>
      <p>Remote work is here to stay. Setting up a productive home office is crucial for success and well-being.</p>
      
      <h2>Essential Equipment</h2>
      <p>Invest in a good chair, desk, monitor, and reliable internet. Your body and productivity will thank you.</p>
      
      <h2>Ergonomics Matter</h2>
      <p>Position your screen at eye level, keep your keyboard at elbow height, and maintain good posture throughout the day.</p>
      
      <h2>Minimize Distractions</h2>
      <p>Create a dedicated workspace separate from living areas. Use noise-canceling headphones if needed.</p>
      
      <h2>Establish Routines</h2>
      <p>Start and end work at consistent times. Morning routines help signal your brain it's time to work.</p>
      
      <h2>Take Regular Breaks</h2>
      <p>Use the Pomodoro Technique: 25 minutes of focused work followed by 5-minute breaks.</p>
    `,
    author: "Ahmed Khan",
    date: "Nov 8, 2025",
    category: "Work Culture",
    readTime: "6 min read",
    image: "remote-work",
  },
  3: {
    id: 3,
    title: "LinkedIn Profile Optimization: 2025 Guide",
    excerpt:
      "Your LinkedIn profile is your professional brand. Learn how to optimize every section to attract recruiters and land your dream job.",
    content: `
      <h2>Your Professional Brand</h2>
      <p>LinkedIn is the premier platform for professional networking. An optimized profile can open doors to opportunities.</p>
      
      <h2>Professional Profile Photo</h2>
      <p>Use a high-quality, professional headshot. Profiles with photos receive 21x more views.</p>
      
      <h2>Compelling Headline</h2>
      <p>Go beyond your job title. Highlight your value proposition and expertise in 120 characters.</p>
      
      <h2>About Section</h2>
      <p>Tell your story. What drives you? What problems do you solve? Make it personal and authentic.</p>
      
      <h2>Experience Section</h2>
      <p>Use bullet points to highlight achievements, not just responsibilities. Quantify results when possible.</p>
      
      <h2>Skills & Endorsements</h2>
      <p>List relevant skills strategically. Your top 3 skills appear prominently on your profile.</p>
      
      <h2>Recommendations</h2>
      <p>Request recommendations from colleagues, managers, and clients. They add credibility.</p>
      
      <h2>Stay Active</h2>
      <p>Share insights, engage with content, and build your network consistently.</p>
    `,
    author: "Fatima Malik",
    date: "Nov 5, 2025",
    category: "Professional Branding",
    readTime: "7 min read",
    image: "linkedin-guide",
  },
  4: {
    id: 4,
    title: "Negotiating Your Salary: A Practical Guide",
    excerpt:
      "Don't leave money on the table. Learn effective negotiation strategies to secure the compensation package you deserve.",
    content: `
      <h2>Know Your Worth</h2>
      <p>Research industry standards and salary ranges for your position and experience level before negotiations.</p>
      
      <h2>Timing Matters</h2>
      <p>Wait for the offer before discussing salary. Let the employer make the first move when possible.</p>
      
      <h2>Consider the Total Package</h2>
      <p>Look beyond base salary. Consider benefits, bonuses, stock options, vacation time, and growth opportunities.</p>
      
      <h2>Practice Your Pitch</h2>
      <p>Rehearse your negotiation conversation. Be confident but respectful in your approach.</p>
      
      <h2>Be Prepared to Walk Away</h2>
      <p>Know your minimum acceptable offer and be willing to decline if it doesn't meet your needs.</p>
    `,
    author: "Hassan Ali",
    date: "Nov 1, 2025",
    category: "Career Development",
    readTime: "8 min read",
    image: "salary-negotiation",
  },
  5: {
    id: 5,
    title: "Industry Trends in Tech: What's Coming in 2025",
    excerpt:
      "Stay ahead of the curve. Explore emerging technologies, skill demands, and career opportunities in the tech industry for the coming year.",
    content: `
      <h2>AI and Machine Learning</h2>
      <p>AI continues to transform industries. Skills in machine learning, data science, and AI ethics are in high demand.</p>
      
      <h2>Cloud Computing Evolution</h2>
      <p>Multi-cloud strategies and serverless architectures are becoming standard. Cloud certifications are valuable assets.</p>
      
      <h2>Cybersecurity Focus</h2>
      <p>With increasing threats, cybersecurity professionals are more critical than ever. Zero-trust architecture is the new norm.</p>
      
      <h2>Remote-First Culture</h2>
      <p>Companies are embracing permanent remote work, creating global talent opportunities.</p>
      
      <h2>Sustainable Tech</h2>
      <p>Green computing and sustainable technology practices are gaining importance in tech companies.</p>
    `,
    author: "Ayesha Rauf",
    date: "Oct 28, 2025",
    category: "Industry Insights",
    readTime: "9 min read",
    image: "tech-trends",
  },
  6: {
    id: 6,
    title: "Building Strong Professional Networks",
    excerpt:
      "Networking is essential for career growth. Learn how to build meaningful professional relationships that last and benefit your career trajectory.",
    content: `
      <h2>Start with Authenticity</h2>
      <p>Build genuine connections based on mutual interests and shared values, not just career advancement.</p>
      
      <h2>Attend Industry Events</h2>
      <p>Conferences, meetups, and workshops provide excellent networking opportunities. Come prepared with conversation starters.</p>
      
      <h2>Leverage Social Media</h2>
      <p>Use LinkedIn, Twitter, and industry-specific platforms to connect with professionals in your field.</p>
      
      <h2>Offer Value First</h2>
      <p>Help others before asking for help. Share knowledge, make introductions, and provide support.</p>
      
      <h2>Follow Up Consistently</h2>
      <p>Maintain relationships over time. Regular check-ins and meaningful interactions keep connections strong.</p>
    `,
    author: "Usama Siddiqui",
    date: "Oct 25, 2025",
    category: "Professional Branding",
    readTime: "6 min read",
    image: "networking",
  },
  7: {
    id: 7,
    title: "Resume Writing Tips That Get You Noticed",
    excerpt:
      "Your resume is your first impression. Master the art of writing a compelling resume that passes ATS systems and impresses hiring managers.",
    content: `
      <h2>Format for ATS</h2>
      <p>Use a clean, simple format with standard headings. Avoid images, tables, and complex formatting that confuse ATS systems.</p>
      
      <h2>Tailor for Each Job</h2>
      <p>Customize your resume for every application. Use keywords from the job description strategically.</p>
      
      <h2>Quantify Achievements</h2>
      <p>Use numbers and metrics to demonstrate impact. "Increased sales by 30%" is more powerful than "Improved sales."</p>
      
      <h2>Use Action Verbs</h2>
      <p>Start bullet points with strong action verbs: achieved, developed, implemented, managed, optimized.</p>
      
      <h2>Keep It Concise</h2>
      <p>One to two pages maximum. Include only relevant experience from the past 10-15 years.</p>
    `,
    author: "Zara Hassan",
    date: "Oct 22, 2025",
    category: "Career Development",
    readTime: "7 min read",
    image: "resume-tips",
  },
  8: {
    id: 8,
    title: "Work-Life Balance: Strategies for Success",
    excerpt:
      "Burnout is real. Discover practical strategies to maintain a healthy work-life balance and excel in your career without sacrificing well-being.",
    content: `
      <h2>Set Clear Boundaries</h2>
      <p>Define work hours and stick to them. Communicate your availability to colleagues and managers.</p>
      
      <h2>Prioritize Self-Care</h2>
      <p>Exercise, sleep, and proper nutrition are not luxuries—they're necessities for sustainable performance.</p>
      
      <h2>Learn to Say No</h2>
      <p>You can't do everything. Protect your time by declining non-essential commitments gracefully.</p>
      
      <h2>Unplug Regularly</h2>
      <p>Take breaks from technology. Designate device-free times to recharge mentally.</p>
      
      <h2>Pursue Hobbies</h2>
      <p>Engage in activities outside of work that bring you joy and fulfillment.</p>
    `,
    author: "Omar Farooq",
    date: "Oct 19, 2025",
    category: "Work Culture",
    readTime: "5 min read",
    image: "work-life-balance",
  },
  9: {
    id: 9,
    title: "Upskilling in 2025: Courses You Should Consider",
    excerpt:
      "Stay competitive in the job market. Explore the best online courses and certifications that will boost your career prospects this year.",
    content: `
      <h2>Technical Skills</h2>
      <p>Programming languages (Python, JavaScript), cloud platforms (AWS, Azure), and data analytics tools are highly valued.</p>
      
      <h2>Soft Skills Matter</h2>
      <p>Leadership, communication, and emotional intelligence courses can accelerate your career progression.</p>
      
      <h2>Industry Certifications</h2>
      <p>PMP, AWS Solutions Architect, Google Analytics, and Scrum Master certifications add credibility to your profile.</p>
      
      <h2>Online Learning Platforms</h2>
      <p>Coursera, Udemy, LinkedIn Learning, and edX offer flexible, affordable courses across industries.</p>
      
      <h2>Stay Current</h2>
      <p>Technology evolves rapidly. Commit to continuous learning to remain relevant in your field.</p>
    `,
    author: "Nadia Yasmin",
    date: "Oct 16, 2025",
    category: "Skill Development",
    readTime: "8 min read",
    image: "upskilling",
  },
};

// GET /api/blogs/[id] - Get blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    const blog = blogDetails[blogId];

    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: blog,
    }, { status: 200 });

  } catch (error: any) {
    const { id } = await params;
    console.error(`GET /api/blogs/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch blog',
    }, { status: 500 });
  }
}

// PUT /api/blogs/[id] - Update blog (for future use)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Add validation and update in database
    return NextResponse.json({
      success: true,
      message: 'Blog update endpoint - To be implemented',
      data: body,
    }, { status: 200 });

  } catch (error: any) {
    const { id } = await params;
    console.error(`PUT /api/blogs/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update blog',
    }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete blog (for future use)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Delete from database
    return NextResponse.json({
      success: true,
      message: 'Blog deletion endpoint - To be implemented',
    }, { status: 200 });

  } catch (error: any) {
    const { id } = await params;
    console.error(`DELETE /api/blogs/${id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete blog',
    }, { status: 500 });
  }
}
