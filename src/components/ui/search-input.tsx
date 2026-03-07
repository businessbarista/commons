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
      placeholder = "search skills...",
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
          className="w-full pl-9 pr-10 py-2 bg-surface border border-border-subtle rounded-[var(--radius-md)] text-sm text-foreground placeholder:text-foreground-ghost font-mono focus:outline-none focus:border-accent/40 transition-colors"
          onChange={(e) => {
            onChange?.(e);
            onSearch?.(e.target.value);
          }}
          {...props}
        />
        <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center px-1.5 py-0.5 text-[11px] text-foreground-faint font-mono">
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
      className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-ghost pointer-events-none"
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
