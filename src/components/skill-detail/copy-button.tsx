"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { trackEvent } from "@/app/actions/usage";

interface CopyButtonProps {
  skillId: string;
  contentMd: string;
}

export function CopyButton({ skillId, contentMd }: CopyButtonProps) {
  const { showToast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contentMd);
      showToast("Copied to your clipboard. Go make something.", {
        variant: "success",
        confetti: true,
      });
      trackEvent(skillId, "copy");
    } catch {
      showToast("Couldn't copy — try selecting the text manually.", {
        variant: "error",
      });
    }
  }, [skillId, contentMd, showToast]);

  return (
    <Button onClick={handleCopy} variant="primary" size="lg">
      <CopyIcon />
      Grab this skill
    </Button>
  );
}

function CopyIcon() {
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
      className="mr-2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
