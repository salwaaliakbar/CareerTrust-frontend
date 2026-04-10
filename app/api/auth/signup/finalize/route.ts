import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/api";
import logger from "@/lib/logger";
import { rateLimit, RateLimitPresets } from "@/lib/middleware/ratelimit";

export const runtime = "nodejs";

function getRequestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);
    const rateLimitError = await rateLimit(
      `signup-finalize:${ip}`,
      RateLimitPresets.STRICT,
    );
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const backendResponse = await fetch(API_ENDPOINTS.USERS_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    logger.error({ error }, "BFF signup finalization failed");
    return NextResponse.json(
      { message: "Failed to finalize signup" },
      { status: 500 },
    );
  }
}