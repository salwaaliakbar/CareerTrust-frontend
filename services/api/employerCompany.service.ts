import { useAuth } from "@clerk/nextjs";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";

export interface CompanyProfile {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  description: string;
  logo: string;
  linkedinUrl?: string;
  website?: string;
  isVerified: boolean;
  employerId: number;
  rating?: number;
  reviews?: number;
  openJobs?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployerProfileMeta {
  employerId: number;
  userId: number;
  companyName: string | null;
  companyURL: string | null;
  linkedinUrl: string | null;
  hasCompany: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerCompanyProfileDetails {
  hasCompany: boolean;
  company: CompanyProfile | null;
  employerProfile: EmployerProfileMeta | null;
  currentEmployeesCount: number;
}

export interface CurrentEmployee {
  jobseekerId: number;
  clerkId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  location: string | null;
  profilePicUrl: string | null;
  totalExperience: string | null;
  totalExperienceYears: number | null;
  employmentStatus: "open" | "not_open" | null;
  skills: string[];
  currentEmployment: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    currentlyWorking: boolean;
    verified: boolean;
    verificationStatus: string;
  } | null;
}

export interface CompanyStatus {
  hasCompany: boolean;
  companyName: string | null;
  isVerified: boolean;
  needsSetup: boolean;
}

export interface CreateCompanyRequest {
  employerId: number | string;
  name: string;
  industry: string;
  location: string;
  employees: number;
  description: string;
  logo?: string;
  linkedinUrl?: string;
  website?: string;
}

/**
 * Check if employer has company profile
 * @param clerkId - The Clerk user ID (e.g., "user_xxx")
 */
export async function checkCompanyStatus(
  clerkId: string,
  getToken: () => Promise<string | null>,
): Promise<CompanyStatus> {
  try {
    const token = await getToken();

    console.log("[Frontend] Checking company status for clerkId:", clerkId);
    console.log("[Frontend] Token available:", !!token);

    // Add timestamp to bypass all caches
    const timestamp = new Date().getTime();
    const url = `${BACKEND_BASE_URL}/api/employer/company-status?employerId=${clerkId}&_t=${timestamp}`;

    console.log("[Frontend] Calling URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    console.log("[Frontend] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to check company status: ${response.status}`);
    }

    const result = await response.json();
    // Backend returns ApiResponse format: { statusCode, data, message, success }
    console.log("[Company Service] Company status response:", result);
    return result.data || result;
  } catch (error) {
    console.error("[Company Service] Error checking status:", error);
    throw error;
  }
}

/**
 * Get employer's company profile
 */
export async function getCompanyProfile(
  employerId: number | string,
  getToken: () => Promise<string | null>,
): Promise<CompanyProfile | null> {
  try {
    const token = await getToken();
    const url = `${BACKEND_BASE_URL}/api/employer/company-profile?employerId=${employerId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to get company profile: ${response.status}`);
    }

    const result = await response.json();
    // Backend returns ApiResponse with nested company data
    return result.data?.company || result.company || null;
  } catch (error) {
    console.error("[Company Service] Error getting profile:", error);
    throw error;
  }
}

export async function getEmployerCompanyProfileDetails(
  employerIdentifier: string,
  getToken: () => Promise<string | null>,
): Promise<EmployerCompanyProfileDetails> {
  const token = await getToken();
  const url = `${BACKEND_BASE_URL}/api/employer/company-profile?employerId=${encodeURIComponent(employerIdentifier)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to get company profile: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getCurrentEmployees(
  employerIdentifier: string,
  getToken: () => Promise<string | null>,
): Promise<{
  company: { id: number; name: string } | null;
  employees: CurrentEmployee[];
}> {
  const token = await getToken();
  const url = `${BACKEND_BASE_URL}/api/employer/company-profile/current-employees?employerId=${encodeURIComponent(employerIdentifier)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to get current employees: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create company profile for employer
 */
export async function createCompanyProfile(
  companyData: CreateCompanyRequest,
  getToken: () => Promise<string | null>,
): Promise<CompanyProfile> {
  try {
    const token = await getToken();
    const url = `${BACKEND_BASE_URL}/api/employer/company-profile`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create company profile");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error: any) {
    console.error("[Company Service] Error creating profile:", error);
    throw new Error(error.message || "Failed to create company profile");
  }
}

/**
 * Update company profile
 */
export async function updateCompanyProfile(
  companyId: number,
  employerId: number | string,
  updateData: Partial<CreateCompanyRequest>,
  getToken: () => Promise<string | null>,
): Promise<CompanyProfile> {
  try {
    const token = await getToken();
    const url = `${BACKEND_BASE_URL}/api/employer/company-profile/${companyId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ employerId, ...updateData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update company profile");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error: any) {
    console.error("[Company Service] Error updating profile:", error);
    throw new Error(error.message || "Failed to update company profile");
  }
}
