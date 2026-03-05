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
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
};

function StarIcon({
  filled,
  half,
  size,
  className = "",
}: {
  filled: boolean;
  half?: boolean;
  size: "sm" | "md";
  className?: string;
}) {
  const sizeClass = sizeMap[size];

  if (half) {
    return (
      <svg
        viewBox="0 0 20 20"
        className={`${sizeClass} ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="url(#halfStar)"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-error"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "1.5"}
      className={`${sizeClass} ${filled ? "text-error" : "text-warm-300"} ${className}`}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

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
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            filled={i < fullStars || (roundedUp && i === fullStars)}
            half={hasHalf && i === fullStars}
            size={size}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-foreground-muted ml-0.5">
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
      className="inline-flex"
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
            className="p-0.5 cursor-pointer transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
            role="radio"
            aria-checked={starValue === value}
          >
            <StarIcon filled={isActive} size={size} />
          </button>
        );
      })}
    </div>
  );
}
