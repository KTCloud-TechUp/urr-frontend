"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, CircleAlert, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { confirmPayment } from "@/features/payment/api/confirmPayment";
import { confirmReservation } from "@/features/booking/api/confirmReservation";
import type { ReservationRef } from "@/features/booking/model/useBookingStore";
import type { ConfirmationData } from "@/shared/types";
import { TierBadge } from "@/entities/user/ui/TierBadge";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { formatPrice } from "@/shared/lib/format";
import { TIER_IMAGES, TIER_LABELS } from "@/shared/types";

type Phase = "loading" | "success" | "error";

function formatEventDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const w = weekdays[d.getDay()];
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} (${w}) ${h}:${min}`;
}

export function BookingCompleteWidget() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [data, setData] = useState<ConfirmationData | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // React 18 Strict Mode에서 effect가 두 번 실행되는 것을 방지
    // confirmPayment/confirmReservation은 멱등하지 않으므로 반드시 1회만 호출해야 함
    if (hasRun.current) return;
    hasRun.current = true;
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    if (!paymentKey || !orderId || !amount) {
      router.replace("/");
      return;
    }

    // sessionStorage를 먼저 읽고 즉시 제거 — 이중 호출 시 두 번째 실행은 raw가 null
    const raw = sessionStorage.getItem("urr:toss:booking");
    const rawReservations = sessionStorage.getItem("urr:toss:reservations");
    const savedUserId = sessionStorage.getItem("urr:toss:userId") ?? "";
    sessionStorage.removeItem("urr:toss:booking");
    sessionStorage.removeItem("urr:toss:reservations");
    sessionStorage.removeItem("urr:toss:userId");
    window.history.replaceState({}, "", window.location.pathname);

    if (!raw) {
      // 이미 처리됐거나 직접 URL 접근 — 홈으로
      router.replace("/");
      return;
    }

    const completeData = JSON.parse(raw) as ConfirmationData;
    const restoredRefs: ReservationRef[] = rawReservations
      ? (JSON.parse(rawReservations) as ReservationRef[])
      : [];

    confirmPayment({
      paymentKey,
      orderId,
      amount: Number(amount),
      userId: savedUserId,
    })
      .then(async () => {
        // AWS 환경: SQS → Lambda가 예약 확정 처리 (프론트 직접 호출 불필요)
        // 로컬 환경: SQS 없으므로 프론트가 직접 confirm 호출
        const isLocal =
          process.env.NEXT_PUBLIC_API_BASE_URL?.includes("localhost");
        if (isLocal) {
          const allReservationIds = restoredRefs.flatMap(
            (ref) => ref.reservationIds ?? [],
          );
          if (allReservationIds.length > 0) {
            await confirmReservation({
              reservationIds: allReservationIds,
              userId: savedUserId,
            }).catch(() => {
              // 이미 확정된 예약이거나 백엔드가 내부 처리한 경우 — 무시
            });
          }
        }
        setData(completeData);
        setPhase("success");
      })
      .catch(() => {
        // confirmPayment 자체가 실패한 경우만 에러 처리
        setPhase("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 결제 완료 페이지에서 뒤로가기를 눌러도 예매 화면으로 돌아가지 않도록 처리
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = () => {
      router.replace("/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  useEffect(() => {
    if (phase !== "success") return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }, [phase]);

  const handleGoToWallet = useCallback(
    () => router.push("/my-page?tab=wallet"),
    [router],
  );
  const handleGoHome = useCallback(() => router.push("/"), [router]);

  const ticketSubtotal = useMemo(
    () => data?.tickets.reduce((sum, t) => sum + t.price, 0) ?? 0,
    [data],
  );
  const feeSubtotal = useMemo(
    () => data?.tickets.reduce((sum, t) => sum + t.tierFee, 0) ?? 0,
    [data],
  );

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">결제를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (phase === "error" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm p-8">
          <CircleAlert size={48} className="text-destructive" />
          <h2 className="text-lg font-bold">결제 확인 실패</h2>
          <p className="text-sm text-muted-foreground">
            결제 처리 중 문제가 발생했습니다.
            <br />
            마이페이지에서 예매 내역을 확인해 주세요.
          </p>
          <div className="flex gap-3 w-full pt-2">
            <Button variant="ghost" className="flex-1" onClick={handleGoHome}>
              홈으로
            </Button>
            <Button className="flex-1" onClick={handleGoToWallet}>
              마이페이지
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/30 overflow-y-auto">
      <div className="max-w-[560px] mx-auto py-12 px-6 space-y-8">
        {/* 성공 헤더 */}
        <div className="text-center space-y-2 animate-in fade-in duration-300">
          <p className="text-6xl">🎉</p>
          <h1 className="text-2xl font-bold">예매 완료!</h1>
          <p className="text-sm text-muted-foreground">
            예매가 성공적으로 완료되었습니다
          </p>
        </div>

        {/* QR 코드 */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-4">
          <QRCodeSVG
            value={`${typeof window !== "undefined" ? window.location.origin : "https://urr.guru"}/tickets/${data.bookingId}`}
            size={200}
            level="M"
          />
          <p className="text-xs text-muted-foreground font-mono tabular-nums">
            {data.bookingId}
          </p>
        </div>

        {/* 예매 상세 카드 */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-white">
          {/* 공연 정보 */}
          <div className="space-y-2">
            <h3 className="font-semibold">{data.eventTitle}</h3>
            {data.showDate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar size={14} className="shrink-0" />
                <span>{formatEventDate(data.showDate)}</span>
              </div>
            )}
            {data.eventVenue && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="shrink-0" />
                <span>{data.eventVenue}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* 좌석 정보 */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              좌석 정보
            </p>
            {data.tickets.map((ticket, i) => (
              <p key={i} className="text-sm">
                {ticket.sectionName} {ticket.row}열 {ticket.seatNumber}번
              </p>
            ))}
          </div>

          <Separator />

          {/* 멤버십 티어 */}
          {data.userTier && (
            <>
              <div className="flex items-center gap-2">
                <TierBadge tier={data.userTier} size="sm" />
                <span className="text-xs text-muted-foreground">멤버십</span>
              </div>
              <Separator />
            </>
          )}

          {/* 금액 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">티켓 가격</span>
              <span className="tabular-nums">
                {formatPrice(ticketSubtotal)}
              </span>
            </div>
            {feeSubtotal > 0 && data.userTier && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Image
                    src={TIER_IMAGES[data.userTier]}
                    width={16}
                    height={16}
                    alt=""
                  />
                  <span>{TIER_LABELS[data.userTier]} 수수료</span>
                </span>
                <span className="tabular-nums">{formatPrice(feeSubtotal)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">총 결제 금액</span>
              <PriceDisplay amount={data.totalAmount} size="lg" />
            </div>
          </div>

          {/* 예매번호 */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">예매번호</span>
              <span className="text-xs font-mono tabular-nums">
                {data.bookingId}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
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
