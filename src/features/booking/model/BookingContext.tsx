"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  BookingState,
  TierLevel,
  Section,
  EventDate,
  ConfirmationData,
} from "@/shared/types";
import { mockEvent } from "@/shared/lib/mocks/event-detail";
import { mockUser } from "@/shared/lib/mocks/user";
import { MAX_SEATS_PER_TIER } from "@/shared/lib/mocks/seats";
import { getShows } from "@/features/show/api/getShows";
import { getSeatsSummary } from "@/features/booking/api/getSeatsSummary";
import { getBookingWindows } from "@/features/booking/api/getBookingWindows";
import { confirmPayment } from "@/features/payment/api/confirmPayment";
import { confirmReservation } from "@/features/booking/api/confirmReservation";
import { getEvents } from "@/features/event/api/getEvents";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { useBookingStore, type ReservationRef } from "./useBookingStore";
import type { TierWindow } from "@/shared/types";

// Static tier price map (pricing API not yet available)
const TIER_PRICES: Record<string, number> = {
  VIP: 198000,
  S: 132000,
  R: 110000,
  A: 99000,
};

// --- Types ---

export interface BookingEvent {
  id: string;
  title: string;
  venue: string;
  poster: string;
  dates: EventDate[];
  status: string;
}

export interface BookingContextValue {
  eventId: string;
  artistId: string | null;
  bookingState: BookingState;
  event: BookingEvent | null;
  eventDates: EventDate[];
  selectedDateId: string | null;
  isLeftPanelExpanded: boolean;
  isLoading: boolean;
  userTier: TierLevel;
  selectedDate: EventDate | null;
  tierWindows: TierWindow[];
  sectionsForDate: Section[];
  isWindowOpen: boolean;
  isSoldOut: boolean;
  userWindowOpensAt: string | null;
  selectedSectionId: string | null;
  selectedSeatIds: string[];
  maxSeats: number;
  confirmationData: ConfirmationData | null;
  seatTimerSecondsLeft: number | null;
  queueToken: string | null;
  selectDate: (dateId: string) => void;
  toggleLeftPanel: () => void;
  setLeftPanel: (expanded: boolean) => void;
  transitionTo: (nextState: BookingState) => void;
  startBooking: () => void;
  selectSection: (sectionId: string) => void;
  toggleSeat: (seatId: string) => void;
  resetBooking: () => void;
  setConfirmationData: (data: ConfirmationData) => void;
  setSeatTimerSecondsLeft: (seconds: number) => void;
  setQueueToken: (token: string | null) => void;
}

export const BookingContext = createContext<BookingContextValue | null>(null);

interface BookingProviderProps {
  eventId: string;
  children: ReactNode;
}

