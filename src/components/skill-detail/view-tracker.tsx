"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/app/actions/usage";

interface ViewTrackerProps {
  skillId: string;
}

export function ViewTracker({ skillId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Deduplicate per session: check sessionStorage
    const key = `commons_viewed_${skillId}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      trackEvent(skillId, "view");
    }
  }, [skillId]);

  return null;
}
