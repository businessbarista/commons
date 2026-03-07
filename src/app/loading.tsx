export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        {/* Hero skeleton */}
        <div className="mb-12">
          <div className="h-3 bg-surface-raised rounded w-48 mb-4" />
          <div className="h-8 bg-surface-raised rounded w-80 mb-3" />
          <div className="h-4 bg-surface-raised rounded w-96" />
        </div>

        {/* Search skeleton */}
        <div className="h-10 bg-surface-raised rounded-[var(--radius-md)] max-w-xl mb-8" />

        {/* Category cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-surface-raised rounded-[var(--radius-md)] border border-border"
            />
          ))}
        </div>

        {/* Skill cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 bg-surface-raised rounded-[var(--radius-md)] border border-border"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
