"use client";

import { useRouter } from "next/navigation";
import { SortSelect, type SortOption } from "@/components/ui/sort-select";
import type { Category } from "@/lib/schemas";

interface SortBarProps {
  currentSort: SortOption;
  currentCategory?: Category;
}

export function SortBar({ currentSort, currentCategory }: SortBarProps) {
  const router = useRouter();

  function handleSortChange(sort: SortOption) {
    const params = new URLSearchParams();
    params.set("sort", sort);
    if (currentCategory) {
      params.set("category", currentCategory);
    }
    router.push(`/?${params.toString()}`);
  }

  return <SortSelect value={currentSort} onChange={handleSortChange} />;
}
