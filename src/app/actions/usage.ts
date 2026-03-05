"use server";

import { db } from "@/lib/db";
import { usageEvents } from "@/db/schema";

export async function trackEvent(
  skillId: string,
  eventType: "view" | "copy" | "download",
) {
  try {
    await db.insert(usageEvents).values({
      skillId,
      eventType,
    });
  } catch {
    // Silently fail — usage tracking should never break the UX
    console.error(`Failed to track ${eventType} event for skill ${skillId}`);
  }
}
