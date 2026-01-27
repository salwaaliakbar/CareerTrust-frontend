import { NextRequest, NextResponse } from "next/server";
import API_ENDPOINTS from "@/constants/api";

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }
  try {
    // Replace with your backend URL
    const backendUrl = `${API_ENDPOINTS.JOB_RECOMMENDATION_STATUS}?clerkId=${clerkId}`;
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch job recommendation status" }, { status: 500 });
  }
}
