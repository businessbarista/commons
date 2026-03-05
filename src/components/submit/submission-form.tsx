"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  submitSkill,
  type SubmissionActionResult,
} from "@/app/actions/submissions";

const LLM_OPTIONS = ["Claude", "GPT-4", "GPT-4o", "Gemini", "Llama", "Mistral", "Any"];

const CATEGORY_OPTIONS = [
  { value: "marketing", label: "Marketing & Growth" },
  { value: "engineering", label: "Engineering & Product" },
  { value: "sales", label: "Sales & GTM" },
] as const;

export function SubmissionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isExpert, setIsExpert] = useState(false);

  const [form, setForm] = useState({
    skillName: "",
    shortDescription: "",
    category: "" as "marketing" | "engineering" | "sales" | "",
    llmTags: [] as string[],
    contentMd: "",
    exampleOutputText: "",
    exampleOutputModel: "",
    contributorName: "",
    contributorUrl: "",
    contributorBio: "",
    contributorEmail: "",
    honeypot: "",
  });

  const updateField = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLlmTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      llmTags: prev.llmTags.includes(tag)
        ? prev.llmTags.filter((t) => t !== tag)
        : [...prev.llmTags, tag],
    }));
  };

  const isValid =
    form.skillName.length > 0 &&
    form.shortDescription.length > 0 &&
    form.category !== "" &&
    form.contentMd.length > 0 &&
    form.exampleOutputModel.length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || !form.category) return;

      setError(null);
      startTransition(async () => {
        const result: SubmissionActionResult = await submitSkill({
          skillName: form.skillName,
          shortDescription: form.shortDescription,
          category: form.category as "marketing" | "engineering" | "sales",
          llmTags: form.llmTags,
          contentMd: form.contentMd,
          exampleOutputText: form.exampleOutputText,
          exampleOutputModel: form.exampleOutputModel,
          contributorName: form.contributorName || undefined,
          contributorUrl: form.contributorUrl || undefined,
          contributorBio: form.contributorBio || undefined,
          contributorEmail: form.contributorEmail || undefined,
          honeypot: form.honeypot,
        });

        if (result.success) {
          router.push("/submit/confirmation");
        } else {
          setError(result.error ?? "Something went wrong.");
        }
      });
    },
    [form, isValid, router],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Honeypot — hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          value={form.honeypot}
          onChange={(e) => updateField("honeypot", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Skill Name */}
      <Field label="Skill name" required hint="60 characters max">
        <input
          type="text"
          maxLength={60}
          value={form.skillName}
          onChange={(e) => updateField("skillName", e.target.value)}
          placeholder="e.g., Cold Email Personalizer"
          className={inputClass}
        />
      </Field>

      {/* Short Description */}
      <Field label="Short description" required hint="160 characters max">
        <input
          type="text"
          maxLength={160}
          value={form.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          placeholder="One line about what this skill does"
          className={inputClass}
        />
      </Field>

      {/* Category */}
      <Field label="Category" required>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* LLM Compatibility */}
      <Field label="LLM compatibility" hint="Select all that apply">
        <div className="flex flex-wrap gap-2">
          {LLM_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleLlmTag(tag)}
              className={`px-3 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors ${
                form.llmTags.includes(tag)
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-transparent text-foreground-secondary border-sketch/50 hover:border-sketch"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </Field>

      {/* Skill Content */}
      <Field label="Skill content (.md)" required hint="Paste the full skill prompt">
        <textarea
          value={form.contentMd}
          onChange={(e) => updateField("contentMd", e.target.value)}
          placeholder="# Your Skill Name&#10;&#10;You are an expert..."
          rows={10}
          className={`${inputClass} font-mono text-sm resize-y`}
        />
      </Field>

      {/* Example Output */}
      <Field
        label="Example output"
        hint="Show a real output from running this skill"
      >
        <textarea
          value={form.exampleOutputText}
          onChange={(e) => updateField("exampleOutputText", e.target.value)}
          placeholder="Paste an example of what this skill produces when run through an LLM..."
          rows={6}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Model Used */}
      <Field label="Model used for example" required>
        <input
          type="text"
          value={form.exampleOutputModel}
          onChange={(e) => updateField("exampleOutputModel", e.target.value)}
          placeholder="e.g., Claude 3.5 Sonnet"
          className={inputClass}
        />
      </Field>

      {/* Expert Toggle */}
      <div className="border-t border-warm-300 pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isExpert}
            onChange={(e) => setIsExpert(e.target.checked)}
            className="w-4 h-4 rounded border-warm-300 text-amber-500 focus:ring-amber-400"
          />
          <div>
            <span className="text-sm font-medium text-foreground">
              I&apos;m an expert contributor
            </span>
            <p className="text-xs text-foreground-muted">
              Get your name and link featured alongside the skill
            </p>
          </div>
        </label>
      </div>

      {/* Expert Fields (conditional) */}
      {isExpert && (
        <div className="space-y-4 pl-7 border-l-2 border-amber-200">
          <Field label="Your name">
            <input
              type="text"
              maxLength={100}
              value={form.contributorName}
              onChange={(e) => updateField("contributorName", e.target.value)}
              placeholder="Alex Lieberman"
              className={inputClass}
            />
          </Field>
          <Field label="Your URL">
            <input
              type="url"
              value={form.contributorUrl}
              onChange={(e) => updateField("contributorUrl", e.target.value)}
              placeholder="https://twitter.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Short bio" hint="100 characters max">
            <input
              type="text"
              maxLength={100}
              value={form.contributorBio}
              onChange={(e) => updateField("contributorBio", e.target.value)}
              placeholder="Co-founder of Morning Brew"
              className={inputClass}
            />
          </Field>
          <Field label="Email" hint="For rejection notifications only — never shared">
            <input
              type="email"
              value={form.contributorEmail}
              onChange={(e) => updateField("contributorEmail", e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border-[1.5px] border-error/40 rounded-[var(--radius-md)] px-3 py-2">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={!isValid || isPending}>
          {isPending ? "Submitting..." : "Submit for review"}
        </Button>
        <p className="text-xs text-foreground-muted">
          All submissions are reviewed against our{" "}
          <a href="/rubric" className="underline underline-offset-2 hover:text-foreground">
            quality rubric
          </a>
        </p>
      </div>
    </form>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-foreground-muted mb-1.5">{hint}</p>
      )}
      {children}
    </div>
  );
}
