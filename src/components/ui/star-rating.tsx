"use client";

import { useState } from "react";

interface StarRatingDisplayProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

interface StarRatingInteractiveProps {
  value: number;
  onChange: (rating: number) => void;
  size?: "sm" | "md";
}

type StarRatingProps =
  | (StarRatingDisplayProps & { interactive?: false })
  | (StarRatingInteractiveProps & { interactive: true });

const sizeMap = {
  sm: "text-[10px]",
  md: "text-sm",
};

export function StarRating(props: StarRatingProps) {
  const size = props.size ?? "sm";

  if (props.interactive) {
    return <InteractiveStars {...props} size={size} />;
  }

  return <DisplayStars {...props} size={size} />;
}

function DisplayStars({
  rating,
  count,
  size,
}: StarRatingDisplayProps & { size: "sm" | "md" }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="inline-flex items-center gap-1">
      <span
        className={`font-mono text-accent-fg ${sizeMap[size]}`}
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {"*".repeat(fullStars)}
        {hasHalf && fullStars < 5 ? "·" : ""}
        {"·".repeat(Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0)))}
      </span>
      {count !== undefined && (
        <span className="text-[10px] text-foreground-ghost font-mono ml-0.5">
          ({count})
        </span>
      )}
    </div>
  );
}

function InteractiveStars({
  value,
  onChange,
  size,
}: StarRatingInteractiveProps & { size: "sm" | "md" }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="inline-flex gap-0.5"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered || value);

        return (
          <button
            key={i}
            type="button"
            className={`p-0.5 cursor-pointer font-mono transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-sm ${sizeMap[size]} ${
              isActive ? "text-accent-fg" : "text-foreground-ghost"
            }`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
            role="radio"
            aria-checked={starValue === value}
          >
            *
          </button>
        );
      })}
    </div>
  );
}
