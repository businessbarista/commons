import Link from "next/link";

interface EmptyStateProps {
  prefix?: string;
  heading: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ prefix = "//", heading, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-foreground-ghost font-mono text-2xl mb-4">{prefix}</span>

      <h3 className="font-mono text-sm font-semibold text-foreground-secondary mb-2">
        {heading}
      </h3>

      <p className="text-xs text-foreground-muted font-mono max-w-sm mb-6">
        {message}
      </p>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center px-4 py-2 bg-accent text-background text-xs font-semibold font-mono rounded-[var(--radius-md)] hover:opacity-90 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// ─── Pre-built empty states for common scenarios ─────────────────

export function EmptySearchState() {
  return (
    <EmptyState
      prefix="??"
      heading="nothing found."
      message="try browsing the directory or adjusting your search."
      action={{ label: "browse all skills", href: "/" }}
    />
  );
}

export function EmptyReviewState() {
  return (
    <EmptyState
      prefix="**"
      heading="no reviews yet."
      message="be the first to rate this skill. your review helps other users decide."
    />
  );
}

export function EmptyCategoryState({ category }: { category: string }) {
  return (
    <EmptyState
      prefix=">>"
      heading="no skills here yet."
      message={`no ${category.toLowerCase()} skills yet. check back soon — or submit one yourself.`}
      action={{ label: "submit a skill", href: "/submit" }}
    />
  );
}
