import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/api";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimit, RateLimitPresets } from "@/lib/middleware/ratelimit";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const { userId, error: authError } = await requireAuth();
    if (authError) return authError;

    // 2. Apply rate limiting (20 requests per minute - moderate)
    const rateLimitError = await rateLimit(
      `dashboard-stats:${userId}`,
      RateLimitPresets.MODERATE
    );
    if (rateLimitError) return rateLimitError;

    // 3. Get clerkId from query params (optional, defaults to authenticated user)
    const searchParams = request.nextUrl.searchParams;
    const clerkId = searchParams.get('clerkId') || userId;

    // 4. Security check: users can only access their own dashboard
    if (clerkId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Cannot access other user's dashboard" },
        { status: 403 }
      );
    }

    // 5. Call backend API with server-to-server communication
    const backendResponse = await fetch(
      `${API_ENDPOINTS.BACKEND_DASHBOARD_STATS}?clerkId=${clerkId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
        },
      }
    );

    // 6. Handle backend response
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Failed to fetch dashboard stats" 
        },
        { status: backendResponse.status }
      );
    }

    // 7. Return success response to frontend
    return NextResponse.json(
      {
        success: true,
        data: data.data,
        message: data.message || "Dashboard stats retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("BFF Error - Dashboard Stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
