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
import { getSections } from "@/features/show/api/getSections";
import { getSeatsSummary } from "@/features/booking/api/getSeatsSummary";
import { getBookingWindows } from "@/features/booking/api/getBookingWindows";
import { getEvents } from "@/features/event/api/getEvents";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { useBookingStore } from "./useBookingStore";
import { releaseReservation } from "../api/releaseReservation";
import { getUserIdFromToken } from "@/shared/lib/jwt";
import type { TierWindow } from "@/shared/types";

// Fallback tier price map (used when sections API is unavailable)
const TIER_PRICES_FALLBACK: Record<string, number> = {
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
  paymentFailed: boolean;
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
  clearPaymentFailed: () => void;
}

export const BookingContext = createContext<BookingContextValue | null>(null);

interface BookingProviderProps {
  eventId: string;
  children: ReactNode;
}

export function BookingProvider({ eventId, children }: BookingProviderProps) {
  useCurrentUser();

  const [paymentFailed, setPaymentFailed] = useState(false);

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
    reservationRefs,
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

  // Toss 결제 실패 복귀 처리: failUrl(?paymentFail=1)로 돌아왔을 때
  // 성공 시에는 /booking/complete 페이지로 이동하므로 여기서 처리하지 않음
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.get("paymentFail")) return;

    window.history.replaceState({}, "", window.location.pathname);
    sessionStorage.removeItem("urr:toss:booking");
    sessionStorage.removeItem("urr:toss:reservations");
    sessionStorage.removeItem("urr:toss:userId");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaymentFailed(true);
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

  // Fetch section pricing (API #30)
  const { data: sectionsData } = useQuery({
    queryKey: ["show-sections", showId],
    queryFn: () => getSections(showId!),
    enabled: needsSeatsSummary && showId !== null,
    staleTime: 5 * 60 * 1000,
  });

  // Build sectionCode → price lookup from sections API
  const sectionPriceMap = useMemo(() => {
    if (!sectionsData) return new Map<string, number>();
    return new Map(sectionsData.sections.map((s) => [s.code, s.price]));
  }, [sectionsData]);

  // Map summary zones to Section[]
  const sectionsForDate: Section[] = useMemo(() => {
    if (!seatsSummary) return [];
    return seatsSummary.tiers.flatMap((tier) =>
      tier.zones.map((zone) => ({
        id: zone.sectionCode,
        name: zone.sectionCode,
        price:
          sectionPriceMap.get(zone.sectionCode) ??
          TIER_PRICES_FALLBACK[tier.tier] ??
          99000,
        totalSeats: zone.totalSeats,
        remainingSeats: zone.bookableSeats,
      })),
    );
  }, [seatsSummary, sectionPriceMap]);

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
    const allReservationIds = reservationRefs.flatMap((ref) => ref.reservationIds);
    if (allReservationIds.length > 0) {
      const userId = getUserIdFromToken();
      if (userId) {
        releaseReservation(
          { reservationIds: allReservationIds, reason: "USER_ABORT" },
          userId,
        ).catch(() => {/* fire-and-forget */});
      }
    }
    reset();
  }, [reset, reservationRefs]);

  const clearPaymentFailed = useCallback(() => {
    setPaymentFailed(false);
  }, []);

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
      paymentFailed,
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
      clearPaymentFailed,
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
      paymentFailed,
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
      clearPaymentFailed,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
