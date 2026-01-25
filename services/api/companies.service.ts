import { API_ENDPOINTS } from "@/constants/api";
import {
  Company,
  CompaniesResponse,
  CompanyResponse,
  UpdateCompanyRequest,
  CompanyFormData,
} from "@/types/company.types";

interface CompanyDetailResponse {
  success: boolean;
  data: Company;
  error?: string;
}

/**
 * Get server-side fetch URL with fallback to 127.0.0.1 if localhost fails
 */
function getServerFetchUrl(url: string): string {
  // On server-side, try using 127.0.0.1 instead of localhost
  if (typeof window === "undefined") {
    // We're on the server
    return url.replace("http://localhost:", "http://127.0.0.1:");
  }
  return url;
}

/**
 * Fetch all companies
 * @param industry - Optional industry filter
 * @param featured - Optional featured filter
 */
export async function fetchCompanies(
  industry?: string,
  featured?: boolean,
): Promise<Company[]> {
  try {
    let url = API_ENDPOINTS.COMPANIES;

    const params = new URLSearchParams();
    if (industry) params.append("industry", industry);
    if (featured !== undefined) params.append("featured", String(featured));

    if (params.toString()) {
      url += "?" + params.toString();
    }

    url = getServerFetchUrl(url);
    console.log("[Company Service] Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log(
      "[Company Service] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error(
        `[Company Service] Failed to fetch. Status: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data: CompaniesResponse = await response.json();

    if (!data.success) {
      console.warn("[Company Service] API returned success: false", data.error);
      return [];
    }

    console.log(
      "[Company Service] Successfully fetched companies:",
      data.data.length,
    );
    return data.data;
  } catch (error) {
    console.error("[Company Service] Error fetching companies:", error);
    return [];
  }
}

/**
 * Fetch featured companies
 */
export async function fetchFeaturedCompanies(): Promise<Company[]> {
  try {
    let url = `${API_ENDPOINTS.COMPANIES}/featured`;
    url = getServerFetchUrl(url);

    console.log("[Company Service] Fetching featured companies from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log(
      "[Company Service] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error(
        `[Company Service] Failed to fetch featured companies. Status: ${response.status}`,
      );
      return [];
    }

    const data: CompaniesResponse = await response.json();

    if (!data.success) {
      console.warn("[Company Service] API returned success: false", data.error);
      return [];
    }

    console.log(
      "[Company Service] Successfully fetched featured companies:",
      data.data.length,
    );
    return data.data;
  } catch (error) {
    console.error(
      "[Company Service] Error fetching featured companies:",
      error,
    );
    return [];
  }
}

/**
 * Fetch company by ID
 * @param id - Company ID
 */
export async function fetchCompanyById(
  id: string | number,
): Promise<Company | null> {
  try {
    let url = `${API_ENDPOINTS.COMPANIES}/${id}`;
    url = getServerFetchUrl(url);

    console.log("[Company Service] Fetching company by ID:", id);
    console.log("[Company Service] Full URL:", url);
    console.log(
      "[Company Service] API_ENDPOINTS.COMPANIES:",
      API_ENDPOINTS.COMPANIES,
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("[Company Service] Response status:", response.status);
    console.log("[Company Service] Response headers:", response.headers);

    if (!response.ok) {
      const responseText = await response.text();
      console.error(
        `[Company Service] Failed fetch. Status: ${response.status}, Body:`,
        responseText,
      );

      if (response.status === 404) {
        console.warn(`[Company Service] Company not found (ID: ${id})`);
      } else {
        console.error(`[Company Service] Server error`);
      }
      return null;
    }

    const data: CompanyDetailResponse = await response.json();

    if (!data.success) {
      console.warn("[Company Service] API returned success: false", data.error);
      return null;
    }

    console.log(
      "[Company Service] Successfully fetched company:",
      data.data.id,
    );
    return data.data;
  } catch (error) {
    console.error("[Company Service] Error fetching company by ID:", error);
    console.error(
      "[Company Service] Error stack:",
      error instanceof Error ? error.stack : "N/A",
    );
    return null;
  }
}

/**
 * Create new company (for future use)
 * @param companyData - Company data
 */
export async function createCompany(
  companyData: Partial<Company>,
): Promise<Company> {
  try {
    const url = API_ENDPOINTS.COMPANIES;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create company: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create company");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

/**
 * Update company details
 * @param companyId - Company ID
 * @param updateData - Updated company data
 */
export async function updateCompany(
  companyId: string | number,
  updateData: Partial<CompanyFormData>,
): Promise<Company | null> {
  try {
    const BACKEND_BASE_URL =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
    const url = `${BACKEND_BASE_URL}/api/companies/${companyId}`;

    console.log("[Company Service] Updating company:", companyId);
    console.log("[Company Service] Update data:", updateData);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log("[Company Service] Response status:", response.status);

    if (!response.ok) {
      console.error(
        `[Company Service] Failed to update company. Status: ${response.status}`,
      );
      return null;
    }

    const data: CompanyResponse = await response.json();

    if (!data.success) {
      console.warn("[Company Service] API returned success: false", data.error);
      return null;
    }

    console.log("[Company Service] Successfully updated company");
    return data.data;
  } catch (error) {
    console.error("[Company Service] Error updating company:", error);
    return null;
  }
}
