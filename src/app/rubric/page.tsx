import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quality Rubric — Commons",
  description:
    "The quality rubric we use to evaluate every skill submitted to Commons. Learn what makes a skill worth sharing.",
};

const criteria = [
  {
    title: "Specificity",
    score: "0–3",
    description:
      "Does the skill target a concrete, repeatable task? Vague prompts like 'help me write better' score low. 'Generate 10 email subject lines for a B2B SaaS webinar' scores high.",
    examples: {
      low: "Help me with marketing",
      high: "Generate A/B test variants for pricing page headlines targeting enterprise buyers",
    },
  },
  {
    title: "Instructions & Structure",
    score: "0–3",
    description:
      "Is the skill well-organized with clear sections? We look for a system prompt, input requirements, rules/constraints, and output format. Markdown formatting matters.",
    examples: {
      low: "Write me a blog post about AI",
      high: "Structured prompt with ## sections for Task, Input, Rules, and Output Format",
    },
  },
  {
    title: "Constraints & Guardrails",
    score: "0–3",
    description:
      "Does the skill include specific rules that improve output quality? Character limits, required elements, things to avoid, and scoring criteria all count here.",
    examples: {
      low: "No rules or constraints mentioned",
      high: "Numbered rules with specific requirements (e.g., 'Keep under 50 chars', 'Include 3 different triggers')",
    },
  },
  {
    title: "Example Output",
    score: "0–3",
    description:
      "Does the skill demonstrate what good output looks like? A realistic, well-formatted example helps users understand what to expect and helps the LLM calibrate quality.",
    examples: {
      low: "No example or a vague placeholder",
      high: "Full realistic example with proper formatting matching the output spec",
    },
  },
  {
    title: "Reusability",
    score: "0–3",
    description:
      "Can different people use this skill for different inputs and still get great results? Skills locked to a single use case score lower than flexible, parameterized ones.",
    examples: {
      low: "Only works for one specific product or company",
      high: "Works across industries with clear input variables the user customizes",
    },
  },
];

export default function RubricPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-foreground-muted mb-8">
        <Link
          href="/"
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          Workbench
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Quality Rubric</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Quality Rubric
        </h1>
        <p className="mt-2 text-foreground-secondary text-base leading-relaxed">
          Every skill submitted to Commons is reviewed against these five
          criteria. A skill needs at least{" "}
          <strong className="text-foreground">10 out of 15 points</strong> to be
          published. Here&apos;s what we look for.
        </p>
      </div>

      {/* Scoring Overview */}
      <div className="bg-surface-raised border border-warm-200 rounded-[var(--radius-md)] p-5 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-700 font-bold text-sm">15</span>
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Scoring at a glance
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-[var(--radius-md)] border border-warm-100 p-3">
            <p className="text-2xl font-extrabold text-error">0–6</p>
            <p className="text-xs text-foreground-muted mt-1">
              Needs significant work
            </p>
          </div>
          <div className="bg-white rounded-[var(--radius-md)] border border-warm-100 p-3">
            <p className="text-2xl font-extrabold text-amber-600">7–9</p>
            <p className="text-xs text-foreground-muted mt-1">
              Close — revise and resubmit
            </p>
          </div>
          <div className="bg-white rounded-[var(--radius-md)] border border-warm-100 p-3">
            <p className="text-2xl font-extrabold text-success">10–15</p>
            <p className="text-xs text-foreground-muted mt-1">
              Published to Commons
            </p>
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div className="space-y-8">
        {criteria.map((c, i) => (
          <div key={c.title} className="group">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground-secondary">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {c.title}
                  </h3>
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {c.score} pts
                  </span>
                </div>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>

            {/* Examples */}
            <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#FDECEB]/50 border border-error/10 rounded-[var(--radius-md)] px-3 py-2.5">
                <p className="text-xs font-semibold text-error mb-1">
                  ✕ Low score
                </p>
                <p className="text-xs text-foreground-secondary">
                  {c.examples.low}
                </p>
              </div>
              <div className="bg-success/5 border border-success/10 rounded-[var(--radius-md)] px-3 py-2.5">
                <p className="text-xs font-semibold text-success mb-1">
                  ✓ High score
                </p>
                <p className="text-xs text-foreground-secondary">
                  {c.examples.high}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 pt-8 border-t border-warm-200 text-center">
        <p className="text-foreground-secondary text-sm mb-4">
          Think your skill meets the bar?
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-amber-500 text-white hover:bg-amber-600 transition-colors"
        >
          Submit a skill →
        </Link>
      </div>
    </main>
  );
}
