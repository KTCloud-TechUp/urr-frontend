"use client";

import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { formatPrice, formatDateDot } from "@/shared/lib/format";
import { TIER_IMAGES, TIER_LABELS } from "@/shared/types";
import type { BookingEvent } from "@/features/booking/model/BookingContext";
import type { EventDate, Section, TierLevel } from "@/shared/types";

interface PaymentConfirmPhaseProps {
  event: BookingEvent | null;
  selectedDate: EventDate | null;
  seatDisplayNames: string[];
  seatCount: number;
  section: Section | null;
  hasUserTierWindow: boolean;
  userTier: TierLevel;
  tierFee: number;
  total: number;
  onCancel: () => void;
  onGoToPayment: () => void;
}

export function PaymentConfirmPhase({
  event,
  selectedDate,
  seatDisplayNames,
  seatCount,
  section,
  hasUserTierWindow,
  userTier,
  tierFee,
  total,
  onCancel,
  onGoToPayment,
}: PaymentConfirmPhaseProps) {
  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[480px] rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-lg font-bold">좌석 확인</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              선택하신 좌석 정보를 확인해주세요
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Event info */}
            <div>
              <p className="text-sm font-semibold">{event?.title}</p>
              {selectedDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateDot(selectedDate.date)}
                </p>
              )}
            </div>

            <Separator />

            {/* Selected seats */}
            <div>
              <h4 className="text-sm font-semibold mb-2">
                선택 좌석 ({seatCount}석)
              </h4>
              <div className="space-y-1.5">
                {seatDisplayNames.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatPrice(section?.price ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">티켓 가격</span>
                <span className="tabular-nums">
                  {formatPrice(section?.price ?? 0)} × {seatCount}
                </span>
              </div>
              {hasUserTierWindow && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Image
                      src={TIER_IMAGES[userTier]}
                      width={16}
                      height={16}
                      alt=""
                    />
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
          </div>

          {/* Buttons */}
          <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
            <Button variant="ghost" className="flex-1" onClick={onCancel}>
              취소
            </Button>
            <Button className="flex-1" onClick={onGoToPayment}>
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
