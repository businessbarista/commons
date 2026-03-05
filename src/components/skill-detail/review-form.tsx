"use client";

import { useCallback, useState, useTransition } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { submitReview, type ReviewActionResult } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  skillId: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("commons_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("commons_session_id", id);
  }
  return id;
}

export function ReviewForm({ skillId }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const charCount = text.length;
  const isValid = rating >= 1 && rating <= 5 && charCount >= 20 && charCount <= 2000;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;

      setError(null);

      startTransition(async () => {
        const result: ReviewActionResult = await submitReview({
          skillId,
          starRating: rating,
          reviewText: text,
          sessionId: getSessionId(),
        });

        if (result.success) {
          setSubmitted(true);
          setRating(0);
          setText("");
          router.refresh();
        } else {
          setError(result.error ?? "Something went wrong.");
        }
      });
    },
    [skillId, rating, text, isValid, router],
  );

  if (submitted) {
    return (
      <div className="border-[1.5px] border-success/40 rounded-[var(--radius-md)] p-4 text-center">
        <p className="text-sm font-medium text-success">
          Thanks for the review! Your feedback helps other makers.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-xs text-foreground-muted hover:text-foreground underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          How&apos;s this tool?
        </label>
        <StarRating
          interactive
          value={rating}
          onChange={setRating}
          size="md"
        />
        {rating === 0 && (
          <p className="text-xs text-foreground-muted mt-1">
            Tap a star to rate
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-text"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Your review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you think? Be specific — it helps other makers decide."
          rows={3}
          maxLength={2000}
          className="w-full px-3 py-2 bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] text-sm text-foreground placeholder:text-foreground-muted resize-y focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors"
        />
        <div className="flex items-center justify-between mt-1">
          <p
            className={`text-xs ${charCount < 20 ? "text-foreground-muted" : "text-success"}`}
          >
            {charCount < 20
              ? `${20 - charCount} more characters needed`
              : `${charCount}/2000`}
          </p>
        </div>
      </div>

      {error && (
        <div className="border-[1.5px] border-error/40 rounded-[var(--radius-md)] px-3 py-2">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={!isValid || isPending}
      >
        {isPending ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
