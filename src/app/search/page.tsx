import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageClient } from "./search-client";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Commons directory for AI skills.",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
        <SiteHeader />
        <h1 className="font-mono text-2xl font-bold text-foreground lowercase mb-6">
          // search skills
        </h1>
        <Suspense
          fallback={
            <p className="text-xs text-foreground-muted font-mono text-center py-8">
              loading search...
            </p>
          }
        >
          <SearchPageClient />
        </Suspense>
      </div>
    </main>
  );
}
