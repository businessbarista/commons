import type { Category } from "@/lib/schemas";

interface CategoryTagProps {
  category: Category;
  size?: "sm" | "md";
}

const categoryConfig: Record<
  Category,
  { label: string; text: string; dot: string }
> = {
  marketing: {
    label: "Marketing & Growth",
    text: "text-marketing",
    dot: "bg-marketing",
  },
  engineering: {
    label: "Engineering & Product",
    text: "text-engineering",
    dot: "bg-engineering",
  },
  sales: {
    label: "Sales & GTM",
    text: "text-sales",
    dot: "bg-sales",
  },
};

export function CategoryTag({ category, size = "sm" }: CategoryTagProps) {
  const config = categoryConfig[category];
  const sizeStyles =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-sm)] border border-sketch/30 ${config.text} ${sizeStyles}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`}
      />
      {config.label}
    </span>
  );
}
