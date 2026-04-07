"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { BookingStatusBadge } from "@/entities/event";
import { TierBadge } from "@/entities/user";
import { PriceDisplay } from "@/shared/ui";
import { BookingProvider, useBooking } from "@/features/booking/model/BookingContext";
import { BookingModal } from "@/widgets/booking/BookingModal";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";

interface EventBookingSidebarProps {
  event: EventDetail;
}

function formatSidebarDate(isoDate: string): string {
  const d = new Date(isoDate);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatTierTime(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function EventBookingSidebarInner({ event }: EventBookingSidebarProps) {
  const router = useRouter();
  const { bookingState, startBooking, resetBooking, eventDates } = useBooking();
  const [selectedDateId, setSelectedDateId] = useState(event.dates[0]?.id ?? "");

  const selectedDate = event.dates.find((d) => d.id === selectedDateId);
  const bookingWindows = selectedDate?.bookingWindows ?? [];

  const prices = event.sections.map((s) => s.price);
  const hasPrices = prices.length > 0;
  const minPrice = hasPrices ? Math.min(...prices) : 0;
  const maxPrice = hasPrices ? Math.max(...prices) : 0;

  const isBookable = event.status === "open";
  const isSoldOut = event.status === "soldout";
  const isClosed = event.status === "closed";
  const isTestEvent = event.id === "1";

  const handleBookingClick = () => {
    startBooking();
  };

  const handleQueuePassed = (_token: string | null) => {
    sessionStorage.setItem("urr:booking:startPhase", "seats-section");
    resetBooking();
    router.push(`/events/${event.id}/booking`);
  };

  const handleModalClose = () => {
    resetBooking();
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 space-y-5">
        {/* Status */}
        <div className="flex items-center justify-between">
          <BookingStatusBadge status={event.status} className="text-sm" />
          {isSoldOut && (
            <span className="text-sm text-muted-foreground">매진되었습니다</span>
          )}
          {isClosed && (
            <span className="text-sm text-muted-foreground">본 상품은 판매 종료되었습니다.</span>
          )}
        </div>

        {/* Date selector */}
        <div className="space-y-2.5">
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <Calendar size={14} className="text-muted-foreground" />
            공연 날짜 선택
          </h4>
          <div className="space-y-2">
            {event.dates.map((d) => {
              const apiDate = eventDates.find((ed) => ed.id === d.id);
              const remaining = apiDate?.remainingSeats ?? d.remainingSeats;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDateId(d.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer",
                    selectedDateId === d.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{formatSidebarDate(d.date)}</span>
                    <span
                      className={cn(
                        "text-xs",
                        remaining < 1000 ? "text-destructive font-medium" : "text-muted-foreground",
                      )}
                    >
                      잔여 {remaining.toLocaleString()}석
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* Price range */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">가격</h4>
          {hasPrices ? (
            <div className="flex items-baseline gap-1.5">
              <PriceDisplay amount={minPrice} size="sm" />
              <span className="text-sm text-muted-foreground">~</span>
              <PriceDisplay amount={maxPrice} size="sm" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">미정</p>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* Tier schedule summary */}
        <div className="space-y-2.5">
          <h4 className="text-sm font-semibold">티어별 예매 오픈</h4>
          <div className="space-y-1.5">
            {bookingWindows.map((w) => (
              <div key={w.tier} className="flex items-center justify-between">
                <TierBadge tier={w.tier} size="sm" />
                <span className="text-xs text-muted-foreground">{formatTierTime(w.opensAt)} ~</span>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* CTA Button */}
        <Button
          className="w-full h-12 text-base font-semibold"
          disabled={!isBookable || !isTestEvent}
          onClick={handleBookingClick}
        >
          {!isTestEvent
            ? "준비중"
            : isBookable
              ? "예매하기"
              : isSoldOut
                ? "매진"
                : event.status === "upcoming"
                  ? "오픈 예정"
                  : "판매 종료"}
        </Button>

        {/* Safety notice */}
        <div className="flex items-start gap-2">
          <ShieldCheck size={14} className="text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            URR 안전결제 시스템으로 안전하게 보호됩니다. 모든 결제는 에스크로를 통해 처리됩니다.
          </p>
        </div>
      </div>

      {/* Queue modal rendered on the event detail page */}
      {bookingState === "queue" && (
        <BookingModal
          onQueuePassed={handleQueuePassed}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export function EventBookingSidebar({ event }: EventBookingSidebarProps) {
  return (
    <BookingProvider eventId={event.id}>
      <EventBookingSidebarInner event={event} />
    </BookingProvider>
  );
}
