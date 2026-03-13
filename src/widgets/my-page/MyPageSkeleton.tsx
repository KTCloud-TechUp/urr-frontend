import { Skeleton } from '@/shared/ui/skeleton'

export function MyPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-6 border-b border-border pb-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Content cards */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
            <Skeleton className="size-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
