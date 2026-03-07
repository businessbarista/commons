import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submission Received — Commons",
  description: "Your skill submission has been received and is under review.",
};

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-[var(--radius-md)] border border-accent/30 bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-accent text-2xl font-mono font-bold">✓</span>
        </div>

        <h1 className="font-mono text-2xl font-bold text-foreground lowercase mb-3">
          submission received
        </h1>

        <p className="text-sm text-foreground-muted font-mono mb-2">
          thanks for contributing to commons. our team will review your skill
          against the{" "}
          <Link
            href="/rubric"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            quality rubric
          </Link>{" "}
          and get back to you.
        </p>
        <p className="text-xs text-foreground-ghost font-mono mb-8">
          // most reviews are completed within 48 hours
        </p>

        {/* What happens next */}
        <div className="border border-border rounded-[var(--radius-md)] p-5 text-left mb-8 bg-surface">
          <h2 className="text-xs font-mono font-semibold text-foreground mb-3 lowercase">
            // what happens next
          </h2>
          <ol className="text-xs text-foreground-muted font-mono space-y-2.5">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 text-accent font-bold">01</span>
              <span>our team reviews your skill for clarity, usefulness, and formatting.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 text-accent font-bold">02</span>
              <span>if approved, your skill goes live in the directory for everyone to use.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 text-accent font-bold">03</span>
              <span>if changes are needed, we&apos;ll reach out with specific feedback (if you provided an email).</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold font-mono rounded-[var(--radius-md)] bg-accent text-background hover:opacity-90 transition-colors"
          >
            submit another skill
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-mono rounded-[var(--radius-md)] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors"
          >
            ← back to directory
          </Link>
        </div>
      </div>
    </main>
  );
}
