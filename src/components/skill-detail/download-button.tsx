"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/app/actions/usage";

interface DownloadButtonProps {
  skillId: string;
  slug: string;
  contentMd: string;
}

export function DownloadButton({
  skillId,
  slug,
  contentMd,
}: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([contentMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-commons.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent(skillId, "download");
  }, [skillId, slug, contentMd]);

  return (
    <Button onClick={handleDownload} variant="secondary" size="lg">
      <DownloadIcon />
      Download .md
    </Button>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
