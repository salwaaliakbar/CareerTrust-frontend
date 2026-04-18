import { API_ENDPOINTS } from "@/constants/api";

export interface CompanyReputation {
  companyId: number;
  companyName: string;
  reputationScore: number;
  aspectScores: {
    workLifeBalance: number;
    companyCulture: number;
    careerGrowth: number;
    salaryBenefits: number;
  };
  status: {
    totalAnonymousReviews: number;
    isStable: boolean;
    minimumReviewsForStableScore: number;
    label: "stable" | "emerging" | "insufficient-data";
    lastUpdatedAt?: string;
  };
  message: string;
}

interface ReputationApiResponse {
  success: boolean;
  data: CompanyReputation;
  message: string;
}

interface BulkReputationApiResponse {
  success: boolean;
  data: {
    reputationById: Record<string, CompanyReputation>;
  };
  message: string;
}

export async function fetchCompanyReputation(
  companyId: number,
): Promise<CompanyReputation | null> {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.COMPANY_BY_ID(companyId)}/reputation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload: ReputationApiResponse = await response.json();
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

export async function fetchCompanyReputations(
  companyIds: number[],
): Promise<Record<string, CompanyReputation>> {
  try {
    const ids = Array.from(
      new Set(companyIds.filter((id) => Number.isInteger(id) && id > 0)),
    );

    if (ids.length === 0) {
      return {};
    }

    const response = await fetch(
      `${API_ENDPOINTS.COMPANIES}/reputations?ids=${ids.join(",")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {};
    }

    const payload: BulkReputationApiResponse = await response.json();
    return payload.success ? payload.data.reputationById || {} : {};
  } catch {
    return {};
  }
}
