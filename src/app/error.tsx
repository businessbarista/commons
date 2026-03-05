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
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      {/* Error Icon */}
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-3">
        Something went wrong
      </h1>
      <p className="text-foreground-secondary text-base mb-8">
        We hit an unexpected error. Try refreshing the page or head back to the
        workbench.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-[var(--radius-md)] border border-warm-200 text-foreground-secondary hover:bg-surface-raised transition-colors"
        >
          ← Back to the workbench
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-foreground-muted">
          Error ID: {error.digest}
        </p>
      )}
    </main>
  );
}
