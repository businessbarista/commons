"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="px-2 py-1.5 text-xs font-mono text-foreground-muted hover:text-accent border border-border rounded-[var(--radius-md)] hover:border-accent transition-colors"
    >
      {theme === "dark" ? "// light" : "// dark"}
    </button>
  );
}
