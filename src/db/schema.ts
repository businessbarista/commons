import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const categoryEnum = pgEnum("category", [
  "marketing",
  "engineering",
  "sales",
]);

export const skillStatusEnum = pgEnum("skill_status", [
  "draft",
  "published",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
]);

export const usageEventTypeEnum = pgEnum("usage_event_type", [
  "view",
  "copy",
  "download",
]);

// Skills table
export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull(),
    contentMd: text("content_md").notNull(),
    category: categoryEnum("category").notNull(),
    llmTags: text("llm_tags").array().notNull().default([]),
    authorName: text("author_name").notNull(),
    authorUrl: text("author_url"),
    authorBio: text("author_bio"),
    exampleOutputText: text("example_output_text"),
    exampleOutputImageUrl: text("example_output_image_url"),
    exampleOutputModel: text("example_output_model").notNull(),
    isExpert: boolean("is_expert").notNull().default(false),
    status: skillStatusEnum("status").notNull().default("draft"),
    reviewerNotes: text("reviewer_notes"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("skills_slug_idx").on(table.slug),
    index("skills_category_status_idx").on(table.category, table.status),
    index("skills_status_published_idx").on(table.status, table.publishedAt),
  ],
);

// Reviews table
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    starRating: integer("star_rating").notNull(),
    reviewText: text("review_text").notNull(),
    reviewerIpHash: text("reviewer_ip_hash").notNull(),
    sessionId: text("session_id").notNull(),
    flagged: boolean("flagged").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("reviews_skill_id_created_idx").on(table.skillId, table.createdAt),
  ],
);

// Submissions table
export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillName: text("skill_name").notNull(),
  shortDescription: text("short_description").notNull(),
  category: categoryEnum("category").notNull(),
  llmTags: text("llm_tags").array().notNull().default([]),
  contentMd: text("content_md").notNull(),
  exampleOutputText: text("example_output_text"),
  exampleOutputImageUrl: text("example_output_image_url"),
  exampleOutputModel: text("example_output_model").notNull(),
  contributorName: text("contributor_name"),
  contributorUrl: text("contributor_url"),
  contributorBio: text("contributor_bio"),
  contributorEmail: text("contributor_email"),
  status: submissionStatusEnum("status").notNull().default("pending"),
  reviewerNotes: text("reviewer_notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

// Usage events table
export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    eventType: usageEventTypeEnum("event_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("usage_events_skill_type_idx").on(table.skillId, table.eventType),
  ],
);
