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
  prefix: string;
}[] = [
  {
    value: "marketing",
    label: "marketing",
    prefix: ">>",
  },
  {
    value: "engineering",
    label: "engineering",
    prefix: ">>",
  },
  {
    value: "sales",
    label: "sales",
    prefix: ">>",
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
    <section className="pb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={buildHref()}
          className={`px-3 py-1.5 text-xs font-mono rounded-[var(--radius-sm)] transition-colors ${
            !activeCategory
              ? "bg-accent text-background font-semibold"
              : "text-foreground-muted hover:text-foreground-secondary border border-border-subtle"
          }`}
        >
          all
        </Link>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          const count = countMap.get(cat.value) ?? 0;

          return (
            <Link
              key={cat.value}
              href={isActive ? buildHref() : buildHref(cat.value)}
              className={`px-3 py-1.5 text-xs font-mono rounded-[var(--radius-sm)] transition-colors ${
                isActive
                  ? "bg-accent text-background font-semibold"
                  : "text-foreground-muted hover:text-foreground-secondary border border-border-subtle"
              }`}
            >
              {cat.prefix} {cat.label}
              <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
