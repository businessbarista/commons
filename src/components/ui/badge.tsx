interface BadgeProps {
  variant: "verified" | "expert";
}

const badgeConfig: Record<
  BadgeProps["variant"],
  { label: string; icon: string; className: string }
> = {
  verified: {
    label: "Verified",
    icon: "✓",
    className:
      "text-success border-success/40",
  },
  expert: {
    label: "Featured Expert",
    icon: "★",
    className:
      "text-amber-700 border-amber-400/40",
  },
};

export function Badge({ variant }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-[var(--radius-sm)] ${config.className}`}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}
