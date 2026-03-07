import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getSkillBySlug,
  getSkillReviews,
  getAllPublishedSlugs,
} from "@/app/actions/skills";
import { CategoryTag } from "@/components/ui/category-tag";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ExampleOutput } from "@/components/skill-detail/example-output";
import { CopyButton } from "@/components/skill-detail/copy-button";
import { DownloadButton } from "@/components/skill-detail/download-button";
import { UsageStats } from "@/components/skill-detail/usage-stats";
import { ReviewFeed } from "@/components/skill-detail/review-feed";
import { ReviewForm } from "@/components/skill-detail/review-form";
import { ViewTracker } from "@/components/skill-detail/view-tracker";
import { SiteHeader } from "@/components/layout/site-header";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return { title: "Skill Not Found" };
  }

  return {
    title: skill.name,
    description: skill.shortDescription,
    openGraph: {
      title: `${skill.name} — Commons`,
      description: skill.shortDescription,
      type: "article",
    },
    alternates: {
      canonical: `/skills/${slug}`,
    },
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const skillReviews = await getSkillReviews(skill.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.shortDescription,
    applicationCategory: "AI Prompt",
    author: {
      "@type": "Person",
      name: skill.authorName,
      ...(skill.authorUrl ? { url: skill.authorUrl } : {}),
    },
    ...(skill.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: skill.averageRating.toFixed(1),
            reviewCount: skill.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        <SiteHeader />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ViewTracker skillId={skill.id} />

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs font-mono text-foreground-ghost">
          <Link href="/" className="hover:text-foreground transition-colors">
            commons
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/?category=${skill.category}`}
            className="hover:text-foreground transition-colors"
          >
            {categoryLabel(skill.category)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground-muted">{skill.name.toLowerCase()}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CategoryTag category={skill.category} size="md" />
            {skill.isExpert && <Badge variant="expert" />}
            <Badge variant="verified" />
          </div>

          <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-3 lowercase">
            {skill.name}
          </h1>

          <p className="text-sm text-foreground-muted font-mono mb-4">
            {skill.shortDescription}
          </p>

          {/* Author + Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono mb-4">
            <span className="text-foreground-ghost">
              by{" "}
              {skill.authorUrl ? (
                <a
                  href={skill.authorUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-accent-fg underline underline-offset-2 hover:opacity-80"
                >
                  {skill.authorName}
                </a>
              ) : (
                <span className="text-foreground-muted">
                  {skill.authorName}
                </span>
              )}
            </span>
            {skill.reviewCount > 0 && (
              <StarRating
                rating={skill.averageRating}
                count={skill.reviewCount}
                size="sm"
              />
            )}
          </div>

          {/* LLM Tags */}
          {skill.llmTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {skill.llmTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-border text-foreground-muted rounded-[var(--radius-sm)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Usage Stats */}
          <UsageStats
            viewCount={skill.viewCount}
            copyCount={skill.copyCount}
            downloadCount={skill.downloadCount}
          />
        </header>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <CopyButton skillId={skill.id} contentMd={skill.contentMd} />
          <DownloadButton
            skillId={skill.id}
            slug={skill.slug}
            contentMd={skill.contentMd}
          />
        </div>

        {/* Content + Example Output */}
        <section className="mb-12">
          <ExampleOutput
            skillContent={skill.contentMd}
            exampleOutputText={skill.exampleOutputText}
            exampleOutputImageUrl={skill.exampleOutputImageUrl}
            exampleOutputModel={skill.exampleOutputModel}
          />
        </section>

        {/* Reviews */}
        <section className="border-t border-border pt-8 mb-8">
          <ReviewFeed
            reviews={skillReviews}
            averageRating={skill.averageRating}
            reviewCount={skill.reviewCount}
          />
        </section>

        {/* Review Form */}
        <section className="border-t border-border pt-8 mb-12">
          <ReviewForm skillId={skill.id} />
        </section>

        {/* Back to Directory */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="text-xs font-mono text-foreground-ghost hover:text-foreground transition-colors"
          >
            ← back to directory
          </Link>
        </div>
      </div>
    </main>
  );
}

function categoryLabel(
  category: "marketing" | "engineering" | "sales",
): string {
  const labels = {
    marketing: "marketing",
    engineering: "engineering",
    sales: "sales",
  };
  return labels[category];
}
