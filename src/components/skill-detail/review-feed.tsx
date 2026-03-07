import { StarRating } from "@/components/ui/star-rating";
import { EmptyReviewState } from "@/components/ui/empty-state";
import type { SkillReview } from "@/app/actions/skills";

interface ReviewFeedProps {
  reviews: SkillReview[];
  averageRating: number;
  reviewCount: number;
}

export function ReviewFeed({
  reviews,
  averageRating,
  reviewCount,
}: ReviewFeedProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-xl font-bold text-foreground">
          How&apos;s this tool?
        </h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="md" />
            <span className="text-sm text-foreground-muted">
              {averageRating.toFixed(1)} ({reviewCount}{" "}
              {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyReviewState />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-transparent border-[1.5px] border-border rounded-[var(--radius-md)] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={review.starRating} />
                <time
                  dateTime={review.createdAt.toISOString()}
                  className="text-xs text-foreground-muted"
                >
                  {formatDate(review.createdAt)}
                </time>
              </div>
              <p className="text-sm text-foreground-secondary">
                {review.reviewText}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
