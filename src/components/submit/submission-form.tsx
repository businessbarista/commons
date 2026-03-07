"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitSkill } from "@/app/actions/submissions";

const LLM_OPTIONS = ["Claude", "GPT-4", "GPT-4o", "Gemini", "Llama", "Mistral", "Any"];
const CATEGORIES = [
  { value: "", label: "select a category" },
  { value: "marketing", label: "marketing & growth" },
  { value: "engineering", label: "engineering & product" },
  { value: "sales", label: "sales & gtm" },
];

export function SubmissionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [skillName, setSkillName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [llmTags, setLlmTags] = useState<string[]>([]);
  const [contentMd, setContentMd] = useState("");
  const [exampleOutputText, setExampleOutputText] = useState("");
  const [exampleOutputModel, setExampleOutputModel] = useState("");
  const [isExpert, setIsExpert] = useState(false);
  const [contributorName, setContributorName] = useState("");
  const [contributorUrl, setContributorUrl] = useState("");
  const [contributorBio, setContributorBio] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const toggleTag = (tag: string) => {
    setLlmTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!skillName.trim() || !shortDescription.trim() || !category || !contentMd.trim() || !exampleOutputModel.trim()) {
        setError("please fill in all required fields.");
        return;
      }

      startTransition(async () => {
        const result = await submitSkill({
          skillName: skillName.trim(),
          shortDescription: shortDescription.trim(),
          category: category as "marketing" | "engineering" | "sales",
          llmTags,
          contentMd: contentMd.trim(),
          exampleOutputText: exampleOutputText.trim(),
          exampleOutputModel: exampleOutputModel.trim(),
          contributorName: isExpert ? contributorName.trim() : "",
          contributorUrl: isExpert ? contributorUrl.trim() : "",
          contributorBio: isExpert ? contributorBio.trim() : "",
          contributorEmail: isExpert ? contributorEmail.trim() : "",
          honeypot,
        });

        if (result.success) {
          router.push("/submit/confirmation");
        } else {
          setError(result.error ?? "something went wrong. please try again.");
        }
      });
    },
    [skillName, shortDescription, category, llmTags, contentMd, exampleOutputText, exampleOutputModel, isExpert, contributorName, contributorUrl, contributorBio, contributorEmail, honeypot, router],
  );

  const inputClasses = "w-full px-3 py-2 bg-surface border border-border rounded-[var(--radius-md)] text-sm font-mono text-foreground placeholder:text-foreground-ghost focus:outline-none focus:border-accent transition-colors";
  const labelClasses = "text-xs font-mono font-semibold text-foreground lowercase block mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <div className="border border-error/30 rounded-[var(--radius-md)] px-3 py-2 bg-error/5">
          <p className="text-xs text-error font-mono">{error}</p>
        </div>
      )}

      {/* Skill Name */}
      <div>
        <label className={labelClasses}>
          skill name <span className="text-error">*</span>
        </label>
        <p className="text-xs text-foreground-ghost font-mono mb-1.5">60 characters max</p>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="e.g., cold email personalizer"
          maxLength={60}
          className={inputClasses}
        />
      </div>

      {/* Short Description */}
      <div>
        <label className={labelClasses}>
          short description <span className="text-error">*</span>
        </label>
        <p className="text-xs text-foreground-ghost font-mono mb-1.5">160 characters max</p>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="one line about what this skill does"
          maxLength={160}
          className={inputClasses}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClasses}>
          category <span className="text-error">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClasses}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* LLM Tags */}
      <div>
        <label className={labelClasses}>llm compatibility</label>
        <p className="text-xs text-foreground-ghost font-mono mb-2">select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {LLM_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs font-mono rounded-[var(--radius-md)] border transition-colors ${
                llmTags.includes(tag)
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground-muted hover:border-foreground-muted"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Content Markdown */}
      <div>
        <label className={labelClasses}>
          skill content (.md) <span className="text-error">*</span>
        </label>
        <p className="text-xs text-foreground-ghost font-mono mb-1.5">paste the full skill prompt</p>
        <textarea
          value={contentMd}
          onChange={(e) => setContentMd(e.target.value)}
          placeholder="# Your Skill Name&#10;&#10;You are an expert..."
          rows={8}
          className={`${inputClasses} resize-y`}
        />
      </div>

      {/* Example Output */}
      <div>
        <label className={labelClasses}>example output</label>
        <p className="text-xs text-foreground-ghost font-mono mb-1.5">show a real output from running this skill</p>
        <textarea
          value={exampleOutputText}
          onChange={(e) => setExampleOutputText(e.target.value)}
          placeholder="paste an example of what this skill produces..."
          rows={6}
          className={`${inputClasses} resize-y`}
        />
      </div>

      {/* Model Used */}
      <div>
        <label className={labelClasses}>
          model used for example <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={exampleOutputModel}
          onChange={(e) => setExampleOutputModel(e.target.value)}
          placeholder="e.g., Claude 3.5 Sonnet"
          className={inputClasses}
        />
      </div>

      {/* Expert Contributor Toggle */}
      <div className="border-t border-border pt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isExpert}
            onChange={(e) => setIsExpert(e.target.checked)}
            className="mt-1 accent-accent"
          />
          <div>
            <p className="text-xs font-mono font-semibold text-foreground lowercase">
              i&apos;m an expert contributor
            </p>
            <p className="text-xs text-foreground-ghost font-mono">
              get your name and link featured alongside the skill
            </p>
          </div>
        </label>
      </div>

      {/* Expert Fields */}
      {isExpert && (
        <div className="space-y-4 border border-border rounded-[var(--radius-md)] p-4 bg-surface">
          <div>
            <label className={labelClasses}>your name</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="your full name"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>your url</label>
            <input
              type="url"
              value={contributorUrl}
              onChange={(e) => setContributorUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>short bio</label>
            <input
              type="text"
              value={contributorBio}
              onChange={(e) => setContributorBio(e.target.value)}
              placeholder="one line about your expertise"
              maxLength={500}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>email (for review updates)</label>
            <input
              type="email"
              value={contributorEmail}
              onChange={(e) => setContributorEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputClasses}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center px-6 py-2.5 text-xs font-semibold font-mono rounded-[var(--radius-md)] bg-accent text-background hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {isPending ? "submitting..." : "submit for review"}
        </button>
        <p className="text-xs text-foreground-ghost font-mono">
          // all submissions are reviewed against our{" "}
          <a href="/rubric" className="text-accent underline underline-offset-2">
            quality rubric
          </a>
        </p>
      </div>
    </form>
  );
}
