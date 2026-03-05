import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageClient } from "./search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Commons workbench for AI skills.",
};

export default function SearchPage() {
  return (
    <main className="notebook-lines min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">
        Scan the wall
      </h1>
      <Suspense
        fallback={
          <p className="text-sm text-foreground-muted text-center py-8">
            Loading search...
          </p>
        }
      >
        <SearchPageClient />
      </Suspense>
      </div>
    </main>
  );
}
