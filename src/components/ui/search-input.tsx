"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className = "",
      placeholder = "Search the workbench...",
      onSearch,
      onChange,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`relative ${className}`}>
        <SearchIcon />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors"
          onChange={(e) => {
            onChange?.(e);
            onSearch?.(e.target.value);
          }}
          {...props}
        />
        <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-foreground-muted border border-warm-300 rounded font-mono">
          /
        </kbd>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground-muted pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
