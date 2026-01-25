const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

export interface CompanyProfile {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  description: string;
  logo: string;
  employerId: number;
}

export interface CompanyStatus {
  hasCompany: boolean;
  companyName: string | null;
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
}

/**
 * Check if employer has company profile
 */
export async function checkCompanyStatus(
  employerId: number,
): Promise<CompanyStatus> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employer/company-status?employerId=${employerId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to check company status");
    }

    const data = await response.json();
    return data.data;
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
): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employer/company-profile?employerId=${employerId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get company profile");
    }

    const data = await response.json();
    return data.data.company;
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
): Promise<CompanyProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/employer/company-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create company profile");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("[Company Service] Error creating profile:", error);
    throw error;
  }
}

/**
 * Update company profile
 */
export async function updateCompanyProfile(
  companyId: number,
  employerId: number,
  updateData: Partial<CreateCompanyRequest>,
): Promise<CompanyProfile> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employer/company-profile/${companyId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employerId, ...updateData }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update company profile");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("[Company Service] Error updating profile:", error);
    throw error;
  }
}
