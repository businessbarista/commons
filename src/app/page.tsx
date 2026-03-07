import Link from "next/link";
import { getPublishedSkills, getSkillCounts } from "@/app/actions/skills";
import { SkillCard } from "@/components/ui/skill-card";
import { SearchInput } from "@/components/ui/search-input";
import { EmptySearchState, EmptyCategoryState } from "@/components/ui/empty-state";
import { SiteHeader } from "@/components/layout/site-header";
import { CategoryNav } from "./category-nav";
import { SortBar } from "./sort-bar";
import type { SortOption } from "@/components/ui/sort-select";
import type { Category } from "@/lib/schemas";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Commons — The Trusted AI Skills Directory",
  description:
    "The most trusted library of human-verified AI skills. Discover, copy, and rate curated .md skills that actually work.",
  openGraph: {
    title: "Commons — The Trusted AI Skills Directory",
    description:
      "Discover, copy, and rate curated AI skills that actually work.",
    type: "website",
  },
};

interface HomeProps {
  searchParams: Promise<{ sort?: string; category?: string }>;
}

const validSorts = new Set(["most-used", "highest-rated", "newest", "trending"]);
const validCategories = new Set(["marketing", "engineering", "sales"]);

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const sort = validSorts.has(params.sort ?? "")
    ? (params.sort as SortOption)
    : "most-used";
  const category = validCategories.has(params.category ?? "")
    ? (params.category as Category)
    : undefined;

  const [skillsList, counts] = await Promise.all([
    getPublishedSkills({ sort, category }),
    getSkillCounts(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteHeader />

        {/* Hero */}
        <section className="pt-8 pb-10">
          <p className="text-xs text-foreground-ghost font-mono mb-3">
            // the trusted ai skills directory
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground lowercase">
            skills that actually work.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted font-mono max-w-2xl">
            curated, human-verified .md skills you can copy straight into any
            llm. every skill in this directory has been tested and approved.
          </p>
          <div className="mt-8 max-w-xl">
            <Link href="/search">
              <SearchInput
                placeholder="search skills..."
                readOnly
                className="cursor-pointer"
                tabIndex={-1}
              />
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-foreground-ghost font-mono">
            <span className="text-accent font-semibold">
              {counts.total} skills
            </span>
            <span className="text-foreground-faint">/</span>
            <span>3 categories</span>
            <span className="text-foreground-faint">/</span>
            <span>100% human-reviewed</span>
          </div>
        </section>

        {/* Category Navigation */}
        <CategoryNav
          counts={counts.byCategory}
          activeCategory={category}
        />

        {/* Sort + Grid */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-sm font-semibold text-foreground-secondary lowercase">
              {category
                ? `>> ${categoryLabel(category)}`
                : ">> all skills"}
            </h2>
            <SortBar currentSort={sort} currentCategory={category} />
          </div>

          {skillsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillsList.map((skill) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  slug={skill.slug}
                  shortDescription={skill.shortDescription}
                  category={skill.category}
                  authorName={skill.authorName}
                  isExpert={skill.isExpert}
                  averageRating={skill.averageRating}
                  reviewCount={skill.reviewCount}
                  copyCount={skill.copyCount}
                />
              ))}
            </div>
          ) : category ? (
            <EmptyCategoryState category={categoryLabel(category)} />
          ) : (
            <EmptySearchState />
          )}
        </section>

        {/* Footer CTA */}
        <section className="border-t border-border py-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-sm font-semibold text-foreground mb-1 lowercase">
                built a skill that works?
              </h3>
              <p className="text-xs text-foreground-muted font-mono max-w-md">
                submit it to the directory. if it passes our rubric, it goes
                live with your name on it.
              </p>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center px-5 py-2.5 bg-accent text-[#0A0A0A] text-xs font-semibold font-mono rounded-[var(--radius-md)] hover:opacity-90 transition-colors"
            >
              submit a skill
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function categoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    marketing: "marketing",
    engineering: "engineering",
    sales: "sales",
  };
  return labels[category];
}
