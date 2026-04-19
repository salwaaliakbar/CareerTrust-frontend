import { API_ENDPOINTS } from "@/constants/api";
import {
  ContactFormPayload,
  ContactSubmissionResult,
} from "@/types/contact.types";

type ApiSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: "pending" | "replied";
    isRead: boolean;
  };
};

type ApiErrorResponse = {
  message?: string;
  errors?: string[];
};

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<ContactSubmissionResult> {
  const response = await fetch(API_ENDPOINTS.CONTACT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorPayload = raw as ApiErrorResponse;
    throw new Error(
      errorPayload.message ||
        errorPayload.errors?.[0] ||
        "Failed to send message. Please try again.",
    );
  }

  const data = raw as ApiSuccessResponse;

  return {
    id: data.data.id,
    status: data.data.status,
    isRead: data.data.isRead,
    message:
      data.message ||
      "Your message has been sent successfully. Please check your email for confirmation.",
  };
}
