import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  logger.info("[/api/resume/parse-resume] POST request received");
  
  try {
    const form = await req.formData();
    const file = form.get("resume") as File | null;
    const fullName = form.get("fullName") as string | null;
    const email = form.get("email") as string | null;

    logger.info("[/api/resume/parse-resume] Form data extracted:", {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      fullName: fullName ? "provided" : "missing",
      email: email ? "provided" : "missing",
    });

    if (!file || !fullName || !email) {
      logger.warn("[/api/resume/parse-resume] Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || "application/octet-stream" });
    const forwardForm = new FormData();
    forwardForm.append("resume", blob, file.name);
    forwardForm.append("fullName", fullName);
    forwardForm.append("email", email);

    // Forward to Node backend (SSOT)
    const backendUrl = `${API_ENDPOINTS.RESUME_PARSING}`;
    const response = await axios.post(
        backendUrl,
        forwardForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

    logger.info("[/api/resume/parse-resume] Backend response received:", {
      status: response.status,
      dataKeys: Object.keys(response.data),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    logger.error("[/api/resume/parse-resume] Error occurred:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      type: err instanceof Error ? err.constructor.name : typeof err,
    });
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
