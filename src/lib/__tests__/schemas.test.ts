import { describe, expect, it } from "vitest";
import {
  createSkillSchema,
  updateSkillSchema,
  createReviewSchema,
  createSubmissionSchema,
  reviewSubmissionSchema,
  createUsageEventSchema,
  paginationSchema,
  skillFiltersSchema,
  categorySchema,
  skillStatusSchema,
  submissionStatusSchema,
  usageEventTypeSchema,
} from "../schemas";

// ─── Enum Schemas ────────────────────────────────────────────────

describe("categorySchema", () => {
  it("accepts valid categories", () => {
    expect(categorySchema.parse("marketing")).toBe("marketing");
    expect(categorySchema.parse("engineering")).toBe("engineering");
    expect(categorySchema.parse("sales")).toBe("sales");
  });

  it("rejects invalid categories", () => {
    expect(() => categorySchema.parse("design")).toThrow();
    expect(() => categorySchema.parse("")).toThrow();
  });
});

describe("skillStatusSchema", () => {
  it("accepts valid statuses", () => {
    expect(skillStatusSchema.parse("draft")).toBe("draft");
    expect(skillStatusSchema.parse("published")).toBe("published");
  });

  it("rejects invalid statuses", () => {
    expect(() => skillStatusSchema.parse("archived")).toThrow();
  });
});

describe("submissionStatusSchema", () => {
  it("accepts valid statuses", () => {
    expect(submissionStatusSchema.parse("pending")).toBe("pending");
    expect(submissionStatusSchema.parse("approved")).toBe("approved");
    expect(submissionStatusSchema.parse("rejected")).toBe("rejected");
  });

  it("rejects invalid statuses", () => {
    expect(() => submissionStatusSchema.parse("review")).toThrow();
  });
});

describe("usageEventTypeSchema", () => {
  it("accepts valid event types", () => {
    expect(usageEventTypeSchema.parse("view")).toBe("view");
    expect(usageEventTypeSchema.parse("copy")).toBe("copy");
    expect(usageEventTypeSchema.parse("download")).toBe("download");
  });

  it("rejects invalid event types", () => {
    expect(() => usageEventTypeSchema.parse("share")).toThrow();
  });
});

// ─── createSkillSchema ──────────────────────────────────────────

describe("createSkillSchema", () => {
  const validSkill = {
    name: "Email Drafter",
    slug: "email-drafter",
    shortDescription: "Draft professional emails quickly",
    contentMd: "# Email Drafter\n\nHelps you draft emails.",
    category: "marketing" as const,
    authorName: "Alex Lieberman",
    exampleOutputModel: "Claude 3.5 Sonnet",
  };

  it("accepts a valid skill with required fields only", () => {
    const result = createSkillSchema.parse(validSkill);
    expect(result.name).toBe("Email Drafter");
    expect(result.slug).toBe("email-drafter");
    expect(result.llmTags).toEqual([]);
    expect(result.isExpert).toBe(false);
    expect(result.status).toBe("draft");
  });

  it("accepts a valid skill with all optional fields", () => {
    const result = createSkillSchema.parse({
      ...validSkill,
      llmTags: ["email", "writing"],
      authorUrl: "https://example.com",
      authorBio: "Founder of Morning Brew",
      exampleOutputText: "Dear hiring manager...",
      exampleOutputImageUrl: "https://example.com/image.png",
      isExpert: true,
      status: "published" as const,
      reviewerNotes: "Looks great",
    });
    expect(result.llmTags).toEqual(["email", "writing"]);
    expect(result.isExpert).toBe(true);
    expect(result.status).toBe("published");
  });

  it("rejects empty name", () => {
    expect(() =>
      createSkillSchema.parse({ ...validSkill, name: "" }),
    ).toThrow();
  });

  it("rejects invalid slug format", () => {
    expect(() =>
      createSkillSchema.parse({ ...validSkill, slug: "Invalid Slug!" }),
    ).toThrow();
    expect(() =>
      createSkillSchema.parse({ ...validSkill, slug: "UPPERCASE" }),
    ).toThrow();
    expect(() =>
      createSkillSchema.parse({ ...validSkill, slug: "has spaces" }),
    ).toThrow();
  });

  it("accepts valid slug formats", () => {
    expect(
      createSkillSchema.parse({ ...validSkill, slug: "simple" }).slug,
    ).toBe("simple");
    expect(
      createSkillSchema.parse({ ...validSkill, slug: "multi-word-slug" }).slug,
    ).toBe("multi-word-slug");
    expect(
      createSkillSchema.parse({ ...validSkill, slug: "with-123-numbers" }).slug,
    ).toBe("with-123-numbers");
  });

  it("rejects invalid authorUrl", () => {
    expect(() =>
      createSkillSchema.parse({ ...validSkill, authorUrl: "not-a-url" }),
    ).toThrow();
  });

  it("rejects invalid category", () => {
    expect(() =>
      createSkillSchema.parse({ ...validSkill, category: "design" }),
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => createSkillSchema.parse({})).toThrow();
    expect(() =>
      createSkillSchema.parse({ name: "Test" }),
    ).toThrow();
  });
});

// ─── updateSkillSchema ──────────────────────────────────────────

describe("updateSkillSchema", () => {
  it("accepts partial updates", () => {
    const result = updateSkillSchema.parse({ name: "Updated Name" });
    expect(result.name).toBe("Updated Name");
  });

  it("accepts publishedAt as a date string", () => {
    const result = updateSkillSchema.parse({
      publishedAt: "2025-01-15T00:00:00Z",
    });
    expect(result.publishedAt).toBeInstanceOf(Date);
  });

  it("accepts an empty object", () => {
    const result = updateSkillSchema.parse({});
    expect(result).toBeDefined();
  });
});

