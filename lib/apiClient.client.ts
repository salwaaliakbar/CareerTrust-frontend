"use client";

/**
 * Client-Side API Client
 * Use this ONLY in Client Components (with "use client")
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any;
}

/**
 * Client-side API call with manual token injection
 * Requires getToken function from useAuth()
 */
export async function clientApiCall<T = any>(
  endpoint: string,
  options?: RequestInit & { getToken: () => Promise<string | null> },
): Promise<ApiResponse<T>> {
  try {
    const { getToken, ...fetchOptions } = options || ({} as any);

    if (!getToken) {
      throw new Error(
        "getToken function is required for client-side API calls",
      );
    }

    const token = await getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions?.headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "API request failed",
        statusCode: response.status,
        errors: data.errors,
      } as ApiError;
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true,
    };
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw {
      message: error.message || "An unexpected error occurred",
      statusCode: error.statusCode || 500,
      errors: error.errors,
    } as ApiError;
  }
}

/**
 * Client-side convenience methods
 */
export const clientApi = {
  get: <T = any>(
    endpoint: string,
    options?: RequestInit & { getToken: () => Promise<string | null> },
  ) => clientApiCall<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit & { getToken: () => Promise<string | null> },
  ) =>
    clientApiCall<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit & { getToken: () => Promise<string | null> },
  ) =>
    clientApiCall<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit & { getToken: () => Promise<string | null> },
  ) =>
    clientApiCall<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(
    endpoint: string,
    options?: RequestInit & { getToken: () => Promise<string | null> },
  ) => clientApiCall<T>(endpoint, { ...options, method: "DELETE" }),
};

/**
 * FormData upload helper for client components
 */
export async function uploadFiles<T = any>(
  endpoint: string,
  formData: FormData,
  options: { getToken: () => Promise<string | null> },
): Promise<ApiResponse<T>> {
  try {
    const token = await options.getToken();

    const headers: HeadersInit = {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Upload failed",
        statusCode: response.status,
        errors: data.errors,
      } as ApiError;
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true,
    };
  } catch (error: any) {
    console.error(`Upload Error [${endpoint}]:`, error);
    throw {
      message: error.message || "Upload failed",
      statusCode: error.statusCode || 500,
      errors: error.errors,
    } as ApiError;
  }
}
