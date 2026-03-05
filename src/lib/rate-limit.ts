import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

const RATE_LIMIT_WINDOW_HOURS = 24;

/**
 * Check if an IP has already reviewed a specific skill within the rate limit window.
 * Returns true if the review is allowed, false if rate-limited.
 */
export async function checkReviewRateLimit(
  skillId: string,
  ipHash: string,
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
  );

  const existing = await db
    .select({ createdAt: reviews.createdAt })
    .from(reviews)
    .where(
      and(
        eq(reviews.skillId, skillId),
        eq(reviews.reviewerIpHash, ipHash),
        gte(reviews.createdAt, windowStart),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    return { allowed: true };
  }

  const lastReview = existing[0].createdAt;
  const retryAfterMs =
    lastReview.getTime() + RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000 - Date.now();

  return {
    allowed: false,
    retryAfterMs: Math.max(0, retryAfterMs),
  };
}

/**
 * Hash an IP address for storage. Uses a simple but sufficient approach.
 * In production, consider a keyed HMAC for additional security.
 */
export async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "_commons_salt_v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
