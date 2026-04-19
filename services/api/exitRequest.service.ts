import { API_ENDPOINTS } from "@/constants/api";

export interface ExitRequest {
  id: number;
  employmentHistoryId: string;
  jobseekerClerkId: string;
  employerClerkId: string | null;
  company: string;
  position: string;
  requestedEndDate: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  employerNote: string | null;
  approvalFlow?: "employer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface ExitRequestWithEmployment extends ExitRequest {
  employment: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    currentlyWorking: boolean;
    jobseekerProfile: {
      clerkId: string | null;
      fullName: string | null;
      email: string | null;
      profilePicUrl: string | null;
    };
  };
}

async function getAuthHeaders(
  getToken?: () => Promise<string | null>,
): Promise<HeadersInit> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (getToken) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Submit a job exit request (jobseeker)
 */
export async function submitExitRequest(
  payload: {
    employmentHistoryId: string;
    requestedEndDate: string;
    reason?: string;
  },
  getToken?: () => Promise<string | null>,
): Promise<{ success: boolean; data?: ExitRequest; message?: string }> {
  try {
    const headers = await getAuthHeaders(getToken);
    const res = await fetch(API_ENDPOINTS.EXIT_REQUESTS_SUBMIT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Failed to submit exit request",
      };
    }
    return {
      success: true,
      data: json.data,
      message: json.message || "Exit request submitted successfully",
    };
  } catch (err) {
    console.error("submitExitRequest error:", err);
    return { success: false, message: "Network error" };
  }
}

/**
 * Get my exit requests (jobseeker)
 */
export async function getMyExitRequests(
  getToken?: () => Promise<string | null>,
): Promise<ExitRequest[]> {
  try {
    const headers = await getAuthHeaders(getToken);
    const res = await fetch(API_ENDPOINTS.EXIT_REQUESTS_MY, { headers });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

/**
 * Get exit requests for employer
 */
export async function getEmployerExitRequests(
  getToken?: () => Promise<string | null>,
): Promise<ExitRequestWithEmployment[]> {
  try {
    const headers = await getAuthHeaders(getToken);
    const res = await fetch(API_ENDPOINTS.EMPLOYER_EXIT_REQUESTS, { headers });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

/**
 * Respond to exit request (employer)
 */
export async function respondToExitRequest(
  id: number,
  status: "approved" | "rejected",
  employerNote?: string,
  getToken?: () => Promise<string | null>,
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = await getAuthHeaders(getToken);
    const res = await fetch(API_ENDPOINTS.EMPLOYER_EXIT_REQUEST_RESPOND(id), {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status, employerNote }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || "Failed" };
    }
    return { success: true };
  } catch {
    return { success: false, message: "Network error" };
  }
}
