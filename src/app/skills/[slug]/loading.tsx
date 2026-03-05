export default function SkillLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-warm-100 rounded w-64 mb-6" />

      {/* Badges skeleton */}
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-warm-100 rounded-full w-32" />
        <div className="h-6 bg-warm-100 rounded-full w-20" />
      </div>

      {/* Title skeleton */}
      <div className="h-10 bg-warm-100 rounded-[var(--radius-md)] w-3/4 mb-3" />
      <div className="h-5 bg-warm-100 rounded-[var(--radius-md)] w-2/3 mb-4" />

      {/* Author + stats skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-4 bg-warm-100 rounded w-32" />
        <div className="h-4 bg-warm-100 rounded w-24" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 mb-8">
        <div className="h-12 bg-warm-100 rounded-[var(--radius-md)] w-40" />
        <div className="h-12 bg-warm-100 rounded-[var(--radius-md)] w-36" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-4 bg-warm-100 rounded"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
