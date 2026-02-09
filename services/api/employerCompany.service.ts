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
  isVerified: boolean;
  employerId: number;
}

export interface CompanyStatus {
  hasCompany: boolean;
  companyName: string | null;
  isVerified: boolean;
  needsSetup: boolean;
}

export interface CreateCompanyRequest {
  employerId: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  description: string;
  logo?: string;
  linkedinUrl?: string;
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
  employerId: number,
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
  employerId: number,
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
