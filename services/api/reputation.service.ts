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
