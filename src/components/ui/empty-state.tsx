import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  heading: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, heading, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-warm-300">{icon}</div>
      )}

      <h3 className="font-display text-xl font-bold text-foreground mb-2">{heading}</h3>

      <p className="text-sm text-foreground-secondary max-w-sm mb-6">
        {message}
      </p>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-[var(--radius-md)] border border-sketch hover:bg-amber-600 transition-colors"
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
      icon={<ShelfIcon />}
      heading="Nothing on this shelf yet."
      message="Try browsing the workbench or adjusting your search."
      action={{ label: "Browse all skills", href: "/" }}
    />
  );
}

export function EmptyReviewState() {
  return (
    <EmptyState
      icon={<StarOutlineIcon />}
      heading="No reviews yet."
      message="Be the first to rate this tool. Your review helps other makers decide."
    />
  );
}

export function EmptyCategoryState({ category }: { category: string }) {
  return (
    <EmptyState
      icon={<BoxIcon />}
      heading="We're stocking this shelf."
      message={`No ${category} skills yet. Check back soon — or submit one yourself.`}
      action={{ label: "Submit a skill", href: "/submit" }}
    />
  );
}

// ─── Icons ───────────────────────────────────────────────────────

function ShelfIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function StarOutlineIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
