import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export interface AuthResult {
  userId: string;
  error: NextResponse | null;
}

/**
 * Authentication middleware for API routes
 * Verifies user is authenticated via Clerk
 * @returns Object with userId and error (if any)
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: "",
      error: NextResponse.json(
        { message: "Unauthorized: User not authenticated" },
        { status: 401 }
      ),
    };
  }

  return {
    userId,
    error: null,
  };
}

/**
 * Optional authentication - returns userId if authenticated, null if not
 * Useful for endpoints that work for both authenticated and unauthenticated users
 */
export async function optionalAuth(): Promise<string | null> {
  const { userId } = await auth();
  return userId || null;
}
