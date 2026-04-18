"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface EligibleCompanyForReview {
  company: {
    id: number;
    name: string;
    industry: string;
    location: string;
    logo: string;
    description: string;
    reviewCount: number;
    isVerified: boolean;
  };
  employment: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    currentlyWorking: boolean;
    verified: boolean;
    verificationStatus: string;
  };
  existingReview: {
    id: number;
    rating: number;
    reviewText: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export async function getEligibleCompaniesForReview(
  getToken: () => Promise<string | null>,
): Promise<EligibleCompanyForReview[]> {
  const token = await getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobseeker/company-reviews/eligible-companies`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch eligible companies");
  }

  const result: ApiResponse<{ companies: EligibleCompanyForReview[] }> =
    await response.json();
  return result.data.companies;
}

export async function submitCompanyReview(
  payload: { companyId: number; rating?: number; reviewText: string },
  getToken: () => Promise<string | null>,
) {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/jobseeker/company-reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to submit company review");
  }

  return response.json();
}
