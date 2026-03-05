"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CategoryCount } from "@/app/actions/skills";
import type { Category } from "@/lib/schemas";

interface CategoryNavProps {
  counts: CategoryCount[];
  activeCategory?: Category;
}

const categories: {
  value: Category;
  label: string;
  description: string;
  dot: string;
  activeBg: string;
}[] = [
  {
    value: "marketing",
    label: "Marketing & Growth",
    description: "Copy generation, campaign briefs, SEO workflows",
    dot: "bg-marketing",
    activeBg: "border-marketing/60 bg-marketing/5",
  },
  {
    value: "engineering",
    label: "Engineering & Product",
    description: "Code review, PRD generation, debugging assistants",
    dot: "bg-engineering",
    activeBg: "border-engineering/60 bg-engineering/5",
  },
  {
    value: "sales",
    label: "Sales & GTM",
    description: "Outreach personalization, call prep, deal summaries",
    dot: "bg-sales",
    activeBg: "border-sales/60 bg-sales/5",
  },
];

export function CategoryNav({ counts, activeCategory }: CategoryNavProps) {
  const searchParams = useSearchParams();

  function buildHref(category?: Category) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const countMap = new Map(counts.map((c) => [c.category, c.count]));

  return (
    <section className="pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          const count = countMap.get(cat.value) ?? 0;

          return (
            <Link
              key={cat.value}
              href={isActive ? buildHref() : buildHref(cat.value)}
              className={`block p-4 rounded-[var(--radius-md)] transition-all hover:shadow-sm ${
                isActive
                  ? `border-[1.5px] ${cat.activeBg}`
                  : "border-[1.5px] border-sketch/30 bg-transparent hover:border-sketch/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${cat.dot}`}
                />
                <span className="text-sm font-semibold text-foreground">
                  {cat.label}
                </span>
                <span className="ml-auto text-xs text-foreground-muted">
                  {count}
                </span>
              </div>
              <p className="text-xs text-foreground-muted">{cat.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
