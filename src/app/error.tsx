"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-4xl font-mono font-bold text-error mb-4">err</p>
        <h1 className="font-mono text-xl font-bold text-foreground lowercase mb-3">
          something went wrong
        </h1>
        <p className="text-sm text-foreground-muted font-mono mb-8">
          we hit an unexpected error. try refreshing the page or head back to
          the directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold font-mono rounded-[var(--radius-md)] bg-accent text-[#0A0A0A] hover:opacity-90 transition-colors"
          >
            try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-mono rounded-[var(--radius-md)] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors"
          >
            ← back to directory
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-foreground-ghost font-mono">
            // error id: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
