"use client";

import { useCallback, useState, useTransition } from "react";
import {
  getPendingSubmissions,
  reviewSubmission,
  type SubmissionRow,
} from "@/app/actions/review-queue";

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
          setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
          setExpandedId(null);
          setSuccessMsg(
            `submission ${status === "approved" ? "approved & published" : "rejected"}.`,
          );
          setTimeout(() => setSuccessMsg(null), 3000);
        } else {
          setError(result.error ?? "something went wrong.");
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
        <p className="text-accent-fg font-mono font-bold text-lg mb-2">✓</p>
        <p className="text-sm text-foreground-muted font-mono">
          all caught up — no pending submissions.
        </p>
        <button
          onClick={refresh}
          disabled={isPending}
          className="mt-4 text-xs text-accent-fg font-mono underline underline-offset-2 hover:opacity-80"
        >
          {isPending ? "refreshing..." : "refresh"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-foreground-ghost font-mono">
          {submissions.length} pending submission
          {submissions.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={refresh}
          disabled={isPending}
          className="text-xs text-accent-fg font-mono underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
        >
          {isPending ? "refreshing..." : "refresh"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="border border-error/30 rounded-[var(--radius-md)] px-3 py-2 mb-4 bg-error/5">
          <p className="text-xs text-error font-mono">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="border border-accent/30 rounded-[var(--radius-md)] px-3 py-2 mb-4 bg-accent/5">
          <p className="text-xs text-accent-fg font-mono">{successMsg}</p>
        </div>
      )}

      {/* Submission list */}
      <div className="space-y-2">
        {submissions.map((sub) => {
          const isExpanded = expandedId === sub.id;
          const isReviewing = reviewingId === sub.id;

          return (
            <div
              key={sub.id}
              className="border border-border rounded-[var(--radius-md)] bg-surface overflow-hidden"
            >
              {/* Header row */}
              <button
                onClick={() => toggleExpand(sub.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-surface-raised transition-colors"
              >
                <span
                  className={`text-xs text-foreground-ghost transition-transform ${isExpanded ? "rotate-90" : ""}`}
                >
                  ▸
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono font-semibold text-foreground truncate block lowercase">
                    {sub.skillName}
                  </span>
                  <span className="text-xs font-mono text-foreground-ghost">
                    {sub.shortDescription}
                  </span>
                </div>
                <span className="text-xs font-mono text-accent-fg">
                  [{sub.category}]
                </span>
                <span className="text-xs font-mono text-foreground-ghost whitespace-nowrap">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 py-3 text-xs font-mono text-foreground-ghost border-b border-border mb-3">
                    {sub.contributorName && (
                      <span>
                        by:{" "}
                        {sub.contributorUrl ? (
                          <a
                            href={sub.contributorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-fg underline underline-offset-2"
                          >
                            {sub.contributorName}
                          </a>
                        ) : (
                          sub.contributorName
                        )}
                      </span>
                    )}
                    {sub.contributorEmail && (
                      <span>email: {sub.contributorEmail}</span>
                    )}
                    {sub.llmTags.length > 0 && (
                      <span>llms: {sub.llmTags.join(", ")}</span>
                    )}
                    <span>model: {sub.exampleOutputModel}</span>
                  </div>

                  {/* Skill content */}
                  <div className="mb-4">
                    <h3 className="text-xs font-mono font-semibold text-foreground-ghost uppercase tracking-wider mb-2">
                      // skill content
                    </h3>
                    <pre className="text-xs text-foreground-secondary bg-surface-raised rounded-[var(--radius-md)] p-3 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap font-mono border border-border">
                      {sub.contentMd}
                    </pre>
                  </div>

                  {/* Example output */}
                  {sub.exampleOutputText && (
                    <div className="mb-4">
                      <h3 className="text-xs font-mono font-semibold text-foreground-ghost uppercase tracking-wider mb-2">
                        // example output
                      </h3>
                      <pre className="text-xs text-foreground-secondary bg-surface-raised rounded-[var(--radius-md)] p-3 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap font-mono border border-border">
                        {sub.exampleOutputText}
                      </pre>
                    </div>
                  )}

                  {/* Reviewer notes */}
                  <div className="mb-4">
                    <label className="text-xs font-mono font-semibold text-foreground-ghost uppercase tracking-wider block mb-1.5">
                      // reviewer notes (optional)
                    </label>
                    <textarea
                      value={notes[sub.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="internal notes..."
                      rows={2}
                      className="w-full px-3 py-2 bg-surface-raised border border-border rounded-[var(--radius-md)] text-xs font-mono text-foreground placeholder:text-foreground-ghost focus:outline-none focus:border-accent transition-colors resize-y"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReview(sub.id, "approved")}
                      disabled={isReviewing || isPending}
                      className="px-4 py-2 text-xs font-mono font-semibold rounded-[var(--radius-md)] bg-accent text-[#0A0A0A] hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      {isReviewing ? "processing..." : "✓ approve & publish"}
                    </button>
                    <button
                      onClick={() => handleReview(sub.id, "rejected")}
                      disabled={isReviewing || isPending}
                      className="px-4 py-2 text-xs font-mono font-semibold rounded-[var(--radius-md)] bg-error text-white hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      {isReviewing ? "processing..." : "✕ reject"}
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
