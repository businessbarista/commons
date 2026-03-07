import type { Category } from "@/lib/schemas";

interface CategoryTagProps {
  category: Category;
  size?: "sm" | "md";
}

const categoryLabels: Record<Category, string> = {
  marketing: "MARKETING",
  engineering: "ENGINEERING",
  sales: "SALES",
};

export function CategoryTag({ category, size = "sm" }: CategoryTagProps) {
  const sizeStyles =
    size === "sm"
      ? "text-[9px] tracking-[1.5px]"
      : "text-[10px] tracking-[1.5px]";

  return (
    <span
      className={`inline-flex items-center font-semibold font-mono text-foreground-ghost ${sizeStyles}`}
    >
      {categoryLabels[category]}
    </span>
  );
}
