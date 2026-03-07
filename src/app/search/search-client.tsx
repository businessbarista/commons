"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchInput } from "@/components/ui/search-input";
import { SkillCard } from "@/components/ui/skill-card";
import { EmptySearchState } from "@/components/ui/empty-state";
import type { Category } from "@/lib/schemas";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: "marketing" | "engineering" | "sales";
  authorName: string;
  isExpert: boolean;
  averageRating: number;
  reviewCount: number;
  copyCount: number;
}

const categories: { value: Category; label: string }[] = [
  { value: "marketing", label: "Marketing" },
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
];

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(
    async (q: string, cat: string) => {
      // Update URL params
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (cat) params.set("category", cat);
      const qs = params.toString();
      router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });

      if (!q.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const url = new URL("/api/search", window.location.origin);
        url.searchParams.set("q", q);
        if (cat) url.searchParams.set("category", cat);

        const res = await fetch(url);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Debounced search on query change
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        doSearch(value, activeCategory);
      }, 300);
    },
    [activeCategory, doSearch],
  );

  // Category filter
  const handleCategoryToggle = useCallback(
    (cat: string) => {
      const next = activeCategory === cat ? "" : cat;
      setActiveCategory(next);
      doSearch(query, next);
    },
    [activeCategory, query, doSearch],
  );

  // Initial search from URL params
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, initialCategory);
    }
    // Focus input on mount
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Search Input */}
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={(e) => handleQueryChange((e.target as HTMLInputElement).value)}
        placeholder="Search for skills..."
        className="mb-4"
      />

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryToggle(cat.value)}
            className={`px-3 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors ${
              activeCategory === cat.value
                ? "bg-accent text-[#0A0A0A] border-accent"
                : "bg-surface-raised text-foreground-secondary border-border hover:border-foreground-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
        {activeCategory && (
          <button
            onClick={() => handleCategoryToggle(activeCategory)}
            className="px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-foreground-muted py-8 text-center">
          Searching...
        </p>
      )}

      {/* Results */}
      {!isLoading && hasSearched && results.length > 0 && (
        <div>
          <p className="text-sm text-foreground-muted mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
            {query}&rdquo;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((skill) => (
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
        </div>
      )}

      {/* Empty State */}
      {!isLoading && hasSearched && results.length === 0 && (
        <EmptySearchState />
      )}

      {/* Pre-search hint */}
      {!hasSearched && !isLoading && (
        <div className="text-center py-16">
          <p className="text-foreground-muted text-sm">
            Start typing to search across all skills — names, descriptions, and
            content.
          </p>
          <p className="text-foreground-muted text-sm mt-2">
            Or{" "}
            <Link href="/" className="text-accent underline underline-offset-2">
              browse the workbench
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
