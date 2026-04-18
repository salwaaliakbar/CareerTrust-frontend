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
      `signup-precheck:${ip}`,
      RateLimitPresets.STRICT,
    );
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const backendResponse = await fetch(API_ENDPOINTS.USERS_PRECHECK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const responseText = await backendResponse.text();
    let data: unknown = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }
    }
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    logger.error({ error }, "BFF signup precheck failed");

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Signup precheck timed out. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { message: "Failed to complete signup precheck" },
      { status: 500 },
    );
  }
}