export function BookingProvider({ eventId, children }: BookingProviderProps) {
  const { data: currentUser } = useCurrentUser();

  // Zustand store — 모든 클라이언트 상태머신 상태 관리
  const {
    bookingState,
    selectedDateId,
    isLeftPanelExpanded,
    isLoading,
    selectedSectionId,
    selectedSeatIds,
    confirmationData,
    seatTimerSecondsLeft,
    queueToken,
    setEventLoaded,
    selectDate,
    toggleLeftPanel,
    setLeftPanel,
    transitionTo,
    selectSection,
    toggleSeat,
    reset,
    setConfirmationData,
    setSeatTimerSecondsLeft,
    setQueueToken,
    setReservations,
  } = useBookingStore();

  // Fetch events list to derive artistId for this event
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 5 * 60 * 1000,
  });

  const artistId = useMemo(() => {
    if (!events) return null;
    const ev = events.find((e) => String(e.eventId) === String(eventId));
    return ev ? String(ev.artistId) : null;
  }, [events, eventId]);

  // Fetch shows for this event
  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ["shows", eventId],
    queryFn: () => getShows(eventId),
  });

  // Map shows to EventDate[] format
  const eventDates: EventDate[] = useMemo(() => {
    if (!shows) return [];
    return shows.map((show) => ({
      id: String(show.showId),
      date: show.startAt,
      bookingWindows: show.bookingWindows.map((bw) => ({
        tier: bw.tier as TierLevel,
        opensAt: bw.opensAt,
        fee: bw.fee,
      })),
      totalSeats: show.capacity,
      remainingSeats: show.remainingSeats,
    }));
  }, [shows]);

  // Initialize selectedDateId once shows are loaded
  useEffect(() => {
    if (!showsLoading && eventDates.length > 0 && isLoading) {
      setEventLoaded(eventDates[0].id);
      const startPhase = sessionStorage.getItem("urr:booking:startPhase") as BookingState | null;
      if (startPhase) {
        sessionStorage.removeItem("urr:booking:startPhase");
        transitionTo(startPhase);
      }
    }
  }, [showsLoading, eventDates, isLoading, setEventLoaded, transitionTo]);

  // Toss 결제 콜백 처리: successUrl 복귀 시 paymentKey URL 파라미터 감지
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    const paymentFail = params.get("paymentFail");

    if (paymentFail) {
      window.history.replaceState({}, "", window.location.pathname);
      sessionStorage.removeItem("urr:toss:booking");
      sessionStorage.removeItem("urr:toss:reservations");
      return;
    }

    if (!paymentKey || !orderId || !amount) return;

    const raw = sessionStorage.getItem("urr:toss:booking");
    if (!raw) return;

    // Toss 리다이렉트 후 메모리 초기화 → sessionStorage에서 reservationRefs 복원
    const rawReservations = sessionStorage.getItem("urr:toss:reservations");
    const restoredRefs: ReservationRef[] = rawReservations ? (JSON.parse(rawReservations) as ReservationRef[]) : [];

    sessionStorage.removeItem("urr:toss:booking");
    sessionStorage.removeItem("urr:toss:reservations");
    window.history.replaceState({}, "", window.location.pathname);

    const confirmationData = JSON.parse(raw) as ConfirmationData;

    // 1) Toss 결제 승인
    confirmPayment({ paymentKey, orderId, amount: Number(amount), userId: currentUser?.userId ?? "" })
      .then(() => {
        // 2) store에 reservationRefs 복원
        if (restoredRefs.length > 0) {
          setReservations(restoredRefs, orderId);
        }
        // 3) 각 예약 확정 (POST /api/v1/ticket/reservations/confirm)
        return Promise.allSettled(restoredRefs.map((ref) => confirmReservation(ref)));
      })
      .then(() => {
        setConfirmationData(confirmationData);
        transitionTo("confirmation");
      })
      .catch(() => {
        // 결제/확정 실패 시 idle로 복귀
        reset();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // showId derived from selectedDateId
  const showId = selectedDateId ? Number(selectedDateId) : null;

  // seats/summary는 구역 선택 화면에서만 필요 — 이벤트 상세페이지 등 idle 상태에서 호출 방지
  const needsSeatsSummary =
    bookingState === "seats-section" || bookingState === "seats-individual";
  const { data: seatsSummary } = useQuery({
    queryKey: ["seats-summary", eventId, showId],
    queryFn: () => getSeatsSummary(eventId, showId!),
    enabled: needsSeatsSummary && showId !== null,
  });

  // Fetch authoritative booking windows for the selected show
  const { data: bookingWindowsData } = useQuery({
    queryKey: ["booking-windows", eventId, showId],
    queryFn: () => getBookingWindows(eventId, showId!),
    enabled: showId !== null,
  });

  // Map summary zones to Section[]
  const sectionsForDate: Section[] = useMemo(() => {
    if (!seatsSummary) return [];
    return seatsSummary.tiers.flatMap((tier) =>
      tier.zones.map((zone) => ({
        id: zone.sectionCode,
        name: zone.sectionCode,
        price: TIER_PRICES[tier.tier] ?? 99000,
        totalSeats: zone.totalSeats,
        remainingSeats: zone.bookableSeats,
      })),
    );
  }, [seatsSummary]);

  // Build event object with real dates (keep mock metadata until event detail API is integrated)
  const event: BookingEvent | null = useMemo(() => {
    if (showsLoading || eventDates.length === 0) return null;
    return {
      id: mockEvent.id,
      title: mockEvent.title,
      venue: mockEvent.venue,
      poster: mockEvent.poster,
      status: mockEvent.status,
      dates: eventDates,
    };
  }, [showsLoading, eventDates]);

  const userTier = mockUser.tier;
  const maxSeats = MAX_SEATS_PER_TIER[userTier];

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const selectedDate = useMemo(() => {
    if (!selectedDateId) return null;
    return eventDates.find((d) => d.id === selectedDateId) ?? null;
  }, [selectedDateId, eventDates]);

  // Merge: prefer API booking-windows data; fall back to getShows() data
  const tierWindows: TierWindow[] = useMemo(() => {
    // 1순위: tierPolicies 배열
    if (bookingWindowsData?.tierPolicies?.length) {
      return bookingWindowsData.tierPolicies.map((tp) => ({
        tier: tp.tier as TierLevel,
        opensAt: tp.openAt,
        fee: tp.bookingFeeWon,
      }));
    }
    // 2순위: bookingWindows Record<tier, opensAt> 형태 (API가 이 포맷으로 반환하는 경우)
    if (bookingWindowsData?.bookingWindows) {
      const fromRecord = (Object.entries(bookingWindowsData.bookingWindows) as [string, string][])
        .filter(([, opensAt]) => !!opensAt)
        .map(([tier, opensAt]) => ({ tier: tier as TierLevel, opensAt, fee: 0 }));
      if (fromRecord.length > 0) return fromRecord;
    }
    // 3순위: getShows() 응답에 포함된 bookingWindows
    return selectedDate?.bookingWindows ?? [];
  }, [bookingWindowsData, selectedDate]);

  const userWindowOpensAt = useMemo(() => {
    const window = tierWindows.find((w) => w.tier === userTier);
    return window?.opensAt ?? null;
  }, [tierWindows, userTier]);

  const isWindowOpen = useMemo(() => {
    if (!userWindowOpensAt) return false;
    return new Date(userWindowOpensAt).getTime() <= now;
  }, [userWindowOpensAt, now]);

  const isSoldOut = useMemo(() => {
    if (sectionsForDate.length === 0) return false;
    return sectionsForDate.every((s) => s.remainingSeats === 0);
  }, [sectionsForDate]);

  const startBooking = useCallback(() => {
    transitionTo("queue");
  }, [transitionTo]);

  const handleToggleSeat = useCallback(
    (seatId: string) => {
      toggleSeat(seatId, maxSeats);
    },
    [toggleSeat, maxSeats],
  );

  const resetBooking = useCallback(() => {
    reset();
  }, [reset]);

  const handleSetSeatTimerSecondsLeft = useCallback(
    (seconds: number) => {
      setSeatTimerSecondsLeft(seconds);
    },
    [setSeatTimerSecondsLeft],
  );

  const value: BookingContextValue = useMemo(
    () => ({
      eventId,
      artistId,
      bookingState,
      event,
      eventDates,
      selectedDateId,
      isLeftPanelExpanded,
      isLoading,
      userTier,
      selectedDate,
      tierWindows,
      sectionsForDate,
      isWindowOpen,
      isSoldOut,
      userWindowOpensAt,
      selectedSectionId,
      selectedSeatIds,
      maxSeats,
      confirmationData,
      seatTimerSecondsLeft,
      queueToken,
      selectDate,
      toggleLeftPanel,
      setLeftPanel,
      transitionTo,
      startBooking,
      selectSection,
      toggleSeat: handleToggleSeat,
      resetBooking,
      setConfirmationData,
      setSeatTimerSecondsLeft: handleSetSeatTimerSecondsLeft,
      setQueueToken,
    }),
    [
      eventId,
      artistId,
      bookingState,
      eventDates,
      selectedDateId,
      isLeftPanelExpanded,
      isLoading,
      selectedSectionId,
      selectedSeatIds,
      confirmationData,
      seatTimerSecondsLeft,
      queueToken,
      event,
      userTier,
      selectedDate,
      tierWindows,
      sectionsForDate,
      isWindowOpen,
      isSoldOut,
      userWindowOpensAt,
      maxSeats,
      selectDate,
      toggleLeftPanel,
      setLeftPanel,
      transitionTo,
      startBooking,
      selectSection,
      handleToggleSeat,
      resetBooking,
      setConfirmationData,
      handleSetSeatTimerSecondsLeft,
      setQueueToken,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
