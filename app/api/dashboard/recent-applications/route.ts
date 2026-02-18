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
      `dashboard-apps:${userId}`,
      RateLimitPresets.MODERATE
    );
    if (rateLimitError) return rateLimitError;

    // 3. Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const clerkId = searchParams.get('clerkId') || userId;
    const limit = searchParams.get('limit') || '5';

    // 4. Security check: users can only access their own applications
    if (clerkId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Cannot access other user's applications" },
        { status: 403 }
      );
    }

    // 5. Validate limit parameter
    const limitNum = Math.min(parseInt(limit, 10), 20);
    if (isNaN(limitNum) || limitNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid limit parameter" },
        { status: 400 }
      );
    }

    // 6. Call backend API with server-to-server communication
    const backendResponse = await fetch(
      `${API_ENDPOINTS.BACKEND_DASHBOARD_RECENT_APPLICATIONS}?clerkId=${clerkId}&limit=${limitNum}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
        },
      }
    );

    // 7. Handle backend response
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          success: false,
          message: data.message || "Failed to fetch recent applications" 
        },
        { status: backendResponse.status }
      );
    }

    // 8. Return success response to frontend
    return NextResponse.json(
      {
        success: true,
        data: data.data,
        message: data.message || "Recent applications retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("BFF Error - Recent Applications:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
