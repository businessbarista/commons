"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-4">
      <Link
        href="/"
        className="text-xs font-mono font-semibold text-foreground-muted hover:text-foreground transition-colors lowercase"
      >
        commons_
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/submit"
          className="text-xs font-mono text-foreground-ghost hover:text-foreground transition-colors lowercase"
        >
          submit
        </Link>
        <Link
          href="/rubric"
          className="text-xs font-mono text-foreground-ghost hover:text-foreground transition-colors lowercase"
        >
          rubric
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
