import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { API_ENDPOINTS } from "@/constants/api";

export async function GET() {
  try {
    console.log("[API] Starting GET request for user applications");
    
    // 1. Verify user is authenticated
    const authResult = await requireAuth();
    console.log("[API] Auth result:", authResult);
    
    const { userId: clerkId, error: authError } = authResult;
    
    if (authError) {
      console.error("[API] Auth error:", authError);
      return authError;
    }

    if (!clerkId) {
      console.error("[API] No clerkId found after auth");
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    console.log("[API] Fetching applications for clerkId:", clerkId);

    // 2. Fetch user's applications from backend
    const backendUrl = API_ENDPOINTS.USER_APPLICATIONS_BACKEND(clerkId);
    console.log("[API] Backend URL:", backendUrl);
    
    let backendResponse;
    try {
      backendResponse = await fetch(
        backendUrl,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
          },
        }
      );
    } catch (fetchError) {
      console.error("[API] Fetch error:", fetchError);
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to connect to backend",
          error: fetchError instanceof Error ? fetchError.message : "Unknown error"
        },
        { status: 503 }
      );
    }

    console.log("[API] Backend response status:", backendResponse.status);

    // Handle 404 - endpoint doesn't exist yet, return empty array
    if (backendResponse.status === 404) {
      console.warn("[API] Backend endpoint not found (404) - returning empty applications list");
      console.warn("[API] Please create the backend endpoint: GET /api/jobseeker/:clerkId/applications");
      return NextResponse.json(
        {
          success: true,
          data: [],
          total: 0,
          message: "Backend endpoint not implemented yet"
        },
        { status: 200 }
      );
    }

    // 3. Handle backend response
    let data;
    try {
      const contentType = backendResponse.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        console.error("[API] Backend returned non-JSON response, content-type:", contentType);
        return NextResponse.json(
          { 
            success: true, 
            data: [], 
            total: 0,
            message: "Backend endpoint not implemented correctly" 
          },
          { status: 200 }
        );
      }

      data = await backendResponse.json();
      console.log("[API] Backend response data:", JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error("[API] Failed to parse JSON response:", jsonError);
      return NextResponse.json(
        { 
          success: true, 
          data: [], 
          total: 0,
          message: "Invalid backend response" 
        },
        { status: 200 }
      );
    }

    if (!backendResponse.ok) {
      console.error("[API] Backend returned error:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch applications" },
        { status: backendResponse.status }
      );
    }

    // 4. Extract job IDs from applications
    const appliedJobIds = data.data ? data.data.map((app: { jobId: string | number }) => app.jobId) : [];
    console.log("[API] Extracted applied job IDs:", appliedJobIds);

    // 5. Return success response with applied job IDs
    return NextResponse.json(
      {
        success: true,
        data: appliedJobIds,
        total: appliedJobIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Unexpected error - Get User Applications:", error);
    console.error("[API] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
