import { API_ENDPOINTS } from "@/constants/api";

/**
 * Submit offer response (accept or decline)
 */
export async function submitOfferResponse(
  applicationId: number,
  response: "accept" | "decline",
  message?: string,
  getToken?: () => Promise<string | null>,
): Promise<boolean> {
  try {
    const url = API_ENDPOINTS.APPLICATION_OFFER_RESPONSE(applicationId);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (getToken) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        response,
        message,
      }),
    });

    if (!res.ok) {
      console.error("Failed to submit offer response:", await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error submitting offer response:", error);
    return false;
  }
}

const offerService = {
  submitOfferResponse,
};

export default offerService;
