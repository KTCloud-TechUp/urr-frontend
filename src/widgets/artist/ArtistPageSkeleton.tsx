export function ArtistPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="w-full h-[200px] rounded-2xl bg-muted" />

      {/* Tabs skeleton */}
      <div className="flex gap-6 mt-8 border-b border-border pb-3">
        {[80, 60, 60, 60].map((w, i) => (
          <div key={i} className="h-4 rounded bg-muted" style={{ width: w }} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="mt-8 space-y-8">
        <div className="h-24 rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-[140px] rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
