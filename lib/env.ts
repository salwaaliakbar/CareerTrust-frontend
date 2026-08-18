/**
 * Shared env-var accessor for the URL that points at the Node backend.
 *
 * There is exactly ONE required var: NEXT_PUBLIC_BACKEND_API_URL, the
 * backend's origin with no path suffix (e.g. https://api.example.com).
 * Everything else (the backend's /api root, the socket URL) is derived
 * from it by string concatenation — never a second env var — so there is
 * only one value to configure per deployment and no risk of the two
 * drifting out of sync.
 *
 * In production this must be explicitly set — falling back to
 * `localhost:4000` in a deployed environment means the app silently talks to
 * nothing instead of failing loudly, which is worse than a crash.
 */

function requiredUrl(value: string | undefined, name: string, devFallback: string): string {
  if (value) return value.replace(/\/+$/, "");
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

/** Node backend's `/api` root, derived from the same single base URL. */
export function getNodeApiUrl(): string {
  return `${getBackendBaseUrl()}/api`;
}

/** Socket.IO backend base URL (no /api suffix) — same origin as the backend. */
export function getSocketUrl(): string {
  return getBackendBaseUrl();
}
