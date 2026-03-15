"use client";

import { VenueMap } from "@/features/booking/ui/VenueMap";
import { SeatStatusLegend } from "@/features/booking/ui/SeatStatusLegend";
import { SectionListTable } from "@/features/booking/ui/SectionListTable";
import { Separator } from "@/shared/ui/separator";

export function IdleView() {
  return (
    <div className="flex flex-col h-full p-6 gap-2">
      <div className="flex-[3] min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          좌석 배치도
        </h3>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <VenueMap className="w-full h-full" />
        </div>
        <SeatStatusLegend compact className="justify-center mt-2" />
      </div>

      <Separator />

      <div className="flex-[2] min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-2">
          구역별 현황
        </h3>
        <SectionListTable className="flex-1 min-h-0" />
      </div>
    </div>
  );
}
