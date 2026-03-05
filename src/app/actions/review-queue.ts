"use server";

import { db } from "@/lib/db";
import { submissions, skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { reviewSubmissionSchema } from "@/lib/schemas";
import { sendRejectionEmail } from "@/lib/email";

// ─── Types ───────────────────────────────────────────────────────

export interface SubmissionRow {
  id: string;
  skillName: string;
  shortDescription: string;
  category: "marketing" | "engineering" | "sales";
  llmTags: string[];
  contentMd: string;
  exampleOutputText: string | null;
  exampleOutputModel: string;
  contributorName: string | null;
  contributorUrl: string | null;
  contributorBio: string | null;
  contributorEmail: string | null;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
}

export interface ReviewActionResult {
  success: boolean;
  error?: string;
}

// ─── Queries ─────────────────────────────────────────────────────

export async function getPendingSubmissions(
  secret: string,
): Promise<SubmissionRow[]> {
  if (secret !== process.env.REVIEW_SECRET) {
    return [];
  }

  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "pending"))
    .orderBy(submissions.submittedAt);

  return rows.map((r) => ({
    id: r.id,
    skillName: r.skillName,
    shortDescription: r.shortDescription,
    category: r.category as "marketing" | "engineering" | "sales",
    llmTags: r.llmTags,
    contentMd: r.contentMd,
    exampleOutputText: r.exampleOutputText,
    exampleOutputModel: r.exampleOutputModel,
    contributorName: r.contributorName,
    contributorUrl: r.contributorUrl,
    contributorBio: r.contributorBio,
    contributorEmail: r.contributorEmail,
    status: r.status as "pending" | "approved" | "rejected",
    submittedAt: r.submittedAt,
  }));
}

// ─── Actions ─────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function reviewSubmission(
  secret: string,
  submissionId: string,
  data: { status: "approved" | "rejected"; reviewerNotes?: string | null },
): Promise<ReviewActionResult> {
  // Gate check
  if (secret !== process.env.REVIEW_SECRET) {
    return { success: false, error: "Unauthorized." };
  }

  // Validate
  const parsed = reviewSubmissionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  // Fetch the submission
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submission) {
    return { success: false, error: "Submission not found." };
  }

  if (submission.status !== "pending") {
    return { success: false, error: "Submission has already been reviewed." };
  }

  try {
    if (parsed.data.status === "approved") {
      // Generate a unique slug
      const baseSlug = slugify(submission.skillName);
      let slug = baseSlug;
      let suffix = 1;

      // Check for slug collisions
      while (true) {
        const [existing] = await db
          .select({ id: skills.id })
          .from(skills)
          .where(eq(skills.slug, slug))
          .limit(1);

        if (!existing) break;
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      // Create a published skill from the submission
      await db.insert(skills).values({
        name: submission.skillName,
        slug,
        shortDescription: submission.shortDescription,
        category: submission.category,
        llmTags: submission.llmTags,
        contentMd: submission.contentMd,
        exampleOutputText: submission.exampleOutputText,
        exampleOutputModel: submission.exampleOutputModel,
        authorName: submission.contributorName ?? "Community",
        authorUrl: submission.contributorUrl,
        authorBio: submission.contributorBio,
        isExpert: !!submission.contributorName,
        status: "published",
        publishedAt: new Date(),
      });

      // Update submission status
      await db
        .update(submissions)
        .set({
          status: "approved",
          reviewerNotes: parsed.data.reviewerNotes ?? null,
          reviewedAt: new Date(),
        })
        .where(eq(submissions.id, submissionId));
    } else {
      // Reject — update status
      await db
        .update(submissions)
        .set({
          status: "rejected",
          reviewerNotes: parsed.data.reviewerNotes ?? null,
          reviewedAt: new Date(),
        })
        .where(eq(submissions.id, submissionId));

      // Send rejection email if contributor provided one
      if (submission.contributorEmail) {
        try {
          await sendRejectionEmail({
            to: submission.contributorEmail,
            skillName: submission.skillName,
          });
        } catch {
          // Email failure shouldn't block the review action
          console.error("Failed to send rejection email");
        }
      }
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
