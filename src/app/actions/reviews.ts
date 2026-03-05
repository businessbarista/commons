"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema";
import { createReviewSchema } from "@/lib/schemas";
import { checkReviewRateLimit, hashIp } from "@/lib/rate-limit";
import { checkProfanity } from "@/lib/profanity-filter";

export interface ReviewActionResult {
  success: boolean;
  error?: string;
}

export async function submitReview(formData: {
  skillId: string;
  starRating: number;
  reviewText: string;
  sessionId: string;
}): Promise<ReviewActionResult> {
  // Get and hash IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";
  const ipHash = await hashIp(ip);

  // Validate input
  const parsed = createReviewSchema.safeParse({
    ...formData,
    reviewerIpHash: ipHash,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "Invalid input",
    };
  }

  // Check rate limit
  const rateCheck = await checkReviewRateLimit(formData.skillId, ipHash);
  if (!rateCheck.allowed) {
    const hours = Math.ceil((rateCheck.retryAfterMs ?? 0) / (1000 * 60 * 60));
    return {
      success: false,
      error: `You've already reviewed this skill. Try again in ~${hours} hour${hours !== 1 ? "s" : ""}.`,
    };
  }

  // Check profanity/spam
  const profanityCheck = checkProfanity(formData.reviewText);
  if (!profanityCheck.clean) {
    return {
      success: false,
      error: profanityCheck.reason ?? "Review contains inappropriate content.",
    };
  }

  // Insert review
  try {
    await db.insert(reviews).values({
      skillId: formData.skillId,
      starRating: formData.starRating,
      reviewText: formData.reviewText,
      reviewerIpHash: ipHash,
      sessionId: formData.sessionId,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
