import { config } from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { skills } from "../src/db/schema";

config({ path: ".env.local" });

const SEED_DIR = join(process.cwd(), "seed-skills");
const CATEGORIES = ["marketing", "engineering", "sales"] as const;
type Category = (typeof CATEGORIES)[number];

interface SkillFrontmatter {
  name: string;
  short_description: string;
  category: Category;
  llm_tags: string[];
  author_name: string;
  author_url?: string;
  author_bio?: string;
  example_output_model: string;
  is_expert?: boolean;
}

function slugFromFilename(filename: string): string {
  return basename(filename, ".md");
}

function extractExampleOutput(content: string): {
  skillContent: string;
  exampleOutput: string | null;
} {
  const marker = /^## Example Output$/m;
  const match = content.match(marker);

  if (!match || match.index === undefined) {
    return { skillContent: content.trim(), exampleOutput: null };
  }

  const skillContent = content.slice(0, match.index).trim();
  const exampleOutput = content.slice(match.index + match[0].length).trim();

  return { skillContent, exampleOutput };
}

function validateFrontmatter(
  data: Record<string, unknown>,
  filepath: string,
): SkillFrontmatter {
  const required = [
    "name",
    "short_description",
    "category",
    "llm_tags",
    "author_name",
    "example_output_model",
  ];

  const missing = required.filter((key) => !data[key]);
  if (missing.length > 0) {
    throw new Error(
      `${filepath}: Missing required frontmatter fields: ${missing.join(", ")}`,
    );
  }

  if (!CATEGORIES.includes(data.category as Category)) {
    throw new Error(
      `${filepath}: Invalid category "${data.category}". Must be one of: ${CATEGORIES.join(", ")}`,
    );
  }

  return {
    name: data.name as string,
    short_description: data.short_description as string,
    category: data.category as Category,
    llm_tags: (data.llm_tags as string[]) || [],
    author_name: data.author_name as string,
    author_url: data.author_url as string | undefined,
    author_bio: data.author_bio as string | undefined,
    example_output_model: data.example_output_model as string,
    is_expert: (data.is_expert as boolean) || false,
  };
}

async function main() {
  console.log("🌱 Commons Seed Script");
  console.log("━".repeat(50));

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  let totalProcessed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  const slugsSeen = new Set<string>();

  for (const category of CATEGORIES) {
    const categoryDir = join(SEED_DIR, category);

    let files: string[];
    try {
      files = readdirSync(categoryDir).filter((f) => f.endsWith(".md"));
    } catch {
      console.log(`\n📂 ${category}/ — directory not found, skipping`);
      continue;
    }

    if (files.length === 0) {
      console.log(`\n📂 ${category}/ — no .md files found, skipping`);
      continue;
    }

    console.log(`\n📂 ${category}/ — ${files.length} file(s)`);

    for (const file of files) {
      const filepath = join(categoryDir, file);
      totalProcessed++;

      try {
        const raw = readFileSync(filepath, "utf-8");
        const { data, content } = matter(raw);
        const frontmatter = validateFrontmatter(data, filepath);

        const slug = slugFromFilename(file);

        // Check for duplicate slugs across categories
        if (slugsSeen.has(slug)) {
          throw new Error(
            `Duplicate slug "${slug}" — slugs must be unique across all categories`,
          );
        }
        slugsSeen.add(slug);

        const { skillContent, exampleOutput } = extractExampleOutput(content);

        if (!skillContent) {
          throw new Error("No skill content found after frontmatter");
        }

        // Upsert: insert or update on slug conflict
        const existing = await db
          .select({ id: skills.id })
          .from(skills)
          .where(eq(skills.slug, slug))
          .limit(1);

        const now = new Date();

        if (existing.length > 0) {
          // Update existing skill
          await db
            .update(skills)
            .set({
              name: frontmatter.name,
              shortDescription: frontmatter.short_description,
              contentMd: skillContent,
              category: frontmatter.category,
              llmTags: frontmatter.llm_tags,
              authorName: frontmatter.author_name,
              authorUrl: frontmatter.author_url || null,
              authorBio: frontmatter.author_bio || null,
              exampleOutputText: exampleOutput,
              exampleOutputModel: frontmatter.example_output_model,
              isExpert: frontmatter.is_expert || false,
              status: "published",
              publishedAt: now,
              updatedAt: now,
            })
            .where(eq(skills.slug, slug));

          console.log(`   ♻️  ${slug} — updated`);
          totalUpdated++;
        } else {
          // Insert new skill
          await db.insert(skills).values({
            name: frontmatter.name,
            slug,
            shortDescription: frontmatter.short_description,
            contentMd: skillContent,
            category: frontmatter.category,
            llmTags: frontmatter.llm_tags,
            authorName: frontmatter.author_name,
            authorUrl: frontmatter.author_url || null,
            authorBio: frontmatter.author_bio || null,
            exampleOutputText: exampleOutput,
            exampleOutputModel: frontmatter.example_output_model,
            isExpert: frontmatter.is_expert || false,
            status: "published",
            publishedAt: now,
          });

          console.log(`   ✅ ${slug} — inserted`);
          totalInserted++;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`   ❌ ${file} — ${message}`);
        totalErrors++;
      }
    }
  }

  console.log("\n" + "━".repeat(50));
  console.log(
    `📊 Results: ${totalProcessed} processed, ${totalInserted} inserted, ${totalUpdated} updated, ${totalErrors} errors`,
  );

  await client.end();

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
