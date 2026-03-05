"use client";

export type SortOption = "most-used" | "highest-rated" | "newest" | "trending";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "most-used", label: "Most Used" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort skills by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none pl-3 pr-8 py-2 bg-transparent border-[1.5px] border-sketch rounded-[var(--radius-md)] text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
