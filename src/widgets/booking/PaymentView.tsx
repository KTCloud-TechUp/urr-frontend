"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, CircleAlert, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useSeatTimer } from "@/features/booking/model/useSeatTimer";
import { usePaymentForm } from "@/features/booking/model/usePaymentForm";
import { TimerDisplay } from "@/features/booking/ui/TimerDisplay";
import { PriceDisplay } from "@/shared/ui/PriceDisplay";
import { formatPrice, parseSeatDisplay, formatDateDot } from "@/shared/lib/format";
import { PAYMENT_METHODS } from "@/shared/lib/constants";
import { TIER_EMOJIS, TIER_LABELS } from "@/shared/types";
import type { ConfirmationData } from "@/shared/types";
import { PaymentProcessingOverlay } from "./PaymentProcessingOverlay";

type PaymentPhase =
  | "confirm-seats"
  | "payment-form"
  | "processing"
  | "failed"
  | "failed-expired";

export function PaymentView() {
  const {
    event,
    selectedDate,
    selectedSeatIds,
    selectedSectionId,
    sectionsForDate,
    userTier,
    transitionTo,
    resetBooking,
    setConfirmationData,
  } = useBooking();

  const [phase, setPhase] = useState<PaymentPhase>("confirm-seats");
  const retryTimer = useSeatTimer(60);

  // Payment form state
  const {
    buyerName,
    buyerPhone,
    selectedMethod,
    termsAgreed,
    isFormValid,
    handleNameChange,
    handlePhoneChange,
    setSelectedMethod,
    toggleTerms,
  } = usePaymentForm();

  const section = useMemo(
    () => sectionsForDate.find((s) => s.id === selectedSectionId) ?? null,
    [sectionsForDate, selectedSectionId],
  );

  const tierFee =
    selectedDate?.bookingWindows.find((w) => w.tier === userTier)?.fee ?? 0;
  const seatCount = selectedSeatIds.length;
  const subtotal = section ? section.price * seatCount : 0;
  const feeTotal = tierFee * seatCount;
  const total = subtotal + feeTotal;

  const seatDisplayNames = useMemo(() => {
    if (!section) return [];
    return selectedSeatIds.map((id) => parseSeatDisplay(id, section.name));
  }, [selectedSeatIds, section]);

  // Watch retry timer expiry
  useEffect(() => {
    if (phase === "failed" && retryTimer.isExpired) {
      queueMicrotask(() => setPhase("failed-expired"));
    }
  }, [phase, retryTimer.isExpired]);

  const handleGoToPayment = useCallback(() => {
    setPhase("payment-form");
  }, []);

  const handleBackToConfirm = useCallback(() => {
    setPhase("confirm-seats");
  }, []);

  const handleSubmitPayment = useCallback(() => {
    setPhase("processing");

    const timeout = setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success for demo

      if (isSuccess && section) {
        const confirmationData: ConfirmationData = {
          bookingId: `URR-${Date.now().toString(36).toUpperCase()}`,
          tickets: selectedSeatIds.map((seatId) => {
            const parts = seatId.split("-");
            return {
              seatId,
              sectionName: section.name,
              row: parts[parts.length - 2],
              seatNumber: parts[parts.length - 1],
              price: section.price,
              tierFee,
            };
          }),
          totalAmount: total,
          bookedAt: new Date().toISOString(),
        };
        setConfirmationData(confirmationData);
        transitionTo("confirmation");
      } else {
        setPhase("failed");
        retryTimer.start();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [
    section,
    selectedSeatIds,
    tierFee,
    total,
    setConfirmationData,
    transitionTo,
    retryTimer,
  ]);

  const handleCancel = useCallback(() => {
    transitionTo("seats-individual");
  }, [transitionTo]);

  const handleRetry = useCallback(() => {
    setPhase("payment-form");
  }, []);

  const handleExitBooking = useCallback(() => {
    resetBooking();
  }, [resetBooking]);

  // --- Phase 1: Seat Confirmation ---
  if (phase === "confirm-seats") {
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
            </div>

            {/* Buttons */}
            <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
              <Button variant="ghost" className="flex-1" onClick={handleCancel}>
                취소
              </Button>
              <Button className="flex-1" onClick={handleGoToPayment}>
                결제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Phase 2: Payment Form (Korean payment service style) ---
  if (phase === "payment-form") {
    return (
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-[680px] rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToConfirm}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                >
                  <ArrowLeft size={18} className="text-muted-foreground" />
                </button>
                <h2 className="text-lg font-bold">주문 결제</h2>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="flex-1 overflow-y-auto flex min-h-0">
              {/* Left: Form */}
              <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto border-r border-border">
                {/* Buyer info */}
                <div>
                  <h3 className="text-sm font-bold mb-3">주문자 정보</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          이름 *
                        </label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="성함을 입력하세요"
                          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          전화번호 *
                        </label>
                        <input
                          type="text"
                          value={buyerPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="010-0000-0000"
                          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                          maxLength={13}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment method */}
                <div>
                  <h3 className="text-sm font-bold mb-3">결제 수단</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                          "h-11 px-3 rounded-lg border text-sm font-medium transition-all",
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                            : "border-border bg-white text-foreground hover:bg-muted/50",
                        )}
                      >
                        {method.color ? (
                          <span
                            style={{
                              color:
                                method.id === "kakao" ? "#000" : method.color,
                            }}
                          >
                            {method.label}
                          </span>
                        ) : (
                          method.label
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedMethod === "card" && (
                    <p className="text-xs text-muted-foreground mt-3">
                      결제하기 버튼을 누르면 카드사 결제 창이 열립니다.
                    </p>
                  )}
                  {selectedMethod !== "card" && (
                    <p className="text-xs text-muted-foreground mt-3">
                      결제하기 버튼을 누르면{" "}
                      {
                        PAYMENT_METHODS.find((m) => m.id === selectedMethod)
                          ?.label
                      }{" "}
                      결제 창이 열립니다.
                    </p>
                  )}
                </div>

                <Separator />

                {/* Terms agreement */}
                <div>
                  <button
                    onClick={toggleTerms}
                    className="flex items-center gap-2 group"
                  >
                    <span
                      className={cn(
                        "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                        termsAgreed
                          ? "bg-primary border-primary"
                          : "border-border group-hover:border-muted-foreground",
                      )}
                    >
                      {termsAgreed && (
                        <Check size={14} className="text-white" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="w-[240px] shrink-0 px-5 py-5 bg-muted/30">
                <h3 className="text-sm font-bold mb-3">주문 상품</h3>

                {/* Event info */}
                <div className="mb-3">
                  <p className="text-sm font-semibold leading-snug">
                    {event?.title}
                  </p>
                  {selectedDate && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDateDot(selectedDate.date)}
                    </p>
                  )}
                </div>

                {/* Seat list */}
                <div className="space-y-1 mb-4">
                  {seatDisplayNames.map((name, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      {name}
                    </p>
                  ))}
                </div>

                <Separator className="mb-3" />

                {/* Price breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">티켓</span>
                    <span className="tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {feeTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">수수료</span>
                      <span className="tabular-nums">
                        {formatPrice(feeTotal)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">총액</span>
                  <span className="text-lg font-bold tabular-nums text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-border shrink-0">
              <Button
                className="w-full"
                size="lg"
                disabled={!isFormValid}
                onClick={handleSubmitPayment}
              >
                {formatPrice(total)} 결제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Processing phase ---
  if (phase === "processing") {
    return <PaymentProcessingOverlay />;
  }

  // --- Failed-expired phase ---
  if (phase === "failed-expired") {
    return (
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <CircleAlert size={48} className="text-destructive" />
              <h3 className="text-lg font-bold">좌석이 해제되었습니다</h3>
              <p className="text-sm text-muted-foreground">
                재시도 시간이 만료되어 선택하신 좌석이 해제되었습니다.
              </p>
              <Button className="w-full mt-2" onClick={handleExitBooking}>
                이벤트 페이지로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Failed phase ---
  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-4 text-center">
            <CircleAlert size={48} className="text-destructive" />
            <h3 className="text-lg font-bold">결제에 실패했습니다</h3>
            <p className="text-sm text-muted-foreground">
              카드 승인이 거절되었습니다.
            </p>
            <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border w-full">
              <p className="text-xs text-muted-foreground mb-2">
                좌석이 60초간 유지됩니다. 다시 시도해주세요.
              </p>
              <TimerDisplay seconds={retryTimer.secondsLeft} size="lg" />
            </div>
            <div className="flex gap-3 w-full pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={handleExitBooking}
              >
                예매 종료
              </Button>
              <Button className="flex-1" onClick={handleRetry}>
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
