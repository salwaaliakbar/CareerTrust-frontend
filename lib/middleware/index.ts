/**
 * Middleware utilities for Next.js API routes
 * 
 * This module provides reusable middleware for:
 * - Authentication (Clerk)
 * - Rate limiting
 */

export { requireAuth, optionalAuth } from "./auth";
export { rateLimit, RateLimitPresets } from "./ratelimit";
export type { AuthResult } from "./auth";
export type { RateLimitConfig } from "./ratelimit";
