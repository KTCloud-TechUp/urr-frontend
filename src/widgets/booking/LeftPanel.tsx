"use client";

import { useState } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useCountdown } from "@/features/booking/model/useCountdown";
import { formatCountdown } from "@/shared/lib/format";
import { TierBadge } from "@/entities/user/ui/TierBadge";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";
import { TIER_LABELS, TIER_EMOJIS } from "@/shared/types";
import type { TierLevel } from "@/shared/types";
import { LeftPanelCollapsed } from "./LeftPanelCollapsed";

const TIER_ORDER: TierLevel[] = ["lightning", "thunder", "cloud", "mist"];

function formatCompactDate(isoDate: string): string {
  const d = new Date(isoDate);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function formatWindowDate(isoDate: string): string {
  const d = new Date(isoDate);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function TierScheduleRow({
  tier,
  opensAt,
  isUserTier,
}: {
  tier: TierLevel;
  opensAt: string;
  isUserTier: boolean;
}) {
  const [now] = useState(() => Date.now());
  const isOpen = new Date(opensAt).getTime() <= now;

  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm",
        isUserTier && "bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
      )}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <span>{TIER_EMOJIS[tier]}</span>
        <span>{TIER_LABELS[tier]}</span>
      </span>
      <span
        className={cn(
          "text-xs tabular-nums",
          isOpen ? "text-success font-semibold" : "text-muted-foreground",
        )}
      >
        {isOpen ? "오픈됨" : formatWindowDate(opensAt)}
      </span>
    </div>
  );
}

function LeftPanelSkeleton() {
  return (
    <div className="p-5 space-y-4">
      <Skeleton className="w-full h-[200px] rounded-xl" />
      <Skeleton className="w-3/5 h-3" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-2/5 h-4" />
      <Separator />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-8" />
        ))}
      </div>
      <Separator />
      <Skeleton className="w-full h-10 rounded-md" />
    </div>
  );
}

export function LeftPanel() {
  const {
    event,
    isLeftPanelExpanded,
    isLoading,
    selectedDateId,
    selectedDate,
    userTier,
    bookingState,
    isWindowOpen,
    isSoldOut,
    userWindowOpensAt,
    selectDate,
    toggleLeftPanel,
    startBooking,
  } = useBooking();

  const isBookingActive = bookingState !== "idle";
  const countdownToOpen = useCountdown(isWindowOpen ? null : userWindowOpensAt);

  return (
    <div
      className={cn(
        "h-full border-r border-border bg-white shrink-0 transition-[width] duration-200 ease-out z-20 flex flex-col",
        isLeftPanelExpanded ? "w-[360px]" : "w-12",
      )}
    >
      {!isLeftPanelExpanded && <LeftPanelCollapsed />}

      {isLeftPanelExpanded && (
        <>
          <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
            <select
              value={selectedDateId ?? ""}
              onChange={(e) => selectDate(e.target.value)}
              className="flex-1 min-w-0 h-8 px-2.5 rounded-md border border-border bg-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring transition-colors truncate cursor-pointer"
            >
              {event?.dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatCompactDate(d.date)} — 잔여 {d.remainingSeats.toLocaleString()}석
                </option>
              ))}
            </select>
            <button
              onClick={toggleLeftPanel}
              className="p-1.5 rounded-md hover:bg-accent transition-colors shrink-0"
              aria-label="패널 접기"
            >
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <LeftPanelSkeleton />
            ) : event ? (
              <div className="p-5 space-y-4">
                <div className="w-full h-[200px] rounded-xl bg-muted overflow-hidden relative">
                  {event.poster ? (
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">포스터</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[11px]">단독 공연</Badge>
                  <Badge variant="outline" className="text-[11px]">DOME TOUR</Badge>
                </div>

                <h2 className="text-xl font-semibold leading-snug line-clamp-2">{event.title}</h2>

                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <MapPin size={14} className="shrink-0" />
                  <span>{event.venue}</span>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    등급별 예매 일정
                  </h4>
                  <div className="space-y-0.5">
                    {selectedDate &&
                      TIER_ORDER.map((tier) => {
                        const window = selectedDate.bookingWindows.find((w) => w.tier === tier);
                        if (!window) return null;
                        return (
                          <TierScheduleRow
                            key={tier}
                            tier={tier}
                            opensAt={window.opensAt}
                            isUserTier={tier === userTier}
                          />
                        );
                      })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">내 등급:</span>
                    <TierBadge tier={userTier} size="sm" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {!isLoading && event && (
            <div className="shrink-0 border-t border-border px-5 py-3">
              {isSoldOut ? (
                <Button disabled className="w-full" size="lg">매진</Button>
              ) : isBookingActive ? (
                <Button disabled className="w-full" size="lg">예매 진행 중</Button>
              ) : isWindowOpen ? (
                <Button className="w-full" size="lg" onClick={startBooking}>예매하기</Button>
              ) : (
                <Button disabled className="w-full" size="lg">
                  <span className="tabular-nums">예매 오픈까지 {formatCountdown(countdownToOpen)}</span>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
