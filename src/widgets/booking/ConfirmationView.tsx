"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useLayout } from "@/widgets/layout/model/useLayout";
import { formatPrice } from "@/shared/lib/format";
import { TierBadge } from "@/entities/user/ui/TierBadge";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { TIER_EMOJIS, TIER_LABELS } from "@/shared/types";

function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const w = weekdays[d.getDay()];
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} (${w}) ${h}:${min}`;
}

export function ConfirmationView() {
  const {
    event,
    selectedDate,
    userTier,
    confirmationData,
    resetBooking,
  } = useBooking();

  const { setSidebar } = useLayout();
  const router = useRouter();

  // Fire confetti burst on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }, []);

  // Re-expand app sidebar on mount
  useEffect(() => {
    setSidebar("expanded");
  }, [setSidebar]);

  const handleGoToWallet = useCallback(() => {
    resetBooking();
    router.push("/my-page");
  }, [resetBooking, router]);

  const handleGoHome = useCallback(() => {
    resetBooking();
    router.push("/");
  }, [resetBooking, router]);

  const ticketSubtotal = useMemo(() => {
    if (!confirmationData) return 0;
    return confirmationData.tickets.reduce((sum, t) => sum + t.price, 0);
  }, [confirmationData]);

  const feeSubtotal = useMemo(() => {
    if (!confirmationData) return 0;
    return confirmationData.tickets.reduce((sum, t) => sum + t.tierFee, 0);
  }, [confirmationData]);

  if (!confirmationData || !event) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          예매 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[560px] mx-auto py-12 px-6 space-y-8">
        {/* Success header */}
        <div className="text-center space-y-2 animate-in fade-in duration-300">
          <p className="text-6xl">🎉</p>
          <h1 className="text-2xl font-bold">예매 완료!</h1>
          <p className="text-sm text-muted-foreground">
            예매가 성공적으로 완료되었습니다
          </p>
        </div>

        {/* QR Code card */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-4">
          <QRCodeSVG
            value={confirmationData.bookingId}
            size={200}
            level="M"
          />
          <p className="text-xs text-muted-foreground font-mono tabular-nums">
            {confirmationData.bookingId}
          </p>
        </div>

        {/* Event details card */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-white">
          {/* Event info */}
          <div className="space-y-2">
            <h3 className="font-semibold">{event.title}</h3>
            {selectedDate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar size={14} className="shrink-0" />
                <span>{formatEventDate(selectedDate.date)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="shrink-0" />
              <span>{event.venue}</span>
            </div>
          </div>

          <Separator />

          {/* Seats */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              좌석 정보
            </p>
            {confirmationData.tickets.map((ticket, i) => (
              <p key={i} className="text-sm">
                {ticket.sectionName} {ticket.row}열 {ticket.seatNumber}번
              </p>
            ))}
          </div>

          <Separator />

          {/* Tier */}
          <div className="flex items-center gap-2">
            <TierBadge tier={userTier} size="sm" />
            <span className="text-xs text-muted-foreground">멤버십</span>
          </div>

          <Separator />

          {/* Price breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">티켓 가격</span>
              <span className="tabular-nums">
                {formatPrice(ticketSubtotal)}
              </span>
            </div>
            {feeSubtotal > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <span>{TIER_EMOJIS[userTier]}</span>
                  <span>{TIER_LABELS[userTier]} 수수료</span>
                </span>
                <span className="tabular-nums">
                  {formatPrice(feeSubtotal)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">총 결제 금액</span>
              <PriceDisplay amount={confirmationData.totalAmount} size="lg" />
            </div>
          </div>

          {/* Booking ID */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">예매번호</span>
              <span className="text-xs font-mono tabular-nums">
                {confirmationData.bookingId}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1"
            onClick={handleGoHome}
          >
            홈으로 돌아가기
          </Button>
          <Button size="lg" className="flex-1" onClick={handleGoToWallet}>
            티켓 월렛에서 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
