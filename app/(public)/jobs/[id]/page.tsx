"use client";

import { useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Star,
  Clock,
  Users,
  Share2,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getJobById } from "@/src/store/slices/jobsSlice";

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const { selectedJob: job, items: allJobs, loading, lastFetchTimeById } = useAppSelector(state => state.jobs);
  
  const jobId = id; // Keep as string for comparison
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  const lastFetchTime = lastFetchTimeById?.[jobId];
  const isCached = lastFetchTime && now - lastFetchTime < CACHE_DURATION && job?.id === jobId;

  useEffect(() => {
    if (!isCached) {
      dispatch(getJobById(id));
    }
  }, [id, isCached, dispatch]);

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

  const similarJobs = allJobs.filter((j) => String(j.id) !== String(job.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-base p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 font-semibold">{job.company}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" aria-label="Save job" title="Save job" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                  <button type="button" aria-label="Share job" title="Share job" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salary</p>
                  <p className="font-semibold text-gray-900">{job.salary || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employment Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{job.experience}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900 font-semibold">{job.rating || '4.5'}</span>
                  <span className="text-gray-500">({job.reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{job.postedDaysAgo || 'Recently posted'}</span>
                </div>
              </div>
            </div>

            <div className="card-base p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">{job.description}</div>
            </div>

            <div className="card-base p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill) => (
                  <div key={skill} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">{skill}</div>
                ))}
              </div>
            </div>

            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this {job.jobType}</h2>
              <p className="text-gray-600 mb-4">Company: {job.company}</p>
              <Link href={`/companies/1`} className="text-primary hover:text-blue-900 font-semibold inline-flex items-center gap-2">View Company Profile →</Link>
            </div>
          </div>

          <div>
            <button type="button" className="w-full btn-primary mb-6">Apply for This Job</button>

            <div className="card-base p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similarJobs.map((similarJob) => (
                  <Link key={similarJob.id} href={`/jobs/${similarJob.id}`} className="block p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{similarJob.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{similarJob.company}</p>
                    <p className="text-xs text-gray-500">{similarJob.salary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
