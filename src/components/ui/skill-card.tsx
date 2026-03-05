import Link from "next/link";
import { CategoryTag } from "./category-tag";
import { StarRating } from "./star-rating";
import { Badge } from "./badge";
import type { Category } from "@/lib/schemas";

interface SkillCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  category: Category;
  authorName: string;
  isExpert: boolean;
  averageRating: number;
  reviewCount: number;
  copyCount: number;
}

export function SkillCard({
  name,
  slug,
  shortDescription,
  category,
  authorName,
  isExpert,
  averageRating,
  reviewCount,
  copyCount,
}: SkillCardProps) {
  return (
    <Link
      href={`/skills/${slug}`}
      className="group block bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] p-5 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <CategoryTag category={category} />
        {isExpert && <Badge variant="expert" />}
      </div>

      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-amber-600 transition-colors mb-1.5">
        {name}
      </h3>

      <p className="text-sm text-foreground-secondary line-clamp-2 mb-4">
        {shortDescription}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <StarRating rating={averageRating} count={reviewCount} />
        </div>

        <div className="flex items-center gap-1 text-foreground-muted">
          <CopyIcon />
          <span className="text-xs">{formatCount(copyCount)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-warm-200">
        <span className="text-xs text-foreground-muted">
          by {authorName}
        </span>
      </div>
    </Link>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}
