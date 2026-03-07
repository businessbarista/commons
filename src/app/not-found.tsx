import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl font-mono font-bold text-foreground-ghost mb-4">404</p>
        <h1 className="font-mono text-xl font-bold text-foreground lowercase mb-3">
          page not found
        </h1>
        <p className="text-sm text-foreground-muted font-mono mb-8">
          the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold font-mono rounded-[var(--radius-md)] bg-accent text-[#0A0A0A] hover:opacity-90 transition-colors"
          >
            ← back to directory
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-mono rounded-[var(--radius-md)] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors"
          >
            search skills
          </Link>
        </div>
      </div>
    </main>
  );
}
