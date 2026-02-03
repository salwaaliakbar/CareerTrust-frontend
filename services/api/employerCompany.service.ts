import { api } from "@/lib/apiClient";

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
    const response = await api.get(
      `/api/employer/company-status?employerId=${employerId}`,
    );
    return response.data;
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
    const response = await api.get(
      `/api/employer/company-profile?employerId=${employerId}`,
    );
    return response.data.company;
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
    const response = await api.post(
      `/api/employer/company-profile`,
      companyData,
    );
    return response.data;
  } catch (error: any) {
    console.error("[Company Service] Error creating profile:", error);
    throw new Error(error.message || "Failed to create company profile");
  }
}
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
    const response = await api.patch(
      `/api/employer/company-profile/${companyId}`,
      { employerId, ...updateData },
    );
    return response.data;
  } catch (error: any) {
    console.error("[Company Service] Error updating profile:", error);
    throw new Error(error.message || "Failed to update company profile");
  }
}
