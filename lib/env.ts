/**
 * Shared env-var accessors for the URLs that point at the Node backend.
 *
 * In production these must be explicitly set — falling back to
 * `localhost:4000` in a deployed environment means the app silently talks to
 * nothing instead of failing loudly, which is worse than a crash.
 */

function requiredUrl(value: string | undefined, name: string, devFallback: string): string {
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `${name} is not set. Configure it in this deployment's environment variables.`,
    );
  }
  return devFallback;
}

/** Node backend origin, no path suffix (e.g. https://api.example.com). */
export function getBackendBaseUrl(): string {
  return requiredUrl(
    process.env.NEXT_PUBLIC_BACKEND_API_URL,
    "NEXT_PUBLIC_BACKEND_API_URL",
    "http://localhost:4000",
  );
}

/**
 * Node backend's `/api` root. Note: NEXT_PUBLIC_API_URL is also used
 * separately in constants/api.ts for this app's own internal Next.js API
 * routes (falls back to relative "/api" there, which is safe same-origin) —
 * the two usages are historically distinct despite sharing a var name.
 */
export function getNodeApiUrl(): string {
  return requiredUrl(
    process.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
    "http://localhost:4000/api",
  );
}

export function getSocketUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (backendBase) return backendBase.replace(/\/+$/, "");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    // If NEXT_PUBLIC_API_URL points to /api, strip it for socket root connection.
    return apiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SOCKET_URL (or NEXT_PUBLIC_BACKEND_API_URL/NEXT_PUBLIC_API_URL) is not set.",
    );
  }
  return "http://localhost:4000";
}
