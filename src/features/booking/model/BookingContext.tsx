"use client";

import {
  createContext,
  useContext,
  useState,
  useReducer,
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

interface BookingInternalState {
  bookingState: BookingState;
  selectedDateId: string | null;
  isLeftPanelExpanded: boolean;
  isLoading: boolean;
  selectedSectionId: string | null;
  selectedSeatIds: string[];
  confirmationData: ConfirmationData | null;
  seatTimerSecondsLeft: number | null;
  queueToken: string | null;
}

type BookingAction =
  | { type: "SET_EVENT_LOADED"; payload: { dateId: string } }
  | { type: "SELECT_DATE"; payload: string }
  | { type: "TOGGLE_LEFT_PANEL" }
  | { type: "SET_LEFT_PANEL"; payload: boolean }
  | { type: "TRANSITION_STATE"; payload: BookingState }
  | { type: "SELECT_SECTION"; payload: string }
  | { type: "TOGGLE_SEAT"; payload: { seatId: string; maxSeats: number } }
  | { type: "RESET_BOOKING" }
  | { type: "SET_CONFIRMATION_DATA"; payload: ConfirmationData }
  | { type: "SET_SEAT_TIMER"; payload: number }
  | { type: "SET_QUEUE_TOKEN"; payload: string | null };

export interface BookingContextValue {
  eventId: string;
  bookingState: BookingState;
  event: BookingEvent | null;
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

const initialState: BookingInternalState = {
  bookingState: "idle",
  selectedDateId: null,
  isLeftPanelExpanded: true,
  isLoading: true,
  selectedSectionId: null,
  selectedSeatIds: [],
  confirmationData: null,
  seatTimerSecondsLeft: null,
  queueToken: null,
};

function bookingReducer(
  state: BookingInternalState,
  action: BookingAction,
): BookingInternalState {
  switch (action.type) {
    case "SET_EVENT_LOADED":
      return { ...state, selectedDateId: action.payload.dateId, isLoading: false };
    case "SELECT_DATE":
      return { ...state, selectedDateId: action.payload };
    case "TOGGLE_LEFT_PANEL":
      return { ...state, isLeftPanelExpanded: !state.isLeftPanelExpanded };
    case "SET_LEFT_PANEL":
      return { ...state, isLeftPanelExpanded: action.payload };
    case "TRANSITION_STATE":
      if (action.payload === "seats-section") {
        return { ...state, bookingState: action.payload, selectedSeatIds: [], selectedSectionId: null };
      }
      return { ...state, bookingState: action.payload };
    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.payload, selectedSeatIds: [] };
    case "TOGGLE_SEAT": {
      const { seatId, maxSeats } = action.payload;
      const current = state.selectedSeatIds;
      if (current.includes(seatId)) {
        return { ...state, selectedSeatIds: current.filter((id) => id !== seatId) };
      }
      if (current.length >= maxSeats) return state;
      return { ...state, selectedSeatIds: [...current, seatId] };
    }
    case "RESET_BOOKING":
      return {
        ...state,
        bookingState: "idle",
        selectedSectionId: null,
        selectedSeatIds: [],
        confirmationData: null,
        seatTimerSecondsLeft: null,
      };
    case "SET_CONFIRMATION_DATA":
      return { ...state, confirmationData: action.payload };
    case "SET_SEAT_TIMER":
      return { ...state, seatTimerSecondsLeft: action.payload };
    case "SET_QUEUE_TOKEN":
      return { ...state, queueToken: action.payload };
    default:
      return state;
  }
}

export const BookingContext = createContext<BookingContextValue | null>(null);

interface BookingProviderProps {
  eventId: string;
  children: ReactNode;
}

export function BookingProvider({ eventId, children }: BookingProviderProps) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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
    if (!showsLoading && eventDates.length > 0 && state.isLoading) {
      dispatch({
        type: "SET_EVENT_LOADED",
        payload: { dateId: eventDates[0].id },
      });
      const startPhase = sessionStorage.getItem("urr:booking:startPhase") as BookingState | null;
      if (startPhase) {
        sessionStorage.removeItem("urr:booking:startPhase");
        dispatch({ type: "TRANSITION_STATE", payload: startPhase });
      }
    }
  }, [showsLoading, eventDates, state.isLoading]);

  // showId derived from selectedDateId
  const showId = state.selectedDateId ? Number(state.selectedDateId) : null;

  // Fetch seats summary for currently selected show
  const { data: seatsSummary } = useQuery({
    queryKey: ["seats-summary", eventId, showId],
    queryFn: () => getSeatsSummary(eventId, showId!),
    enabled: showId !== null,
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
    if (!state.selectedDateId) return null;
    return eventDates.find((d) => d.id === state.selectedDateId) ?? null;
  }, [state.selectedDateId, eventDates]);

  // Merge: prefer API booking-windows data; fall back to getShows() data
  const tierWindows: TierWindow[] = useMemo(() => {
    if (bookingWindowsData?.tierPolicies?.length) {
      return bookingWindowsData.tierPolicies.map((tp) => ({
        tier: tp.tier as TierLevel,
        opensAt: tp.openAt,
        fee: tp.bookingFeeWon,
      }));
    }
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

  const selectDate = useCallback((dateId: string) => {
    dispatch({ type: "SELECT_DATE", payload: dateId });
  }, []);

  const toggleLeftPanel = useCallback(() => {
    dispatch({ type: "TOGGLE_LEFT_PANEL" });
  }, []);

  const setLeftPanel = useCallback((expanded: boolean) => {
    dispatch({ type: "SET_LEFT_PANEL", payload: expanded });
  }, []);

  const transitionTo = useCallback((nextState: BookingState) => {
    dispatch({ type: "TRANSITION_STATE", payload: nextState });
  }, []);

  const startBooking = useCallback(() => {
    dispatch({ type: "TRANSITION_STATE", payload: "queue" });
  }, []);

  const selectSection = useCallback((sectionId: string) => {
    dispatch({ type: "SELECT_SECTION", payload: sectionId });
  }, []);

  const toggleSeat = useCallback(
    (seatId: string) => {
      dispatch({ type: "TOGGLE_SEAT", payload: { seatId, maxSeats } });
    },
    [maxSeats],
  );

  const resetBooking = useCallback(() => {
    dispatch({ type: "RESET_BOOKING" });
  }, []);

  const setConfirmationData = useCallback((data: ConfirmationData) => {
    dispatch({ type: "SET_CONFIRMATION_DATA", payload: data });
  }, []);

  const setSeatTimerSecondsLeft = useCallback((seconds: number) => {
    dispatch({ type: "SET_SEAT_TIMER", payload: seconds });
  }, []);

  const setQueueToken = useCallback((token: string | null) => {
    dispatch({ type: "SET_QUEUE_TOKEN", payload: token });
  }, []);

  const value: BookingContextValue = useMemo(
    () => ({
      eventId,
      bookingState: state.bookingState,
      event,
      selectedDateId: state.selectedDateId,
      isLeftPanelExpanded: state.isLeftPanelExpanded,
      isLoading: state.isLoading,
      userTier,
      selectedDate,
      tierWindows,
      sectionsForDate,
      isWindowOpen,
      isSoldOut,
      userWindowOpensAt,
      selectedSectionId: state.selectedSectionId,
      selectedSeatIds: state.selectedSeatIds,
      maxSeats,
      confirmationData: state.confirmationData,
      seatTimerSecondsLeft: state.seatTimerSecondsLeft,
      queueToken: state.queueToken,
      selectDate,
      toggleLeftPanel,
      setLeftPanel,
      transitionTo,
      startBooking,
      selectSection,
      toggleSeat,
      resetBooking,
      setConfirmationData,
      setSeatTimerSecondsLeft,
      setQueueToken,
    }),
    [
      eventId,
      state.bookingState,
      state.selectedDateId,
      state.isLeftPanelExpanded,
      state.isLoading,
      state.selectedSectionId,
      state.selectedSeatIds,
      state.confirmationData,
      state.seatTimerSecondsLeft,
      state.queueToken,
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
      toggleSeat,
      resetBooking,
      setConfirmationData,
      setSeatTimerSecondsLeft,
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
