"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { TimerDisplay } from "@/features/booking/ui/TimerDisplay";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { Minimap } from "@/features/booking/ui/Minimap";
import { formatPrice, parseSeatDisplay } from "@/shared/lib/format";
import { TIER_EMOJIS, TIER_LABELS } from "@/shared/types";
import type { Section, EventDate, TierLevel } from "@/shared/types";

interface BookingSidePanelProps {
  // Sections
  sectionsForDate: Section[];
  selectedSectionId: string | null;
  onSectionClick: (sectionId: string) => void;

  // Seat selection
  selectedSeatIds: string[];
  maxSeats: number;
  onRemoveSeat: (seatId: string) => void;

  // Pricing
  section: Section | null;
  selectedDate: EventDate | null;
  userTier: TierLevel;

  // Timer
  timerSeconds: number;

  // CTA
  onPay: () => void;
}

function getAvailabilityColor(remaining: number, total: number): string {
  if (remaining === 0) return "#9CA3AF";
  const ratio = remaining / total;
  if (ratio > 0.3) return "#22C55E";
  if (ratio > 0.1) return "#F97316";
  return "#EF4444";
}

export function BookingSidePanel({
  sectionsForDate,
  selectedSectionId,
  onSectionClick,
  selectedSeatIds,
  maxSeats,
  onRemoveSeat,
  section,
  selectedDate,
  userTier,
  timerSeconds,
  onPay,
}: BookingSidePanelProps) {
  const seatCount = selectedSeatIds.length;
  const hasSection = !!selectedSectionId && !!section;
  const tierFee =
    selectedDate?.bookingWindows.find((w) => w.tier === userTier)?.fee ?? 0;
  const subtotal = section ? section.price * seatCount : 0;
  const feeTotal = tierFee * seatCount;
  const total = subtotal + feeTotal;

  // Parse the last selected seat for display in header
  const lastSeat = seatCount > 0 ? selectedSeatIds[seatCount - 1] : null;
  const lastSeatDisplay =
    lastSeat && section ? parseSeatDisplay(lastSeat, section.name) : null;

  return (
    <div className="w-[360px] shrink-0 border-l border-border bg-white flex flex-col h-full">
      {/* Header: Section + Seat info */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              선택 좌석 등급
            </p>
            {!hasSection && (
              <p className="text-xs text-muted-foreground mt-1">
                도면에서 구역을 선택해주세요.
              </p>
            )}
          </div>
          {hasSection && (
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold">{section.name}</span>
              {lastSeatDisplay && (
                <span className="text-xl font-bold text-muted-foreground">
                  {lastSeatDisplay}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Minimap — always present, dimmed when no section selected */}
        <div className="px-5 pt-4 pb-3">
          <Minimap
            embedded
            dimmed={!hasSection}
            selectedSectionId={selectedSectionId}
            onSectionClick={onSectionClick}
          />
        </div>

        <Separator />

        {/* Timer — only when section is selected and seats selected */}
        {hasSection && seatCount > 0 && (
          <>
            <div className="flex items-center justify-center py-3">
              <TimerDisplay seconds={timerSeconds} size="default" />
            </div>
            <Separator />
          </>
        )}

        {/* Selected seats list */}
        {hasSection && seatCount > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">선택 좌석</h4>
              <span className="text-xs text-muted-foreground tabular-nums">
                {seatCount}/{maxSeats}석
              </span>
            </div>

            {seatCount >= maxSeats && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs font-medium text-warning">
                  최대 선택 수에 도달했습니다
                </p>
              </div>
            )}

            <div className="space-y-2">
              {selectedSeatIds.map((seatId) => (
                <div
                  key={seatId}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border"
                >
                  <span className="text-sm font-medium">
                    {parseSeatDisplay(seatId, section.name)}
                  </span>
                  <button
                    onClick={() => onRemoveSeat(seatId)}
                    className="p-1 rounded-md hover:bg-accent transition-colors"
                    aria-label="좌석 제거"
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section availability table */}
        <div className="px-5 py-4">
          <h4 className="text-sm font-semibold mb-1">잔여석</h4>
          <p className="text-xs text-muted-foreground mb-3">
            좌석등급을 선택해주세요.
          </p>
          <div className="space-y-2">
            {sectionsForDate.map((sec) => (
              <div key={sec.id} className="flex items-center gap-3 py-2">
                <div
                  className="size-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: getAvailabilityColor(
                      sec.remainingSeats,
                      sec.totalSeats,
                    ),
                  }}
                />
                <span className="text-sm font-medium flex-1">{sec.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatPrice(sec.price)}
                </span>
                <span className="text-xs font-semibold tabular-nums w-12 text-right">
                  {sec.remainingSeats === 0 ? (
                    <span className="text-muted-foreground">매진</span>
                  ) : (
                    <span className="text-primary">
                      {sec.remainingSeats.toLocaleString()}석
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price breakdown — when seats selected */}
      {seatCount > 0 && section && (
        <div className="px-5 py-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">티켓</span>
            <span className="tabular-nums">
              {formatPrice(section.price)} × {seatCount}
            </span>
          </div>
          {tierFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <span>{TIER_EMOJIS[userTier]}</span>
                <span>{TIER_LABELS[userTier]} 수수료</span>
              </span>
              <span className="tabular-nums">
                {formatPrice(tierFee)} × {seatCount}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">총 결제 금액</span>
            <PriceDisplay amount={total} size="lg" />
          </div>
        </div>
      )}

      {/* CTA button */}
      <div className="px-5 pb-5 pt-2 shrink-0">
        <Button
          size="lg"
          className="w-full"
          disabled={seatCount === 0}
          onClick={onPay}
        >
          {seatCount > 0 ? `${formatPrice(total)} 결제하기` : "좌석 선택 완료"}
        </Button>
      </div>
    </div>
  );
}
