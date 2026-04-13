"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/features/booking/model/useBookingStore";

interface BookingGuardProps {
  eventId: string;
  children: ReactNode;
}

/**
 * 예매 페이지 직접 URL 접근 차단.
 * sessionStorage에 "urr:booking:startPhase" 키가 없으면
 * 공연 상세 페이지로 돌려보낸다.
 * 키가 있으면 store를 초기화(isLoading=true)해서 BookingContext가
 * 해당 키를 읽어 올바른 phase로 전이할 수 있게 한다.
 */
export function BookingGuard({ eventId, children }: BookingGuardProps) {
  const router = useRouter();
  const reset = useBookingStore((s) => s.reset);
  // SSR 안전: sessionStorage는 클라이언트에서만 접근 가능
  const [authorized] = useState(() => {
    if (typeof window === "undefined") return false;
    // 일반 진입: startPhase 키 존재 여부
    if (sessionStorage.getItem("urr:booking:startPhase") !== null) return true;
    // Toss 결제 실패 복귀: failUrl(?paymentFail=1)로 돌아왔을 때 허용
    return new URLSearchParams(window.location.search).has("paymentFail");
  });

  useEffect(() => {
    if (!authorized) {
      router.replace(`/events/${eventId}`);
    } else {
      // store를 초기화해 isLoading=true로 만들어야
      // BookingContext.useEffect가 startPhase 키를 소비하고 올바른 phase로 전이할 수 있게 한다.
      reset();
    }
  }, [authorized, eventId, router, reset]);

  if (!authorized) return null;

  return <>{children}</>;
}
