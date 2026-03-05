import Link from "next/link";
import { getPublishedSkills, getSkillCounts } from "@/app/actions/skills";
import { SkillCard } from "@/components/ui/skill-card";
import { SearchInput } from "@/components/ui/search-input";
import { EmptySearchState, EmptyCategoryState } from "@/components/ui/empty-state";
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
    <main className="notebook-lines min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-16 pb-12 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Skills that actually work.
          </h1>
          <p className="mt-4 text-lg text-foreground-secondary max-w-2xl mx-auto">
            Curated, human-verified .md skills you can copy straight into any LLM.
            Every tool on this wall has been tested and approved.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <Link href="/search">
              <SearchInput
                placeholder="Search the workbench..."
                readOnly
                className="cursor-pointer"
                tabIndex={-1}
              />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-foreground-muted">
            <span className="font-medium text-foreground">
              {counts.total} skills
            </span>
            <span>·</span>
            <span>3 categories</span>
            <span>·</span>
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
            <h2 className="font-display text-2xl font-bold text-foreground">
              {category
                ? `${categoryLabel(category)} skills`
                : "All skills"}
            </h2>
            <SortBar currentSort={sort} currentCategory={category} />
          </div>

          {skillsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <section className="border-t border-warm-200 py-12 text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Built a skill that works?
          </h3>
          <p className="text-sm text-foreground-secondary mb-6 max-w-md mx-auto">
            Submit it to the workshop. If it passes our rubric, it goes on the wall
            with your name on it.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-[var(--radius-md)] border border-sketch hover:bg-amber-600 transition-colors"
          >
            Submit a skill
          </Link>
        </section>
      </div>
    </main>
  );
}

function categoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    marketing: "Marketing & Growth",
    engineering: "Engineering & Product",
    sales: "Sales & GTM",
  };
  return labels[category];
}
