import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      {/* 404 Icon */}
      <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl font-extrabold text-foreground-muted">?</span>
      </div>

      <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-foreground-secondary text-base mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          ← Back to the workbench
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-[var(--radius-md)] border border-warm-200 text-foreground-secondary hover:bg-surface-raised transition-colors"
        >
          Search for skills
        </Link>
      </div>
    </main>
  );
}
