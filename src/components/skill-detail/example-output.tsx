"use client";

import { useState } from "react";
import { SkillContent } from "./skill-content";

interface ExampleOutputProps {
  skillContent: string;
  exampleOutputText: string | null;
  exampleOutputImageUrl: string | null;
  exampleOutputModel: string;
}

export function ExampleOutput({
  skillContent,
  exampleOutputText,
  exampleOutputImageUrl,
  exampleOutputModel,
}: ExampleOutputProps) {
  const [activeTab, setActiveTab] = useState<"skill" | "example">("skill");
  const hasExample = exampleOutputText || exampleOutputImageUrl;

  if (!hasExample) {
    return (
      <div className="bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] p-6">
        <SkillContent content={skillContent} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Side-by-side */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4">
        <div className="bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] p-6 overflow-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-warm-100">
            <FileIcon />
            <span className="text-sm font-medium text-foreground">
              Skill Content
            </span>
          </div>
          <SkillContent content={skillContent} />
        </div>

        <div className="bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-warm-100">
            <div className="flex items-center gap-2">
              <OutputIcon />
              <span className="text-sm font-medium text-foreground">
                Example Output
              </span>
            </div>
            <span className="text-xs text-foreground-muted border border-sketch/30 px-2 py-0.5 rounded">
              {exampleOutputModel}
            </span>
          </div>
          {exampleOutputText && <SkillContent content={exampleOutputText} />}
          {exampleOutputImageUrl && (
            <img
              src={exampleOutputImageUrl}
              alt="Example output"
              className="rounded-[var(--radius-sm)] max-w-full"
            />
          )}
        </div>
      </div>

      {/* Mobile: Tabbed */}
      <div className="lg:hidden">
        <div className="flex border-b border-warm-200 mb-4">
          <button
            onClick={() => setActiveTab("skill")}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              activeTab === "skill"
                ? "text-amber-700 border-b-2 border-amber-500"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Skill Content
          </button>
          <button
            onClick={() => setActiveTab("example")}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              activeTab === "example"
                ? "text-amber-700 border-b-2 border-amber-500"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            Example Output
          </button>
        </div>

        <div className="bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] p-5">
          {activeTab === "skill" ? (
            <SkillContent content={skillContent} />
          ) : (
            <>
              <div className="flex items-center justify-end mb-3">
                <span className="text-xs text-foreground-muted border border-sketch/30 px-2 py-0.5 rounded">
                  {exampleOutputModel}
                </span>
              </div>
              {exampleOutputText && (
                <SkillContent content={exampleOutputText} />
              )}
              {exampleOutputImageUrl && (
                <img
                  src={exampleOutputImageUrl}
                  alt="Example output"
                  className="rounded-[var(--radius-sm)] max-w-full"
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground-muted"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function OutputIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground-muted"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
