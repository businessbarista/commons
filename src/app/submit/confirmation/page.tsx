import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submission Received — Commons",
  description: "Your skill submission has been received and is under review.",
};

export default function ConfirmationPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-success"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-3">
        Submission received
      </h1>

      {/* Description */}
      <p className="text-foreground-secondary text-base leading-relaxed mb-2">
        Thanks for contributing to Commons! Our team will review your skill
        against the{" "}
        <Link
          href="/rubric"
          className="text-amber-700 underline underline-offset-2 hover:text-amber-800"
        >
          quality rubric
        </Link>{" "}
        and get back to you.
      </p>
      <p className="text-foreground-muted text-sm mb-8">
        Most reviews are completed within 48 hours.
      </p>

      {/* What happens next */}
      <div className="bg-surface-raised border border-warm-200 rounded-[var(--radius-md)] p-5 text-left mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          What happens next?
        </h2>
        <ol className="text-sm text-foreground-secondary space-y-2.5">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
              1
            </span>
            <span>
              Our team reviews your skill for clarity, usefulness, and
              formatting.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
              2
            </span>
            <span>
              If approved, your skill goes live in the directory for everyone to
              use.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
              3
            </span>
            <span>
              If changes are needed, we&apos;ll reach out with specific feedback
              (if you provided an email).
            </span>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/submit"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          Submit another skill
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-[var(--radius-md)] border border-warm-200 text-foreground-secondary hover:bg-surface-raised transition-colors"
        >
          ← Back to the workbench
        </Link>
      </div>
    </main>
  );
}
