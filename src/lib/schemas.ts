import { z } from "zod";

// ─── Shared Enums ────────────────────────────────────────────────
export const categoryValues = ["marketing", "engineering", "sales"] as const;
export const skillStatusValues = ["draft", "published"] as const;
export const submissionStatusValues = [
  "pending",
  "approved",
  "rejected",
] as const;
export const usageEventTypeValues = ["view", "copy", "download"] as const;

export const categorySchema = z.enum(categoryValues);
export const skillStatusSchema = z.enum(skillStatusValues);
export const submissionStatusSchema = z.enum(submissionStatusValues);
export const usageEventTypeSchema = z.enum(usageEventTypeValues);

// ─── Skills ──────────────────────────────────────────────────────

export const createSkillSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500),
  contentMd: z.string().min(1, "Content is required"),
  category: categorySchema,
  llmTags: z.array(z.string().min(1).max(50)).default([]),
  authorName: z.string().min(1, "Author name is required").max(100),
  authorUrl: z.string().url("Must be a valid URL").nullish(),
  authorBio: z.string().max(500).nullish(),
  exampleOutputText: z.string().nullish(),
  exampleOutputImageUrl: z.string().url("Must be a valid URL").nullish(),
  exampleOutputModel: z.string().min(1, "Example output model is required"),
  isExpert: z.boolean().default(false),
  status: skillStatusSchema.default("draft"),
  reviewerNotes: z.string().nullish(),
});

export const updateSkillSchema = createSkillSchema.partial().extend({
  publishedAt: z.coerce.date().nullish(),
});

// ─── Reviews ─────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID"),
  starRating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  reviewText: z
    .string()
    .min(1, "Review text is required")
    .max(2000, "Review text must be under 2000 characters"),
  reviewerIpHash: z.string().min(1),
  sessionId: z.string().min(1),
});

// ─── Submissions ─────────────────────────────────────────────────

export const createSubmissionSchema = z.object({
  skillName: z.string().min(1, "Skill name is required").max(200),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500),
  category: categorySchema,
  llmTags: z.array(z.string().min(1).max(50)).default([]),
  contentMd: z.string().min(1, "Content is required"),
  exampleOutputText: z.string().nullish(),
  exampleOutputImageUrl: z.string().url("Must be a valid URL").nullish(),
  exampleOutputModel: z.string().min(1, "Example output model is required"),
  contributorName: z.string().max(100).nullish(),
  contributorUrl: z.string().url("Must be a valid URL").nullish(),
  contributorBio: z.string().max(500).nullish(),
  contributorEmail: z.string().email("Must be a valid email").nullish(),
});

export const reviewSubmissionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reviewerNotes: z.string().nullish(),
});

// ─── Usage Events ────────────────────────────────────────────────

export const createUsageEventSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID"),
  eventType: usageEventTypeSchema,
});

// ─── Query Helpers ───────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const skillFiltersSchema = z.object({
  category: categorySchema.optional(),
  search: z.string().max(200).optional(),
  status: skillStatusSchema.optional(),
});

// ─── Inferred Types ──────────────────────────────────────────────

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
export type CreateUsageEventInput = z.infer<typeof createUsageEventSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SkillFiltersInput = z.infer<typeof skillFiltersSchema>;

export type Category = z.infer<typeof categorySchema>;
export type SkillStatus = z.infer<typeof skillStatusSchema>;
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;
export type UsageEventType = z.infer<typeof usageEventTypeSchema>;
