import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/middleware/ratelimit";

// Valid runtime values: 'nodejs', 'edge', 'experimental-edge'
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Apply rate limiting by IP (no auth required - this is signup flow)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const rateLimitError = await rateLimit(
      `face-check:${ip}`,
      RateLimitPresets.STRICT
    );
    if (rateLimitError) return rateLimitError;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      logger.error("No file provided in face-check request");
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Accept only a backend-issued registration session identifier.
    const registrationId = formData.get("registrationId") ?? null;
    logger.info("/api/auth/face-check received fields:", {
      hasFile: !!file,
      registrationId: String(registrationId),
    });

    if (!registrationId) {
      return NextResponse.json(
        { error: "registrationId is required" },
        { status: 400 },
      );
    }

    // Rebuild FormData and forward only to the Node backend.
    const forwardForm = new FormData();
    forwardForm.append("file", file as File);
    forwardForm.append("registrationId", String(registrationId));

    logger.info(`Forwarding face-check to backend: ${API_ENDPOINTS.USERS_FACE_CHECK}`);
    const backendRes = await fetch(API_ENDPOINTS.USERS_FACE_CHECK, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BACKEND_API_KEY || ""}`,
      },
      body: forwardForm as unknown as BodyInit,
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      logger.error(`Backend face-check responded ${backendRes.status}: ${text}`);
      return NextResponse.json(
        {
          error: "Backend face-check error",
          status: backendRes.status,
          details: text,
        },
        { status: backendRes.status },
      );
    }

    const json = await backendRes.json();
    logger.info(
      "Backend face-check returned success",
      json?.match ? "match:true" : "match:false",
    );
    return NextResponse.json(json);
  } catch (err) {
    logger.error("face-check error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
