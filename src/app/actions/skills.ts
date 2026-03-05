import { db } from "@/lib/db";
import { skills, reviews, usageEvents } from "@/db/schema";
import { eq, and, sql, desc, count } from "drizzle-orm";
import type { Category } from "@/lib/schemas";
import type { SortOption } from "@/components/ui/sort-select";

// ─── Types ───────────────────────────────────────────────────────

export interface SkillWithStats {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: "marketing" | "engineering" | "sales";
  authorName: string;
  authorUrl: string | null;
  isExpert: boolean;
  publishedAt: Date | null;
  averageRating: number;
  reviewCount: number;
  copyCount: number;
  downloadCount: number;
}

export interface SkillDetail extends SkillWithStats {
  contentMd: string;
  llmTags: string[];
  authorBio: string | null;
  exampleOutputText: string | null;
  exampleOutputImageUrl: string | null;
  exampleOutputModel: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface SkillReview {
  id: string;
  starRating: number;
  reviewText: string;
  createdAt: Date;
}

export interface CategoryCount {
  category: "marketing" | "engineering" | "sales";
  count: number;
}

// ─── Directory Queries ───────────────────────────────────────────

export async function getPublishedSkills(options?: {
  sort?: SortOption;
  category?: Category;
}): Promise<SkillWithStats[]> {
  const { sort = "most-used", category } = options ?? {};

  const conditions = [eq(skills.status, "published")];
  if (category) {
    conditions.push(eq(skills.category, category));
  }

  const rows = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      shortDescription: skills.shortDescription,
      category: skills.category,
      authorName: skills.authorName,
      authorUrl: skills.authorUrl,
      isExpert: skills.isExpert,
      publishedAt: skills.publishedAt,
      averageRating: sql<number>`coalesce(avg(${reviews.starRating}), 0)`.as(
        "average_rating",
      ),
      reviewCount: sql<number>`count(distinct ${reviews.id})`.as(
        "review_count",
      ),
      copyCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'copy' then ${usageEvents.id} end)`.as(
          "copy_count",
        ),
      downloadCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'download' then ${usageEvents.id} end)`.as(
          "download_count",
        ),
    })
    .from(skills)
    .leftJoin(reviews, eq(skills.id, reviews.skillId))
    .leftJoin(usageEvents, eq(skills.id, usageEvents.skillId))
    .where(and(...conditions))
    .groupBy(skills.id)
    .orderBy(getSortExpression(sort));

  return rows.map((row) => ({
    ...row,
    averageRating: Number(row.averageRating),
    reviewCount: Number(row.reviewCount),
    copyCount: Number(row.copyCount),
    downloadCount: Number(row.downloadCount),
  }));
}

export async function getSkillCounts(): Promise<{
  total: number;
  byCategory: CategoryCount[];
}> {
  const rows = await db
    .select({
      category: skills.category,
      count: count(),
    })
    .from(skills)
    .where(eq(skills.status, "published"))
    .groupBy(skills.category);

  const byCategory = rows.map((row) => ({
    category: row.category,
    count: Number(row.count),
  }));

  const total = byCategory.reduce((sum, c) => sum + c.count, 0);

  return { total, byCategory };
}

// ─── Skill Detail Queries ────────────────────────────────────────

export async function getSkillBySlug(
  slug: string,
): Promise<SkillDetail | null> {
  const rows = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      shortDescription: skills.shortDescription,
      contentMd: skills.contentMd,
      category: skills.category,
      llmTags: skills.llmTags,
      authorName: skills.authorName,
      authorUrl: skills.authorUrl,
      authorBio: skills.authorBio,
      exampleOutputText: skills.exampleOutputText,
      exampleOutputImageUrl: skills.exampleOutputImageUrl,
      exampleOutputModel: skills.exampleOutputModel,
      isExpert: skills.isExpert,
      publishedAt: skills.publishedAt,
      createdAt: skills.createdAt,
      updatedAt: skills.updatedAt,
      averageRating: sql<number>`coalesce(avg(${reviews.starRating}), 0)`.as(
        "average_rating",
      ),
      reviewCount: sql<number>`count(distinct ${reviews.id})`.as(
        "review_count",
      ),
      viewCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'view' then ${usageEvents.id} end)`.as(
          "view_count",
        ),
      copyCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'copy' then ${usageEvents.id} end)`.as(
          "copy_count",
        ),
      downloadCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'download' then ${usageEvents.id} end)`.as(
          "download_count",
        ),
    })
    .from(skills)
    .leftJoin(reviews, eq(skills.id, reviews.skillId))
    .leftJoin(usageEvents, eq(skills.id, usageEvents.skillId))
    .where(and(eq(skills.slug, slug), eq(skills.status, "published")))
    .groupBy(skills.id)
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    ...row,
    averageRating: Number(row.averageRating),
    reviewCount: Number(row.reviewCount),
    viewCount: Number(row.viewCount),
    copyCount: Number(row.copyCount),
    downloadCount: Number(row.downloadCount),
  };
}

export async function getSkillReviews(
  skillId: string,
): Promise<SkillReview[]> {
  const rows = await db
    .select({
      id: reviews.id,
      starRating: reviews.starRating,
      reviewText: reviews.reviewText,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(and(eq(reviews.skillId, skillId), eq(reviews.flagged, false)))
    .orderBy(desc(reviews.createdAt))
    .limit(50);

  return rows;
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: skills.slug })
    .from(skills)
    .where(eq(skills.status, "published"));

  return rows.map((r) => r.slug);
}

// ─── Helpers ─────────────────────────────────────────────────────

function getSortExpression(sort: SortOption) {
  switch (sort) {
    case "highest-rated":
      return desc(sql`coalesce(avg(${reviews.starRating}), 0)`);
    case "newest":
      return desc(skills.publishedAt);
    case "trending":
    case "most-used":
    default:
      return desc(
        sql`count(distinct case when ${usageEvents.eventType} in ('copy', 'download') then ${usageEvents.id} end)`,
      );
  }
}
