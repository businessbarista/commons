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
      className="group flex flex-col bg-surface border border-border rounded-[var(--radius-md)] transition-all hover:opacity-90 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <CategoryTag category={category} />
        <div className="flex items-center gap-1">
          <StarRating rating={averageRating} count={reviewCount} />
          {isExpert && <Badge variant="expert" />}
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 pb-3.5 flex-1">
        <h3 className="text-sm font-semibold text-foreground-secondary group-hover:text-foreground transition-colors leading-snug mb-1.5">
          {name.toLowerCase()}
        </h3>
        <p className="text-[11px] text-foreground-dim leading-relaxed line-clamp-2">
          {shortDescription.toLowerCase()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-border text-[10px] mt-auto">
        <span className="text-foreground-ghost">
          {authorName.toLowerCase().replace(/\s+/g, "_")}
        </span>
        <span className="text-foreground-faint">
          {formatCount(copyCount)} uses
        </span>
      </div>
    </Link>
  );
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}
