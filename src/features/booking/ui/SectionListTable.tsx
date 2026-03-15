"use client";

import { useBooking } from "@/features/booking/model/BookingContext";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { cn } from "@/shared/lib/utils";

function getStatusColor(remaining: number, total: number): string {
  if (remaining === 0) return "bg-[#9CA3AF]";
  const ratio = remaining / total;
  if (ratio > 0.3) return "bg-[#22C55E]";
  if (ratio > 0.1) return "bg-[#F97316]";
  return "bg-[#EF4444]";
}

interface SectionListTableProps {
  className?: string;
}

export function SectionListTable({ className }: SectionListTableProps) {
  const { sectionsForDate } = useBooking();

  return (
    <div className={cn("overflow-y-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              구역
            </th>
            <th className="py-2.5 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              가격
            </th>
            <th className="py-2.5 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              잔여석
            </th>
            <th className="py-2.5 px-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              상태
            </th>
          </tr>
        </thead>
        <tbody>
          {sectionsForDate.map((section) => (
            <tr key={section.id} className="border-b border-border/50 last:border-0">
              <td className="py-3 px-3 text-sm font-medium">{section.name}</td>
              <td className="py-3 px-3 text-right">
                <PriceDisplay amount={section.price} size="sm" />
              </td>
              <td className="py-3 px-3 text-right text-sm tabular-nums text-muted-foreground">
                {section.remainingSeats.toLocaleString()} / {section.totalSeats.toLocaleString()}
              </td>
              <td className="py-3 px-3">
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      getStatusColor(section.remainingSeats, section.totalSeats),
                    )}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
