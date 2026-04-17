"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { CircleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useSeatTimer } from "@/features/booking/model/useSeatTimer";
import { usePaymentForm } from "@/shared/lib/usePaymentForm";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { TimerDisplay } from "@/features/booking/ui/TimerDisplay";
import { parseSeatDisplay } from "@/shared/lib/format";
import { bookTicket } from "@/features/booking/api/bookTicket";
import { cancelReservation } from "@/features/booking/api/cancelReservation";
import { createPaymentRecord } from "@/features/payment/api/createPaymentRecord";
import { getTossPayments, TOSS_METHOD_MAP } from "@/features/payment/lib/toss";
import { ApiError } from "@/shared/api/client";
import {
  useBookingStore,
  type ReservationRef,
} from "@/features/booking/model/useBookingStore";
import { useBookingSession } from "@/features/booking/model/useBookingSession";
import type { ConfirmationData } from "@/shared/types";
import { PaymentProcessingOverlay } from "./PaymentProcessingOverlay";
import { PaymentConfirmPhase } from "./PaymentConfirmPhase";
import { PaymentFormPhase } from "./PaymentFormPhase";

type PaymentPhase =
  | "confirm-seats"
  | "payment-form"
  | "processing"
  | "failed"
  | "failed-expired"
  | "seats-taken";

