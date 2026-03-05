export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 bg-warm-100 rounded-[var(--radius-md)] w-96 mx-auto mb-4" />
        <div className="h-5 bg-warm-100 rounded-[var(--radius-md)] w-80 mx-auto" />
      </div>

      {/* Search skeleton */}
      <div className="h-12 bg-warm-100 rounded-[var(--radius-md)] max-w-xl mx-auto mb-8" />

      {/* Category cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-warm-100 rounded-[var(--radius-md)]"
          />
        ))}
      </div>

      {/* Skill cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 bg-warm-100 rounded-[var(--radius-md)]"
          />
        ))}
      </div>
    </div>
  );
}
