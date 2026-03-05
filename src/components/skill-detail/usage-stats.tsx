interface UsageStatsProps {
  viewCount: number;
  copyCount: number;
  downloadCount: number;
}

export function UsageStats({
  viewCount,
  copyCount,
  downloadCount,
}: UsageStatsProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-foreground-muted">
      <StatItem icon={<EyeIcon />} count={viewCount} label="views" />
      <StatItem icon={<CopyIcon />} count={copyCount} label="copies" />
      <StatItem
        icon={<DownloadIcon />}
        count={downloadCount}
        label="downloads"
      />
    </div>
  );
}

function StatItem({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      <span className="font-medium text-foreground-secondary">
        {formatCount(count)}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