export function PaymentView() {
  const {
    event,
    eventId,
    artistId,
    selectedDate,
    selectedSeatIds,
    selectedSectionId,
    sectionsForDate,
    userTier,
    tierWindows,
    transitionTo,
  } = useBooking();

  const { reservationRefs, setReservations } = useBookingStore();
  const { data: currentUser } = useCurrentUser();
  const bookingSession = useBookingSession();

  const [phase, setPhase] = useState<PaymentPhase>("confirm-seats");
  const retryTimer = useSeatTimer(60);

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
  } = usePaymentForm({
    initialName: currentUser?.name,
    initialPhone: currentUser?.phoneNumber,
  });

  const section = useMemo(
    () => sectionsForDate.find((s) => s.id === selectedSectionId) ?? null,
    [sectionsForDate, selectedSectionId],
  );

  const tierFee = tierWindows.find((w) => w.tier === userTier)?.fee ?? 0;
  const hasUserTierWindow = tierWindows.some((w) => w.tier === userTier);
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
      const t = setTimeout(() => setPhase("failed-expired"), 0);
      return () => clearTimeout(t);
    }
  }, [phase, retryTimer.isExpired]);

  const handleGoToPayment = useCallback(() => {
    setPhase("payment-form");
  }, []);

  const handleBackToConfirm = useCallback(() => {
    setPhase("confirm-seats");
  }, []);

  const handleSubmitPayment = useCallback(async () => {
    if (!selectedDate || !artistId) return;
    setPhase("processing");

    try {
      // 좌석 bulk 선점 (최대 4석)
      const reservation = await bookTicket({
        eventId,
        showId: selectedDate.id,
        artistId,
        seatIds: selectedSeatIds,
        userId: currentUser?.userId ?? "",
      });

      // 선점 직후 refs 저장 — createPaymentRecord/requestPayment 실패 시에도 취소 가능
      const reservationRefList: ReservationRef[] = [
        {
          eventId: Number(eventId),
          showId: Number(selectedDate.id),
          seatIds: reservation.seatIds,
          reservationIds: reservation.reservationIds,
        },
      ];
      setReservations(reservationRefList, "");

      const orderId = reservation.orderId;
      const payableAmount = reservation.totalAmount;

      // orderId 확정 후 store 갱신
      // — Toss 리다이렉트 후 JS 메모리 초기화되므로 sessionStorage 백업 필수
      setReservations(reservationRefList, orderId);

      // Toss 결제창 띄우기 전, 백엔드에 orderId 사전 등록
      // — confirmPayment 시 이 orderId로 결제 레코드를 조회하므로 반드시 먼저 호출
      const referenceId = reservation.reservationIds.join(",");
      await createPaymentRecord({
        userId: currentUser?.userId ?? "",
        referenceId,
        orderId,
        amount: payableAmount,
      });

      // Toss 리다이렉트 복귀 후 /booking/complete 페이지에서 복원에 사용
      const confirmationData: ConfirmationData = {
        bookingId: reservation.reservationIds[0] ?? "",
        tickets: selectedSeatIds.map((id) => {
          const parts = id.split("-");
          return {
            seatId: id,
            sectionName: section?.name ?? "",
            row: parts.length >= 2 ? parts[parts.length - 2] : id,
            seatNumber: parts.length >= 1 ? parts[parts.length - 1] : id,
            price: section?.price ?? 0,
            tierFee,
          };
        }),
        totalAmount: payableAmount,
        bookedAt: new Date().toISOString(),
        eventTitle: event?.title ?? "",
        eventVenue: event?.venue ?? "",
        showDate: selectedDate?.date ?? "",
        userTier,
      };
      bookingSession.save(
        reservationRefList,
        confirmationData,
        String(currentUser?.userId ?? ""),
      );

      const tossPayments = await getTossPayments();
      await tossPayments.requestPayment(TOSS_METHOD_MAP[selectedMethod], {
        amount: payableAmount,
        orderId,
        orderName: `${event?.title ?? "티켓"} ${seatCount}매`,
        successUrl: `${window.location.origin}/booking/complete`,
        failUrl: `${window.location.origin}${window.location.pathname}?paymentFail=1`,
        customerName: buyerName,
        customerMobilePhone: buyerPhone.replace(/-/g, ""),
      });
      // requestPayment 는 성공 시 successUrl?paymentKey=...&orderId=...&amount=... 로 리다이렉트
      // — 이 이후 코드는 실행되지 않음
    } catch (err) {
      bookingSession.clear();
      if (err instanceof ApiError && err.status === 409) {
        setReservations([], "");
        setPhase("seats-taken");
      } else {
        setPhase("failed");
        retryTimer.start();
      }
    }
  }, [
    selectedDate,
    artistId,
    eventId,
    selectedSeatIds,
    currentUser,
    buyerName,
    buyerPhone,
    selectedMethod,
    event,
    seatCount,
    section,
    tierFee,
    userTier,
    retryTimer,
    setReservations,
    bookingSession,
  ]);

  const handleCancel = useCallback(() => {
    transitionTo("seats-individual");
  }, [transitionTo]);

  const handleRetry = useCallback(() => {
    setPhase("payment-form");
  }, []);

  const handleExitBooking = useCallback(async () => {
    // 좌석 선점이 있으면 취소 API 호출해 선점 해제
    if (reservationRefs.length > 0 && currentUser) {
      await Promise.allSettled(
        reservationRefs.flatMap((ref) =>
          ref.seatIds.map((seatId) =>
            cancelReservation(
              { eventId: ref.eventId, showId: ref.showId, seatId },
              currentUser.userId,
            ),
          ),
        ),
      );
    }
    // 구역 선택 화면으로 복귀 (취소 후 다른 좌석 선택 가능)
    transitionTo("seats-section");
  }, [reservationRefs, currentUser, transitionTo]);

  // --- Phase 1: Seat Confirmation ---
  if (phase === "confirm-seats") {
    return (
      <PaymentConfirmPhase
        event={event}
        selectedDate={selectedDate}
        seatDisplayNames={seatDisplayNames}
        seatCount={seatCount}
        section={section}
        hasUserTierWindow={hasUserTierWindow}
        userTier={userTier}
        tierFee={tierFee}
        total={total}
        onCancel={handleCancel}
        onGoToPayment={handleGoToPayment}
      />
    );
  }

  // --- Phase 2: Payment Form ---
  if (phase === "payment-form") {
    return (
      <PaymentFormPhase
        event={event}
        selectedDate={selectedDate}
        seatDisplayNames={seatDisplayNames}
        hasUserTierWindow={hasUserTierWindow}
        subtotal={subtotal}
        feeTotal={feeTotal}
        total={total}
        buyerName={buyerName}
        buyerPhone={buyerPhone}
        selectedMethod={selectedMethod}
        termsAgreed={termsAgreed}
        isFormValid={isFormValid}
        onBack={handleBackToConfirm}
        onNameChange={handleNameChange}
        onPhoneChange={handlePhoneChange}
        onMethodChange={setSelectedMethod}
        onToggleTerms={toggleTerms}
        onSubmit={handleSubmitPayment}
      />
    );
  }

  // --- Processing phase ---
  if (phase === "processing") {
    return <PaymentProcessingOverlay />;
  }

  // --- Seats taken phase (409) ---
  if (phase === "seats-taken") {
    return (
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] rounded-xl bg-white shadow-lg p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <CircleAlert size={48} className="text-destructive" />
              <h3 className="text-lg font-bold">이미 선점된 좌석입니다</h3>
              <p className="text-sm text-muted-foreground">
                선택하신 좌석을 다른 분이 먼저 선점했습니다.
                <br />
                다른 좌석을 선택해 주세요.
              </p>
              <Button className="w-full mt-2" onClick={handleExitBooking}>
                좌석 다시 선택하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
