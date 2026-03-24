"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useBooking } from "@/features/booking/model/BookingContext";
import { cn } from "@/shared/lib/utils";
import { formatPrice } from "@/shared/lib/format";
import type { Section } from "@/shared/types";

export function getAvailabilityColor(remaining: number, total: number): string {
  if (remaining === 0) return "#9CA3AF";
  const ratio = remaining / total;
  if (ratio > 0.3) return "#22C55E";
  if (ratio > 0.1) return "#F97316";
  return "#EF4444";
}

export function getGradeKey(section: Section): string {
  if (section.id.startsWith("VIP")) return "VIP";
  if (section.id.startsWith("R")) return "R석";
  if (section.id.startsWith("S")) return "S석";
  if (section.id.startsWith("A")) return "A석";
  return "기타";
}

export const GRADE_ORDER = ["VIP", "R석", "S석", "A석", "기타"];

export function groupSectionsByGrade(sections: Section[]): Record<string, Section[]> {
  return GRADE_ORDER.reduce<Record<string, Section[]>>((acc, grade) => {
    const graded = sections.filter((s) => getGradeKey(s) === grade);
    if (graded.length > 0) acc[grade] = graded;
    return acc;
  }, {});
}

interface SectionListTableProps {
  className?: string;
}

export function SectionListTable({ className }: SectionListTableProps) {
  const { sectionsForDate } = useBooking();
  const grouped = groupSectionsByGrade(sectionsForDate);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (grade: string) =>
    setCollapsed((prev) => ({ ...prev, [grade]: !prev[grade] }));

  return (
    <div className={cn("overflow-y-auto", className)}>
      {Object.entries(grouped).map(([grade, sections]) => {
        const isCollapsed = !!collapsed[grade];
        const totalRemaining = sections.reduce((sum, s) => sum + s.remainingSeats, 0);
        const totalSeats = sections.reduce((sum, s) => sum + s.totalSeats, 0);
        const gradePrice = sections[0]?.price ?? 0;

        return (
          <Fragment key={grade}>
            {/* Grade divider header */}
            <button
              onClick={() => toggle(grade)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 transition-colors group"
            >
              <ChevronDown
                size={12}
                className={cn(
                  "text-muted-foreground transition-transform duration-200 shrink-0",
                  isCollapsed && "-rotate-90",
                )}
              />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {grade}
              </span>
              <span className="text-[11px] text-muted-foreground/60">
                {formatPrice(gradePrice)}
              </span>
              <div className="flex-1 h-px bg-border" />
              {totalRemaining === 0 ? (
                <span className="text-[11px] text-muted-foreground shrink-0">매진</span>
              ) : (
                <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                  <span className="font-medium text-foreground">{totalRemaining.toLocaleString()}</span>
                  <span>/{totalSeats.toLocaleString()}석</span>
                </span>
              )}
            </button>

            {/* Section rows */}
            {!isCollapsed && (
              <div className="pb-1">
                {sections.map((section) => {
                  const color = getAvailabilityColor(section.remainingSeats, section.totalSeats);
                  const isCritical = section.remainingSeats > 0 && section.remainingSeats / section.totalSeats <= 0.1;
                  return (
                    <div
                      key={section.id}
                      className="flex items-center gap-3 px-5 py-2 hover:bg-muted/40 transition-colors"
                    >
                      <div
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-bold flex-1">{section.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatPrice(section.price)}
                      </span>
                      <span className={cn("text-xs tabular-nums w-14 text-right", isCritical ? "text-destructive font-semibold" : "text-muted-foreground")}>
                        {section.remainingSeats === 0 ? "매진" : `${section.remainingSeats.toLocaleString()}석`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
