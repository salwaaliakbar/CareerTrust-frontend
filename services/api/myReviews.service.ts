export interface JobseekerReview {
  id: number;
  company: {
    id: number;
    name: string;
    logo: string;
    industry: string;
    location: string;
  };
  employment: {
    position: string;
    startDate: string;
    endDate: string | null;
  };
  reviewText: string;
  rating: number;
  sentimentScores: {
    overall: number;
    aspects: {
      workLifeBalance: number;
      companyCulture: number;
      careerGrowth: number;
      salaryBenefits: number;
    };
    analyzedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MyReviewsResponse {
  reviews: JobseekerReview[];
  count: number;
}

export const fetchMyReviews = async (
  getToken: () => Promise<string | null>,
): Promise<JobseekerReview[]> => {
  const token = await getToken();

  const response = await fetch("/api/jobseeker/company-reviews/my-reviews", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Failed to fetch reviews: ${response.status}`,
    );
  }

  const data = (await response.json()) as { data: MyReviewsResponse };
  return data.data.reviews;
};
