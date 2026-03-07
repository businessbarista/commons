import { Metadata } from "next";
import Link from "next/link";
import { SubmissionForm } from "@/components/submit/submission-form";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Submit a Skill — Commons",
  description:
    "Share your best AI prompts and skills with the Commons community. All submissions are reviewed against our quality rubric.",
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <SiteHeader />
        {/* Breadcrumb */}
        <nav className="text-xs font-mono text-foreground-ghost mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground-muted">submit</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-foreground-ghost font-mono mb-2">
            // contribute to the directory
          </p>
          <h1 className="font-mono text-2xl font-bold text-foreground lowercase">
            submit a skill
          </h1>
          <p className="mt-2 text-sm text-foreground-muted font-mono">
            share a skill that helps knowledge workers get more done with ai.
            every submission is reviewed against the{" "}
            <Link
              href="/rubric"
              className="text-accent underline underline-offset-2 hover:opacity-80"
            >
              quality rubric
            </Link>{" "}
            before it goes live.
          </p>
        </div>

        {/* Guidelines */}
        <div className="border border-border rounded-[var(--radius-md)] p-4 mb-8 bg-surface">
          <h2 className="text-xs font-mono font-semibold text-foreground mb-2 lowercase">
            // what makes a good skill?
          </h2>
          <ul className="text-xs text-foreground-muted font-mono space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              solves a specific, repeatable task for knowledge workers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              includes clear instructions that any llm can follow
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              shows a real example output so users know what to expect
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              written in markdown with proper headings and formatting
            </li>
          </ul>
        </div>

        {/* Form */}
        <SubmissionForm />
      </div>
    </main>
  );
}