// ─── createReviewSchema ─────────────────────────────────────────

describe("createReviewSchema", () => {
  const validReview = {
    skillId: "550e8400-e29b-41d4-a716-446655440000",
    starRating: 4,
    reviewText: "Really helpful for drafting emails!",
    reviewerIpHash: "abc123hash",
    sessionId: "session-xyz",
  };

  it("accepts a valid review", () => {
    const result = createReviewSchema.parse(validReview);
    expect(result.starRating).toBe(4);
  });

  it("rejects star rating below 1", () => {
    expect(() =>
      createReviewSchema.parse({ ...validReview, starRating: 0 }),
    ).toThrow();
  });

  it("rejects star rating above 5", () => {
    expect(() =>
      createReviewSchema.parse({ ...validReview, starRating: 6 }),
    ).toThrow();
  });

  it("rejects non-integer star ratings", () => {
    expect(() =>
      createReviewSchema.parse({ ...validReview, starRating: 3.5 }),
    ).toThrow();
  });

  it("rejects invalid skill ID format", () => {
    expect(() =>
      createReviewSchema.parse({ ...validReview, skillId: "not-a-uuid" }),
    ).toThrow();
  });

  it("rejects empty review text", () => {
    expect(() =>
      createReviewSchema.parse({ ...validReview, reviewText: "" }),
    ).toThrow();
  });

  it("rejects review text over 2000 characters", () => {
    expect(() =>
      createReviewSchema.parse({
        ...validReview,
        reviewText: "a".repeat(2001),
      }),
    ).toThrow();
  });
});

// ─── createSubmissionSchema ─────────────────────────────────────

describe("createSubmissionSchema", () => {
  const validSubmission = {
    skillName: "Code Reviewer",
    shortDescription: "AI-powered code review assistant",
    category: "engineering" as const,
    contentMd: "# Code Reviewer\n\nReviews your code for best practices.",
    exampleOutputModel: "Claude 3.5 Sonnet",
  };

  it("accepts a valid submission with required fields", () => {
    const result = createSubmissionSchema.parse(validSubmission);
    expect(result.skillName).toBe("Code Reviewer");
    expect(result.llmTags).toEqual([]);
  });

  it("accepts a valid submission with contributor info", () => {
    const result = createSubmissionSchema.parse({
      ...validSubmission,
      contributorName: "Jane Doe",
      contributorUrl: "https://janedoe.com",
      contributorBio: "Senior engineer",
      contributorEmail: "jane@example.com",
    });
    expect(result.contributorName).toBe("Jane Doe");
    expect(result.contributorEmail).toBe("jane@example.com");
  });

  it("rejects invalid contributor email", () => {
    expect(() =>
      createSubmissionSchema.parse({
        ...validSubmission,
        contributorEmail: "not-an-email",
      }),
    ).toThrow();
  });

  it("rejects invalid contributor URL", () => {
    expect(() =>
      createSubmissionSchema.parse({
        ...validSubmission,
        contributorUrl: "not-a-url",
      }),
    ).toThrow();
  });
});

// ─── reviewSubmissionSchema ─────────────────────────────────────

describe("reviewSubmissionSchema", () => {
  it("accepts approved status", () => {
    const result = reviewSubmissionSchema.parse({ status: "approved" });
    expect(result.status).toBe("approved");
  });

  it("accepts rejected status with notes", () => {
    const result = reviewSubmissionSchema.parse({
      status: "rejected",
      reviewerNotes: "Content doesn't meet quality bar",
    });
    expect(result.status).toBe("rejected");
    expect(result.reviewerNotes).toBe("Content doesn't meet quality bar");
  });

  it("rejects pending status", () => {
    expect(() =>
      reviewSubmissionSchema.parse({ status: "pending" }),
    ).toThrow();
  });
});

// ─── createUsageEventSchema ─────────────────────────────────────

describe("createUsageEventSchema", () => {
  it("accepts a valid usage event", () => {
    const result = createUsageEventSchema.parse({
      skillId: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "view",
    });
    expect(result.eventType).toBe("view");
  });

  it("rejects invalid skill ID", () => {
    expect(() =>
      createUsageEventSchema.parse({
        skillId: "not-uuid",
        eventType: "copy",
      }),
    ).toThrow();
  });

  it("rejects invalid event type", () => {
    expect(() =>
      createUsageEventSchema.parse({
        skillId: "550e8400-e29b-41d4-a716-446655440000",
        eventType: "share",
      }),
    ).toThrow();
  });
});

// ─── paginationSchema ───────────────────────────────────────────

describe("paginationSchema", () => {
  it("applies defaults when no input given", () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("coerces string numbers", () => {
    const result = paginationSchema.parse({ page: "3", limit: "50" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it("rejects page below 1", () => {
    expect(() => paginationSchema.parse({ page: 0 })).toThrow();
  });

  it("rejects limit above 100", () => {
    expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
  });
});

// ─── skillFiltersSchema ─────────────────────────────────────────

describe("skillFiltersSchema", () => {
  it("accepts empty filters", () => {
    const result = skillFiltersSchema.parse({});
    expect(result).toBeDefined();
  });

  it("accepts valid category filter", () => {
    const result = skillFiltersSchema.parse({ category: "engineering" });
    expect(result.category).toBe("engineering");
  });

  it("accepts search filter", () => {
    const result = skillFiltersSchema.parse({ search: "email" });
    expect(result.search).toBe("email");
  });

  it("rejects invalid category", () => {
    expect(() =>
      skillFiltersSchema.parse({ category: "design" }),
    ).toThrow();
  });

  it("rejects search over 200 characters", () => {
    expect(() =>
      skillFiltersSchema.parse({ search: "a".repeat(201) }),
    ).toThrow();
  });
});
