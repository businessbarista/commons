import { Metadata } from "next";
import Link from "next/link";
import { SubmissionForm } from "@/components/submit/submission-form";

export const metadata: Metadata = {
  title: "Submit a Skill — Commons",
  description:
    "Share your best AI prompts and skills with the Commons community. All submissions are reviewed against our quality rubric.",
};

export default function SubmitPage() {
  return (
    <main className="notebook-lines min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-foreground-muted mb-8">
        <Link
          href="/"
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          Workbench
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Submit a skill</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
          Submit a skill
        </h1>
        <p className="mt-2 text-foreground-secondary text-base leading-relaxed">
          Share a skill that helps knowledge workers get more done with AI.
          Every submission is reviewed by our team against the{" "}
          <Link
            href="/rubric"
            className="text-amber-700 underline underline-offset-2 hover:text-amber-800"
          >
            quality rubric
          </Link>{" "}
          before it goes live.
        </p>
      </div>

      {/* Guidelines */}
      <div className="border-[1.5px] border-sketch rounded-[var(--radius-md)] p-4 mb-8">
        <h2 className="font-display text-base font-bold text-foreground mb-2">
          What makes a good skill?
        </h2>
        <ul className="text-sm text-foreground-secondary space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            Solves a specific, repeatable task for knowledge workers
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            Includes clear instructions that any LLM can follow
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            Shows a real example output so users know what to expect
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            Written in Markdown with proper headings and formatting
          </li>
        </ul>
      </div>

      {/* Form */}
      <SubmissionForm />
      </div>
    </main>
  );
}
