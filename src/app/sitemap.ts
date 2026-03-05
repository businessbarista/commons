import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://commons.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/rubric`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic skill pages
  const publishedSkills = await db
    .select({
      slug: skills.slug,
      updatedAt: skills.updatedAt,
    })
    .from(skills)
    .where(eq(skills.status, "published"));

  const skillPages: MetadataRoute.Sitemap = publishedSkills.map((skill) => ({
    url: `${BASE_URL}/skills/${skill.slug}`,
    lastModified: skill.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...skillPages];
}
