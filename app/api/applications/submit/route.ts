import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/api";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimit, RateLimitPresets } from "@/lib/middleware/ratelimit";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const { userId, error: authError } = await requireAuth();
    if (authError) return authError;

    // 2. Apply rate limiting (5 applications per minute)
    const rateLimitError = await rateLimit(
      `apply:${userId}`,
      RateLimitPresets.STRICT
    );
    if (rateLimitError) return rateLimitError;

    // 3. Parse request body
    const body = await request.json();
    const { jobId } = body;

    // 4. Validate required fields
    if (!jobId) {
      return NextResponse.json(
        { message: "Missing required field: jobId" },
        { status: 400 }
      );
    }

    // 5. Call backend API with server-to-server communication
    const backendResponse = await fetch(
      `${API_ENDPOINTS.APPLICATION_SUBMIT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
        },
        body: JSON.stringify({
          clerkId: userId,
          jobId: jobId,
        }),
      }
    );

    // 6. Handle backend response
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to submit application" },
        { status: backendResponse.status }
      );
    }

    // 7. Return success response to frontend
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BFF Error - Submit Application:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
