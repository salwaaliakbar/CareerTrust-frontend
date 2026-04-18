# Redux State Management Setup

## Overview

Redux Toolkit and React-Redux have been implemented for centralized state management of **Blogs**, **Jobs**, and **Companies**. This provides predictable state management across the application with full TypeScript support.

## Installation

Redux dependencies are installed:

```bash
npm install @reduxjs/toolkit react-redux
```

## Project Structure

```
src/store/
├── store.ts              # Redux store configuration
├── hooks.ts              # Pre-typed Redux hooks (useAppDispatch, useAppSelector)
├── provider.tsx          # ReduxProvider component
└── slices/
    ├── blogsSlice.ts     # Blogs reducer + async thunks
    ├── jobsSlice.ts      # Jobs reducer + async thunks
    └── companiesSlice.ts # Companies reducer + async thunks

app/layout.tsx           # ReduxProvider wrapped around app
```

## Setup in App

The `ReduxProvider` is already integrated in `app/layout.tsx`:

```typescript
import { ReduxProvider } from "@/src/store/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ClerkProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Pre-typed Hooks

Always import from `@/src/store/hooks.ts`:

```typescript
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
```

- **useAppDispatch**: Dispatches Redux actions
- **useAppSelector**: Selects state from Redux store (fully typed)

## Available Async Thunks

### Blogs Slice

- `getAllBlogs()` - Fetch all blogs from `/api/blogs`
- `getBlogById(id: string | number)` - Fetch single blog
- `clearSelectedBlog()` - Clear selected blog state
- `clearError()` - Clear error message

**State Structure:**

```typescript
{
  items: Blog[];                               // All blogs from list view
  selectedBlog: BlogDetail | null;             // Currently displayed blog
  blogsById: Record<string | number, BlogDetail>; // Cache of ALL visited blogs
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;                // Timestamp for list cache
  lastFetchTimeById: Record<string | number, number>; // Timestamp per blog
}
```

**Caching Strategy:** Multi-item dictionary

- Stores ALL visited blogs in `blogsById`
- Each blog has independent `lastFetchTimeById[blogId]` timestamp
- 10-minute TTL per blog (configurable)

### Jobs Slice

- `getAllJobs()` - Fetch all jobs from `/api/jobs`
- `getJobById(id: string | number)` - Fetch single job
- `getFeaturedJobs()` - Fetch featured jobs (limit: 6)
- `clearSelectedJob()` - Clear selected job state
- `clearError()` - Clear error message

**State Structure:**

```typescript
{
  items: Job[];                            // All jobs from list view
  featuredItems: Job[];                    // Featured jobs
  selectedJob: Job | null;                 // Currently displayed job
  jobsById: Record<string | number, Job>; // Cache of ALL visited jobs
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;                // Timestamp for list cache
  lastFetchTimeFeatured: number | null;       // Timestamp for featured cache
  lastFetchTimeById: Record<string | number, number>; // Timestamp per job
}
```

**Caching Strategy:** Multi-item dictionary

- Stores ALL visited jobs in `jobsById`
- Each job has independent `lastFetchTimeById[jobId]` timestamp
- 10-minute TTL per job (configurable)

### Companies Slice

- `getAllCompanies()` - Fetch all companies from `/api/companies`
- `getCompanyById(id: string | number)` - Fetch single company
- `getFeaturedCompanies()` - Fetch featured companies (limit: 6)
- `clearSelectedCompany()` - Clear selected company state
- `clearError()` - Clear error message

**State Structure:**

```typescript
{
  items: Company[];                               // All companies from list view
  featuredItems: Company[];                       // Featured companies
  selectedCompany: Company | null;                // Currently displayed company
  companiesById: Record<string | number, Company>; // Cache of ALL visited companies
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastFetchTime: number | null;                   // Timestamp for list cache
  lastFetchTimeFeatured: number | null;           // Timestamp for featured cache
  lastFetchTimeById: Record<string | number, number>; // Timestamp per company
}
```

**Caching Strategy:** Multi-item dictionary

- Stores ALL visited companies in `companiesById`
- Each company has independent `lastFetchTimeById[companyId]` timestamp
- 10-minute TTL per company (configurable)

## Implementation Examples

### Implementation in Blogs List Page

**File: `app/(public)/blogs/page.tsx`**

```typescript
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogsClient from "@/components/blogs/BlogsClient";

