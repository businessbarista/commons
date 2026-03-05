"use client";

import { useCallback, useState, useTransition } from "react";
import {
  getPendingSubmissions,
  reviewSubmission,
  type SubmissionRow,
} from "@/app/actions/review-queue";
import { CategoryTag } from "@/components/ui/category-tag";

interface Props {
  secret: string;
  initialSubmissions: SubmissionRow[];
}

export function ReviewQueueClient({ secret, initialSubmissions }: Props) {
  const [submissions, setSubmissions] =
    useState<SubmissionRow[]>(initialSubmissions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleReview = useCallback(
    (submissionId: string, status: "approved" | "rejected") => {
      setError(null);
      setSuccessMsg(null);
      setReviewingId(submissionId);

      startTransition(async () => {
        const result = await reviewSubmission(secret, submissionId, {
          status,
          reviewerNotes: notes[submissionId] || undefined,
        });

        if (result.success) {
          // Remove from list
          setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
          setExpandedId(null);
          setSuccessMsg(
            `Submission ${status === "approved" ? "approved & published" : "rejected"}.`,
          );
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setError(result.error ?? "Something went wrong.");
        }
        setReviewingId(null);
      });
    },
    [secret, notes],
  );

  const refresh = useCallback(() => {
    startTransition(async () => {
      const fresh = await getPendingSubmissions(secret);
      setSubmissions(fresh);
    });
  }, [secret]);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-success"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="text-foreground-secondary font-medium">
          All caught up — no pending submissions.
        </p>
        <button
          onClick={refresh}
          disabled={isPending}
          className="mt-4 text-sm text-amber-700 underline underline-offset-2 hover:text-amber-800"
        >
          {isPending ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-foreground-muted">
          {submissions.length} pending submission
          {submissions.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={refresh}
          disabled={isPending}
          className="text-sm text-amber-700 underline underline-offset-2 hover:text-amber-800 disabled:opacity-50"
        >
          {isPending ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-[#FDECEB] border border-error/20 rounded-[var(--radius-md)] px-3 py-2 mb-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="bg-success/5 border border-success/20 rounded-[var(--radius-md)] px-3 py-2 mb-4">
          <p className="text-sm text-success">{successMsg}</p>
        </div>
      )}

      {/* Submission list */}
      <div className="space-y-3">
        {submissions.map((sub) => {
          const isExpanded = expandedId === sub.id;
          const isReviewing = reviewingId === sub.id;

          return (
            <div
              key={sub.id}
              className="border border-warm-200 rounded-[var(--radius-md)] bg-surface-raised overflow-hidden"
            >
              {/* Header row */}
              <button
                onClick={() => toggleExpand(sub.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-warm-50 transition-colors"
              >
                <svg
                  className={`w-4 h-4 text-foreground-muted flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate block">
                    {sub.skillName}
                  </span>
                  <span className="text-xs text-foreground-muted">
                    {sub.shortDescription}
                  </span>
                </div>
                <CategoryTag category={sub.category} />
                <span className="text-xs text-foreground-muted whitespace-nowrap">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-warm-200">
                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 py-3 text-xs text-foreground-muted border-b border-warm-100 mb-3">
                    {sub.contributorName && (
                      <span>
                        By:{" "}
                        {sub.contributorUrl ? (
                          <a
                            href={sub.contributorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 underline underline-offset-2"
                          >
                            {sub.contributorName}
                          </a>
                        ) : (
                          sub.contributorName
                        )}
                      </span>
                    )}
                    {sub.contributorEmail && (
                      <span>Email: {sub.contributorEmail}</span>
                    )}
                    {sub.llmTags.length > 0 && (
                      <span>LLMs: {sub.llmTags.join(", ")}</span>
                    )}
                    <span>Model: {sub.exampleOutputModel}</span>
                  </div>

                  {/* Skill content */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
                      Skill Content
                    </h3>
                    <pre className="text-xs text-foreground bg-warm-50 rounded-[var(--radius-md)] p-3 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
                      {sub.contentMd}
                    </pre>
                  </div>

                  {/* Example output */}
                  {sub.exampleOutputText && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
                        Example Output
                      </h3>
                      <pre className="text-xs text-foreground bg-warm-50 rounded-[var(--radius-md)] p-3 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {sub.exampleOutputText}
                      </pre>
                    </div>
                  )}

                  {/* Reviewer notes */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block mb-1.5">
                      Reviewer Notes (optional)
                    </label>
                    <textarea
                      value={notes[sub.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="Internal notes about this submission..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-warm-200 rounded-[var(--radius-md)] text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors resize-y"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReview(sub.id, "approved")}
                      disabled={isReviewing || isPending}
                      className="px-4 py-2 text-sm font-semibold rounded-[var(--radius-md)] bg-success text-white hover:bg-success/90 transition-colors disabled:opacity-50"
                    >
                      {isReviewing ? "Processing..." : "✓ Approve & Publish"}
                    </button>
                    <button
                      onClick={() => handleReview(sub.id, "rejected")}
                      disabled={isReviewing || isPending}
                      className="px-4 py-2 text-sm font-semibold rounded-[var(--radius-md)] bg-error text-white hover:bg-error/90 transition-colors disabled:opacity-50"
                    >
                      {isReviewing ? "Processing..." : "✕ Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
