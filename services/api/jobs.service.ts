import { API_ENDPOINTS } from '@/constants/api';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  experience: string;
  skills: string[];
  postedDate: string;
  deadline?: string;
  image?: string;
  featured: boolean;
  description: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  total: number;
  error?: string;
}

interface JobDetailResponse {
  success: boolean;
  data: Job;
  error?: string;
}

/**
 * Fetch all jobs
 * @param jobType - Optional job type filter
 * @param featured - Optional featured filter
 */
export async function fetchJobs(jobType?: string, featured?: boolean): Promise<Job[]> {
  try {
    let url = API_ENDPOINTS.JOBS;

    const params = new URLSearchParams();
    if (jobType) params.append('jobType', jobType);
    if (featured !== undefined) params.append('featured', String(featured));

    if (params.toString()) {
      url += '?' + params.toString();
    }

    console.log('[Job Service] Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Job Service] Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`[Job Service] Failed to fetch. Status: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: JobsResponse = await response.json();

    if (!data.success) {
      console.warn('[Job Service] API returned success: false', data.error);
      return [];
    }

    console.log('[Job Service] Successfully fetched jobs:', data.data.length);
    return data.data;
  } catch (error) {
    console.error('[Job Service] Error fetching jobs:', error);
    return [];
  }
}

/**
 * Fetch featured jobs
 */
export async function fetchFeaturedJobs(): Promise<Job[]> {
  try {
    const url = `${API_ENDPOINTS.JOBS}/featured`;

    console.log('[Job Service] Fetching featured jobs from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Job Service] Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error(`[Job Service] Failed to fetch featured jobs. Status: ${response.status}`);
      return [];
    }

    const data: JobsResponse = await response.json();

    if (!data.success) {
      console.warn('[Job Service] API returned success: false', data.error);
      return [];
    }

    console.log('[Job Service] Successfully fetched featured jobs:', data.data.length);
    return data.data;
  } catch (error) {
    console.error('[Job Service] Error fetching featured jobs:', error);
    return [];
  }
}

/**
 * Fetch job by ID
 * @param id - Job ID
 */
export async function fetchJobById(id: string | number): Promise<Job | null> {
  try {
    const url = `${API_ENDPOINTS.JOBS}/${id}`;

    console.log('[Job Service] Fetching job by ID:', id, 'URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Job Service] Response status:', response.status);

    if (!response.ok) {
      console.error(`[Job Service] Job not found. Status: ${response.status}`);
      return null;
    }

    const data: JobDetailResponse = await response.json();

    if (!data.success) {
      console.warn('[Job Service] API returned success: false', data.error);
      return null;
    }

    console.log('[Job Service] Successfully fetched job:', data.data.id);
    return data.data;
  } catch (error) {
    console.error('[Job Service] Error fetching job by ID:', error);
    return null;
  }
}

/**
 * Create new job (for future use)
 * @param jobData - Job data
 */
export async function createJob(jobData: Partial<Job>): Promise<Job> {
  try {
    const url = API_ENDPOINTS.JOBS;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create job');
    }

    return data.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}
