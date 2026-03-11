import { cn } from "@/shared/lib/utils";

function Sk({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-14">
      {/* Banner */}
      <Sk className="w-full h-80 rounded-2xl" />

      {/* 인기 아티스트 */}
      <div className="space-y-4">
        <Sk className="h-6 w-40" />
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2">
              <Sk className="size-12 rounded-full" />
              <Sk className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* 지금 뜨는 공연 */}
      <div className="space-y-4">
        <Sk className="h-6 w-36" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Sk className="w-full aspect-[4/5] rounded-lg" />
              <div className="mt-2.5 space-y-1.5">
                <Sk className="h-4 w-full" />
                <Sk className="h-3 w-3/4" />
                <Sk className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 공연 랭킹 */}
      <div className="space-y-4">
        <Sk className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-x-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-border">
              <Sk className="size-4 shrink-0" />
              <Sk className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Sk className="h-4 w-3/4" />
                <Sk className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 선예매 오픈 임박 */}
      <div className="space-y-4">
        <Sk className="h-6 w-36" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
              <Sk className="w-[80px] h-[100px] rounded-md shrink-0" />
              <div className="flex-1 space-y-2 py-0.5">
                <Sk className="h-3 w-full" />
                <Sk className="h-4 w-3/4" />
                <Sk className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
