interface BadgeProps {
  variant: "verified" | "expert";
}

const badgeConfig: Record<
  BadgeProps["variant"],
  { label: string; icon: string; className: string }
> = {
  verified: {
    label: "verified",
    icon: "//",
    className: "text-accent-fg border-accent/30",
  },
  expert: {
    label: "expert",
    icon: "*",
    className: "text-accent-fg border-accent/30",
  },
};

export function Badge({ variant }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border rounded-[var(--radius-sm)] ${config.className}`}
    >
      <span className="text-[9px]">{config.icon}</span>
      {config.label}
    </span>
  );
}