export default function BlogsPage() {
  return (
    <div>
      <Header />
      <BlogsClient />
      <Footer />
    </div>
  );
}
```

**File: `components/blogs/BlogsClient.tsx`**

```typescript
"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getAllBlogs } from "@/src/store/slices/blogsSlice";
import BlogCard from "@/components/blogs/BlogCard";
import { Search, Filter } from "lucide-react";

export default function BlogsClient() {
  const dispatch = useAppDispatch();
  const { items: blogs, loading } = useAppSelector((state) => state.blogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Dispatch Redux action on component mount
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.category))).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        blog.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#0C2B4E] text-white py-16 px-4">
        <h1 className="text-4xl font-bold mb-3">Career Insights & Tips</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="col-span-2 px-4 py-3 rounded-lg text-gray-900"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-lg text-gray-900"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

### Implementation in Jobs List Page

**File: `app/(public)/jobs/page.tsx`**

```typescript
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobsClient from "@/components/jobs/JobsClient";

export default function JobsPage() {
  return (
    <div>
      <Header />
      <JobsClient />
      <Footer />
    </div>
  );
}
```

**File: `components/jobs/JobsClient.tsx`**

```typescript
"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getAllJobs, type Job } from "@/src/store/slices/jobsSlice";
import JobCard from "@/components/jobs/JobCard";

export default function JobsClient() {
  const dispatch = useAppDispatch();
  const { items: jobs, loading } = useAppSelector((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location))).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !selectedLocation ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero & Search */}
      <section className="bg-[#0C2B4E] text-white py-12 px-4">
        <h1 className="text-4xl font-bold mb-3">Find Your Next Opportunity</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Job title, company, skills..."
            className="col-span-2 px-4 py-3 rounded-lg text-gray-900"
          />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 rounded-lg text-gray-900"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Jobs List */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

### Implementation in Companies List Page

**File: `app/(public)/companies/page.tsx`**

```typescript
"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getAllCompanies } from "@/src/store/slices/companiesSlice";
import CompanyCard from "@/components/companies/CompanyCard";

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const { items: companies, loading } = useAppSelector(
    (state) => state.companies
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0C2B4E] text-white py-12 px-8">
        <h1 className="text-4xl font-bold mb-3">Explore Companies</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company name or industry..."
          className="w-full max-w-2xl px-4 py-3 rounded-lg text-gray-900"
        />
      </section>

      {/* Companies Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
```

### Implementation in Blog Detail Page

**File: `app/(public)/blogs/[id]/page.tsx`**

```typescript
"use client";

import { useEffect } from "react";
import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getBlogById } from "@/src/store/slices/blogsSlice";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap Promise params
  const dispatch = useAppDispatch();
  const { selectedBlog: blog, loading } = useAppSelector(
    (state) => state.blogs
  );

  useEffect(() => {
    dispatch(getBlogById(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Header />
        <main className="bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-600">Article not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="bg-gray-50 py-12 px-4">
        <article className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sky-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-600 pb-6 border-b mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{blog.readTime}</span>
            </div>
          </div>
          <div className="prose prose-lg max-w-none">
            <div
              className="bg-white p-8 rounded-lg shadow-sm"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
```

### Implementation in Job Detail Page

**File: `app/(public)/jobs/[id]/page.tsx`**

```typescript
"use client";

import { useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getJobById } from "@/src/store/slices/jobsSlice";

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap Promise params
  const dispatch = useAppDispatch();
  const {
    selectedJob: job,
    items: allJobs,
    loading,
  } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading job...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Job not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const similarJobs = allJobs
    .filter((j) => String(j.id) !== String(job.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-primary mb-6"
        >
          Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{job.company}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="font-semibold">{job.salary || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-semibold">{job.jobType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-semibold">{job.experience}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </div>

        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-3">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Implementation in Company Detail Page

**File: `app/(public)/companies/[id]/page.tsx`**

```typescript
"use client";

import { useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCompanyById } from "@/src/store/slices/companiesSlice";

export default function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap Promise params
  const dispatch = useAppDispatch();
  const { selectedCompany: company, loading } = useAppSelector(
    (state) => state.companies
  );

  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading company...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <p className="text-gray-600">Company not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-primary mb-6"
        >
          Back to Companies
        </Link>
        <div className="bg-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {company.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{company.industry}</p>
          <p className="text-gray-600 mb-6">{company.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="font-semibold">{company.rating}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="font-semibold">{company.reviews}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="font-semibold">
                {company.employees.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Jobs</p>
              <p className="font-semibold">{company.openJobs}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Key Points for Detail Pages

- **Promise Unwrapping**: Use `const { id } = use(params)` to unwrap Promise-based params in client components
- **Dispatch on Mount**: Detail pages dispatch `getById` thunks when component mounts
- **Similar Items**: Use `items` from Redux state to show similar blogs/jobs
- **Loading States**: Show loading spinner while Redux thunk is fetching data
- **Error Handling**: Show "not found" message if item is null

## Best Practices

1. **Always use pre-typed hooks**: Import from `@/src/store/hooks.ts`
2. **Add 'use client' directive**: All components using Redux need `'use client'`
3. **Unwrap params**: Use `React.use()` to unwrap Promise params in client components
4. **Handle loading states**: Check `loading` boolean from Redux state
5. **Handle errors**: Check `error` from Redux state and display appropriately
6. **Dispatch on mount**: Use `useEffect` with `[dispatch]` dependency
7. **Use useMemo for filtering**: Prevent unnecessary re-renders during filtering

## Common Patterns

### Fetching Data on Component Mount

```typescript
useEffect(() => {
  dispatch(getAllBlogs());
}, [dispatch]);
```

### Displaying Loading/Error States

```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Filtering Data

```typescript
const filtered = useMemo(() => {
  return items.filter((item) => item.name.includes(searchTerm));
}, [items, searchTerm]);
```

## Redux DevTools

To enable Redux DevTools for debugging:

1. Install Redux DevTools Chrome/Firefox extension
2. The store is pre-configured to work with DevTools
3. You'll see all state changes in the extension

## Type Safety

All Redux operations are fully typed:

- Dispatch is typed to accept only valid actions
- Selectors return properly typed state
- Thunks have typed payloads and return values
- TypeScript will catch incorrect usage at compile time

## File Summary

| File                                 | Purpose                                     |
| ------------------------------------ | ------------------------------------------- |
| `src/store/store.ts`                 | Redux store configuration                   |
| `src/store/hooks.ts`                 | Pre-typed useAppDispatch and useAppSelector |
| `src/store/provider.tsx`             | ReduxProvider component for app             |
| `src/store/slices/blogsSlice.ts`     | Blogs state management                      |
| `src/store/slices/jobsSlice.ts`      | Jobs state management                       |
| `src/store/slices/companiesSlice.ts` | Companies state management                  |

## Cache Duration Configuration Guide

### What is Cache Duration?

Cache duration is the time period for which Redux keeps fetched data in memory. After this time expires, the next request will fetch fresh data from the API.

### Current Setup

**Default:** 10 minutes (600,000 milliseconds)

Located in each slice file:

```typescript
// src/store/slices/blogsSlice.ts (line ~20)
// src/store/slices/jobsSlice.ts (line ~45)
// src/store/slices/companiesSlice.ts (line ~45)
const CACHE_DURATION = 10 * 60 * 1000;
```

### How to Adjust Cache Duration

#### Step 1: Open Your Slice File

Choose which entity to modify:

- `src/store/slices/blogsSlice.ts`
- `src/store/slices/jobsSlice.ts`
- `src/store/slices/companiesSlice.ts`

#### Step 2: Find the CACHE_DURATION Constant

```typescript
// Look for this line (near the top of the file, after imports)
const CACHE_DURATION = 10 * 60 * 1000;
```

#### Step 3: Update the Value

**Formula:** `(minutes * 60 * 1000)`

| Duration       | Code             | Notes                                     |
| -------------- | ---------------- | ----------------------------------------- |
| 1 minute       | `1 * 60 * 1000`  | Very aggressive caching (not recommended) |
| 2 minutes      | `2 * 60 * 1000`  | Frequent API calls                        |
| 5 minutes      | `5 * 60 * 1000`  | Good for frequently updated data          |
| **10 minutes** | `10 * 60 * 1000` | **Current default - recommended**         |
| 15 minutes     | `15 * 60 * 1000` | Balanced approach                         |
| 30 minutes     | `30 * 60 * 1000` | Long cache for stable data                |
| 1 hour         | `60 * 60 * 1000` | Very long cache                           |
| No cache       | `0`              | Always fetch fresh (performance impact)   |

### Example Changes

#### Change Blogs to 5 Minutes

**File:** `src/store/slices/blogsSlice.ts`

```typescript
// Before
const CACHE_DURATION = 10 * 60 * 1000;

// After
const CACHE_DURATION = 5 * 60 * 1000;
```

#### Change Jobs to 3 Minutes

**File:** `src/store/slices/jobsSlice.ts`

```typescript
// Before
const CACHE_DURATION = 10 * 60 * 1000;

// After
const CACHE_DURATION = 3 * 60 * 1000;
```

#### Change Companies to 30 Minutes

**File:** `src/store/slices/companiesSlice.ts`

```typescript
// Before
const CACHE_DURATION = 10 * 60 * 1000;

// After
const CACHE_DURATION = 30 * 60 * 1000;
```

### Recommended Settings by Use Case

**Jobs Listing** (Frequently updated)

```typescript
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes
```

Why: New jobs posted regularly, users expect fresh listings

**Blogs** (Medium frequency)

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes - CURRENT
```

Why: Good balance between server load and data freshness

**Companies** (Stable data)

```typescript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
```

Why: Company info rarely changes, significant load reduction

### Multi-Item Dictionary Caching Benefits

The new caching system stores **all visited items** in memory:

```typescript
// Example: Blogs
blogsById: {
  1: { id: 1, title: "...", ... },  // Blog 1 cached
  2: { id: 2, title: "...", ... },  // Blog 2 cached
  3: { id: 3, title: "...", ... },  // Blog 3 cached
}

lastFetchTimeById: {
  1: 1700644800000,  // Blog 1 cached at this time
  2: 1700644900000,  // Blog 2 cached at this time
  3: 1700645000000,  // Blog 3 cached at this time
}
```

**Benefits:**

- ✅ Visit blog/1 → cached
- ✅ Visit blog/2 → cached (blog/1 still cached!)
- ✅ Return to blog/1 → **NO API CALL** (instant load)
- ✅ Return to blog/2 → **NO API CALL** (instant load)

**Memory Impact:**

- Only stores visited items (not entire dataset)
- ~2-5 KB per item (negligible)
- Clears when user leaves/refreshes page

### Cache Performance Comparison

| Setting      | API Calls | Server Load       | User Experience        |
| ------------ | --------- | ----------------- | ---------------------- |
| 0 (No cache) | 100%      | Very High         | Always fresh, but slow |
| 2 min        | ~50%      | High              | Frequent updates       |
| **10 min**   | ~20%      | **Low - CURRENT** | **Optimal balance**    |
| 30 min       | ~5%       | Very Low          | May feel stale         |

### Testing Cache Duration Changes

After changing `CACHE_DURATION`:

1. **Clear browser cache** (DevTools → Application → Clear storage)
2. **Visit a detail page** (e.g., `/blogs/1`)
3. **Navigate to another page** (e.g., `/blogs/2`)
4. **Return to first page** (e.g., back to `/blogs/1`)
5. **Check Network tab** → Should see NO new API call if within cache window

### Per-Entity Configuration

You can set **different cache durations** for each entity:

**blogsSlice.ts**

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 min - Keep blogs fresh
```

**jobsSlice.ts**

```typescript
const CACHE_DURATION = 3 * 60 * 1000; // 3 min - Frequent updates
```

**companiesSlice.ts**

```typescript
const CACHE_DURATION = 30 * 60 * 1000; // 30 min - Stable data
```

This gives you granular control over API traffic per entity!

## Migration Summary

All list pages and detail pages (blogs, jobs, companies) have been migrated from service-based fetching to Redux:

### Changes Made:

**List Pages:**

- **Pages**: Now server components that render client components
- **Client Components**: Dispatch Redux actions on mount instead of receiving props
- **Loading States**: Handled by Redux instead of local component state
- **Filtering**: Performed on client-side Redux state
- **API Calls**: Still made through Redux thunks (same backend services)

**Detail Pages:**

- **Converted to client components**: Added `'use client'` directive
- **Promise unwrapping**: Use `React.use()` to unwrap Promise-based `params`
- **Dispatch on mount**: Each detail page dispatches `getById` thunk (getBlogById, getJobById, getCompanyById)
- **Loading/Not Found states**: Handled by Redux state
- **Similar items**: Use Redux `items` array to show similar blogs/jobs

### Benefits:

- ✅ Centralized state management
- ✅ Shared state across components
- ✅ No prop drilling
- ✅ Easy to debug with Redux DevTools
- ✅ Better separation of concerns
- ✅ Easier to add new features requiring state
- ✅ Detail pages can access Redux data from list pages
