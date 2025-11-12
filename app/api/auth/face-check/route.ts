import { NextResponse } from "next/server";

// Valid runtime values: 'nodejs', 'edge', 'experimental-edge'
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("/api/auth/face-check POST received");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      console.warn("No file in form data");
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Also capture and log any accompanying fields we expect (user_id, save_if_new)
    const userId = formData.get("user_id") ?? null;
    const saveIfNew = formData.get("save_if_new") ?? null;
    console.log("/api/auth/face-check received fields:", { hasFile: !!file, user_id: String(userId), save_if_new: String(saveIfNew) });

    // Rebuild FormData to forward explicitly (ensures node fetch sets boundary correctly
    // and only the intended fields are forwarded to the AI microservice).
    const forwardForm = new FormData();
    forwardForm.append("file", file as File);
    if (userId) forwardForm.append("user_id", String(userId));
    if (saveIfNew) forwardForm.append("save_if_new", String(saveIfNew));

    // Forward to your AI microservice (Python FastAPI, MobileFaceNet based)
    const aiUrl = process.env.AI_SERVICE_URL;
    if (!aiUrl) {
      console.error("AI_SERVICE_URL not configured");
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    console.log(`Forwarding face-check to AI service: ${aiUrl}`);

    // Forward the original multipart/form-data to the AI microservice so it receives
    // the `file` field the FastAPI endpoint expects. Do NOT set Content-Type header;
    // node-fetch / undici will set the multipart boundary automatically when passing FormData.
    const microserviceRes = await fetch(aiUrl, {
      method: "POST",
      // Type cast to unknown to satisfy TypeScript in this context (FormData is a web API type).
      body: forwardForm as unknown as BodyInit,
    });

    if (!microserviceRes.ok) {
      const text = await microserviceRes.text();
      console.error(`AI service responded ${microserviceRes.status}: ${text}`);
      return NextResponse.json(
        { error: "AI service error", status: microserviceRes.status, details: text },
        { status: 502 }
      );
    }

    const json = await microserviceRes.json();
    console.log("AI service returned success", json?.match ? "match:true" : "match:false");
    return NextResponse.json(json);
  } catch (err) {
    console.error("face-check error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
