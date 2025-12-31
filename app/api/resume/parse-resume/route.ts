import logger from "@/lib/logger";
import { NextResponse } from "next/server";

// Valid runtime values: 'nodejs', 'edge', 'experimental-edge'
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const parserUrl = process.env.AI_SERVICE_BASE_URL
      ? new URL("/parse-resume", process.env.AI_SERVICE_BASE_URL).toString()
      : null;
    if (!parserUrl) {
      return NextResponse.json(
        { error: "AI_SERVICE_BASE_URL not configured" },
        { status: 500 }
      );
    }

    // Parse incoming multipart form-data
    const form = await req.formData();
    const file = form.get("resume") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Resume file not found" },
        { status: 400 }
      );
    }

    const fullName = form.get("fullName") as string | null;
    if(!fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    const email = form.get("email") as string | null;
    if(!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Convert web File to a Blob/FormData we can forward
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: file.type || "application/octet-stream",
    });
    const forwardForm = new FormData();
    // use same field name 'file' so downstream parser receives it
    // Use the File.name directly (avoid `any`st) and fallback to a default filename.
    forwardForm.append("file", blob, file?.name ?? "resume-upload");
    forwardForm.append("fullName", fullName);
    forwardForm.append("email", email);

    // Forward the request to the external AI parser
    const forwardedRes = await fetch(parserUrl, {
      method: "POST",
      headers: {
        "x-api-key": process.env.AI_API_KEY!,
      },
      body: forwardForm,
    });

    const contentType =
      forwardedRes.headers.get("content-type") || "application/json";

    // If the parser returned non-OK, forward the message
    if (!forwardedRes.ok) {
      const data = await forwardedRes.json();
      return new Response(data, {
        status: forwardedRes.status,
        headers: { "content-type": contentType },
      });
    }

    // Successful parse: return the parser response (JSON expected)
    const data = await forwardedRes.json();
    return NextResponse.json(data, { status: forwardedRes.status });
  } catch (err) {
    // Log server-side error and return generic message
    logger.error("/api/resume/parse-resume error:", err);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
