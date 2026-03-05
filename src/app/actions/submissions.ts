"use server";

import { db } from "@/lib/db";
import { submissions } from "@/db/schema";
import { createSubmissionSchema } from "@/lib/schemas";

export interface SubmissionActionResult {
  success: boolean;
  error?: string;
}

export async function submitSkill(formData: {
  skillName: string;
  shortDescription: string;
  category: "marketing" | "engineering" | "sales";
  llmTags: string[];
  contentMd: string;
  exampleOutputText: string;
  exampleOutputModel: string;
  contributorName?: string;
  contributorUrl?: string;
  contributorBio?: string;
  contributorEmail?: string;
  honeypot?: string;
}): Promise<SubmissionActionResult> {
  // Honeypot check — bots fill hidden fields
  if (formData.honeypot) {
    // Pretend success to not tip off bots
    return { success: true };
  }

  // Validate input
  const parsed = createSubmissionSchema.safeParse({
    skillName: formData.skillName,
    shortDescription: formData.shortDescription,
    category: formData.category,
    llmTags: formData.llmTags,
    contentMd: formData.contentMd,
    exampleOutputText: formData.exampleOutputText || undefined,
    exampleOutputModel: formData.exampleOutputModel,
    contributorName: formData.contributorName || undefined,
    contributorUrl: formData.contributorUrl || undefined,
    contributorBio: formData.contributorBio || undefined,
    contributorEmail: formData.contributorEmail || undefined,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "Invalid input. Please check your submission.",
    };
  }

  try {
    await db.insert(submissions).values({
      skillName: parsed.data.skillName,
      shortDescription: parsed.data.shortDescription,
      category: parsed.data.category,
      llmTags: parsed.data.llmTags,
      contentMd: parsed.data.contentMd,
      exampleOutputText: parsed.data.exampleOutputText ?? null,
      exampleOutputModel: parsed.data.exampleOutputModel,
      contributorName: parsed.data.contributorName ?? null,
      contributorUrl: parsed.data.contributorUrl ?? null,
      contributorBio: parsed.data.contributorBio ?? null,
      contributorEmail: parsed.data.contributorEmail ?? null,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
