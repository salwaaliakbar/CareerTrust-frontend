import { NextResponse } from "next/server";

// Simple in-memory rate limiting (for development/single server)
// For production with multiple servers, use Redis-based solution like Upstash

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
}

/**
 * Rate limiting middleware
 * @param identifier - Unique identifier (usually userId or IP)
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limited, null if allowed
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Get or create rate limit entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return null;
  }

  // Increment count
  store[key].count++;

  // Check if rate limit exceeded
  if (store[key].count > config.maxRequests) {
    const resetIn = Math.ceil((store[key].resetTime - now) / 1000);
    return NextResponse.json(
      {
        message: "Too many requests. Please try again later.",
        retryAfter: resetIn,
      },
      {
        status: 429,
        headers: {
          "Retry-After": resetIn.toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": store[key].resetTime.toString(),
        },
      }
    );
  }

  return null;
}

// Predefined rate limit configurations
export const RateLimitPresets = {
  // Strict: For sensitive operations like job applications, payments
  STRICT: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },
  // Moderate: For general API calls like fetching data
  MODERATE: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 20 requests per minute
  },
  // Relaxed: For frequent operations like search, autocomplete
  RELAXED: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 requests per minute
  },
};
