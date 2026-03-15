"use client";

import { cn } from "@/shared/lib/utils";
import type { SeatStatus } from "@/shared/types";
import { SEAT_STATUS_LABELS } from "@/shared/types";

const seatColors: Record<SeatStatus, string> = {
  available: "bg-seat-available",
  selected: "bg-seat-selected",
  taken: "bg-seat-taken",
  locked: "bg-seat-locked",
};

const SEAT_STATUSES: SeatStatus[] = ["available", "selected", "taken", "locked"];

interface SeatStatusLegendProps {
  className?: string;
  compact?: boolean;
}

export function SeatStatusLegend({ className, compact }: SeatStatusLegendProps) {
  return (
    <div className={cn("flex items-center gap-4", compact && "gap-3", className)}>
      {SEAT_STATUSES.map((status) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-full shrink-0", seatColors[status])} />
          <span className={cn("text-xs text-muted-foreground", compact && "text-[11px]")}>
            {SEAT_STATUS_LABELS[status]}
          </span>
        </div>
      ))}
    </div>
  );
}
