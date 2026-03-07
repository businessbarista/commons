import { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Quality Rubric — Commons",
  description:
    "The quality rubric we use to evaluate every skill submitted to Commons. Learn what makes a skill worth sharing.",
};

const criteria = [
  {
    title: "specificity",
    score: "0–3",
    description:
      "does the skill target a concrete, repeatable task? vague prompts like 'help me write better' score low. 'generate 10 email subject lines for a B2B SaaS webinar' scores high.",
    examples: {
      low: "help me with marketing",
      high: "generate A/B test variants for pricing page headlines targeting enterprise buyers",
    },
  },
  {
    title: "instructions & structure",
    score: "0–3",
    description:
      "is the skill well-organized with clear sections? we look for a system prompt, input requirements, rules/constraints, and output format. markdown formatting matters.",
    examples: {
      low: "write me a blog post about AI",
      high: "structured prompt with ## sections for task, input, rules, and output format",
    },
  },
  {
    title: "constraints & guardrails",
    score: "0–3",
    description:
      "does the skill include specific rules that improve output quality? character limits, required elements, things to avoid, and scoring criteria all count here.",
    examples: {
      low: "no rules or constraints mentioned",
      high: "numbered rules with specific requirements (e.g., 'keep under 50 chars', 'include 3 different triggers')",
    },
  },
  {
    title: "example output",
    score: "0–3",
    description:
      "does the skill demonstrate what good output looks like? a realistic, well-formatted example helps users understand what to expect and helps the llm calibrate quality.",
    examples: {
      low: "no example or a vague placeholder",
      high: "full realistic example with proper formatting matching the output spec",
    },
  },
  {
    title: "reusability",
    score: "0–3",
    description:
      "can different people use this skill for different inputs and still get great results? skills locked to a single use case score lower than flexible, parameterized ones.",
    examples: {
      low: "only works for one specific product or company",
      high: "works across industries with clear input variables the user customizes",
    },
  },
];

export default function RubricPage() {
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
          <span className="text-foreground-muted">rubric</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-foreground-ghost font-mono mb-2">
            // how we evaluate submissions
          </p>
          <h1 className="font-mono text-2xl font-bold text-foreground lowercase">
            quality rubric
          </h1>
          <p className="mt-2 text-sm text-foreground-muted font-mono">
            every skill submitted to commons is reviewed against these five
            criteria. a skill needs at least{" "}
            <strong className="text-accent">10 out of 15 points</strong> to be
            published.
          </p>
        </div>

        {/* Scoring Overview */}
        <div className="border border-border rounded-[var(--radius-md)] p-5 mb-10 bg-surface">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-mono font-bold text-lg">15</span>
            <h2 className="text-xs font-mono font-semibold text-foreground lowercase">
              // scoring at a glance
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="border border-border rounded-[var(--radius-md)] p-3 bg-surface-raised">
              <p className="text-xl font-mono font-bold text-error">0–6</p>
              <p className="text-xs text-foreground-ghost font-mono mt-1">
                needs significant work
              </p>
            </div>
            <div className="border border-border rounded-[var(--radius-md)] p-3 bg-surface-raised">
              <p className="text-xl font-mono font-bold text-foreground-muted">7–9</p>
              <p className="text-xs text-foreground-ghost font-mono mt-1">
                close — revise and resubmit
              </p>
            </div>
            <div className="border border-border rounded-[var(--radius-md)] p-3 bg-surface-raised">
              <p className="text-xl font-mono font-bold text-accent">10–15</p>
              <p className="text-xs text-foreground-ghost font-mono mt-1">
                published to commons
              </p>
            </div>
          </div>
        </div>

        {/* Criteria */}
        <div className="space-y-8">
          {criteria.map((c, i) => (
            <div key={c.title}>
              <div className="flex items-start gap-4 mb-3">
                <span className="flex-shrink-0 text-accent font-mono font-bold text-sm mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-mono text-sm font-bold text-foreground lowercase">
                      {c.title}
                    </h3>
                    <span className="text-xs font-mono text-accent">
                      [{c.score} pts]
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted font-mono leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              {/* Examples */}
              <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-error/20 rounded-[var(--radius-md)] px-3 py-2.5 bg-error/5">
                  <p className="text-xs font-mono font-semibold text-error mb-1">
                    ✕ low score
                  </p>
                  <p className="text-xs text-foreground-muted font-mono">
                    {c.examples.low}
                  </p>
                </div>
                <div className="border border-accent/20 rounded-[var(--radius-md)] px-3 py-2.5 bg-accent/5">
                  <p className="text-xs font-mono font-semibold text-accent mb-1">
                    ✓ high score
                  </p>
                  <p className="text-xs text-foreground-muted font-mono">
                    {c.examples.high}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-foreground-ghost font-mono mb-4">
            // think your skill meets the bar?
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold font-mono rounded-[var(--radius-md)] bg-accent text-[#0A0A0A] hover:opacity-90 transition-colors"
          >
            submit a skill →
          </Link>
        </div>
      </div>
    </main>
  );
}
