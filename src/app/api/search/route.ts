import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills, reviews, usageEvents } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type { Category } from "@/lib/schemas";

const validCategories = new Set(["marketing", "engineering", "sales"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "20", 10), 1),
    50,
  );

  if (!query || query.length === 0) {
    return NextResponse.json({ results: [], query: "" });
  }

  // Sanitize the query for tsquery — remove special chars, join with &
  const sanitized = query
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => `${w}:*`)
    .join(" & ");

  if (!sanitized) {
    return NextResponse.json({ results: [], query });
  }

  const conditions = [
    eq(skills.status, "published"),
    sql`${skills}.search_vector @@ to_tsquery('english', ${sanitized})`,
  ];

  if (category && validCategories.has(category)) {
    conditions.push(eq(skills.category, category as Category));
  }

  const rows = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      shortDescription: skills.shortDescription,
      category: skills.category,
      authorName: skills.authorName,
      isExpert: skills.isExpert,
      averageRating: sql<number>`coalesce(avg(${reviews.starRating}), 0)`,
      reviewCount: sql<number>`count(distinct ${reviews.id})`,
      copyCount:
        sql<number>`count(distinct case when ${usageEvents.eventType} = 'copy' then ${usageEvents.id} end)`,
      rank: sql<number>`ts_rank(${skills}.search_vector, to_tsquery('english', ${sanitized}))`,
    })
    .from(skills)
    .leftJoin(reviews, eq(skills.id, reviews.skillId))
    .leftJoin(usageEvents, eq(skills.id, usageEvents.skillId))
    .where(and(...conditions))
    .groupBy(skills.id)
    .orderBy(
      desc(
        sql`ts_rank(${skills}.search_vector, to_tsquery('english', ${sanitized}))`,
      ),
    )
    .limit(limit);

  const results = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription,
    category: row.category,
    authorName: row.authorName,
    isExpert: row.isExpert,
    averageRating: Number(row.averageRating),
    reviewCount: Number(row.reviewCount),
    copyCount: Number(row.copyCount),
  }));

  return NextResponse.json({ results, query });
}
