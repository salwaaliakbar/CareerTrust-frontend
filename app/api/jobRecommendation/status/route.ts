import { NextRequest, NextResponse } from "next/server";
import API_ENDPOINTS from "@/constants/api";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimit, RateLimitPresets } from "@/lib/middleware/ratelimit";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const { userId, error: authError } = await requireAuth();
    if (authError) return authError;

    // 2. Apply rate limiting (relaxed for status checks)
    const rateLimitError = await rateLimit(
      `job-rec-status:${userId}`,
      RateLimitPresets.RELAXED
    );
    if (rateLimitError) return rateLimitError;

    const clerkId = req.nextUrl.searchParams.get("clerkId");
    
    // 3. Validate clerkId matches authenticated user
    if (!clerkId || clerkId !== userId) {
      return NextResponse.json(
        { error: "Invalid or missing clerkId" },
        { status: 400 }
      );
    }
    // Replace with your backend URL
    const backendUrl = `${API_ENDPOINTS.JOB_RECOMMENDATION_STATUS}?clerkId=${clerkId}`;
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch job recommendation status" }, { status: 500 });
  }
}
