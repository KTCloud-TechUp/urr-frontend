import { create } from "zustand";
import type { BookingState, ConfirmationData } from "@/shared/types";

export interface ReservationRef {
  eventId: number;
  showId: number;
  seatIds: string[];
}

interface BookingStore {
  // 상태
  bookingState: BookingState;
  selectedDateId: string | null;
  isLeftPanelExpanded: boolean;
  isLoading: boolean;
  selectedSectionId: string | null;
  selectedSeatIds: string[];
  confirmationData: ConfirmationData | null;
  seatTimerSecondsLeft: number | null;
  queueToken: string | null;
  /** bookTicket() 응답으로 받은 예약 참조 배열 — confirmReservation() 호출에 사용 */
  reservationRefs: ReservationRef[];
  /** Toss 결제 orderId — 결제 레코드와 reservationRefs 연결 */
  orderId: string | null;

  // 액션
  setEventLoaded: (dateId: string) => void;
  selectDate: (dateId: string) => void;
  toggleLeftPanel: () => void;
  setLeftPanel: (expanded: boolean) => void;
  /** 상태 전이. seats-section으로 전이 시 선택 좌석/구역 초기화 */
  transitionTo: (state: BookingState) => void;
  selectSection: (sectionId: string) => void;
  /** 좌석 토글. maxSeats 초과 시 무시 */
  toggleSeat: (seatId: string, maxSeats: number) => void;
  reset: () => void;
  setConfirmationData: (data: ConfirmationData) => void;
  setSeatTimerSecondsLeft: (seconds: number | null) => void;
  setQueueToken: (token: string | null) => void;
  /** bookTicket() 완료 후 예약 참조 배열과 orderId를 store에 저장 */
  setReservations: (refs: ReservationRef[], orderId: string) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookingState: "idle",
  selectedDateId: null,
  isLeftPanelExpanded: true,
  isLoading: true,
  selectedSectionId: null,
  selectedSeatIds: [],
  confirmationData: null,
  seatTimerSecondsLeft: null,
  queueToken: null,
  reservationRefs: [],
  orderId: null,

  setEventLoaded: (dateId) => set({ selectedDateId: dateId, isLoading: false }),

  selectDate: (dateId) => set({ selectedDateId: dateId }),

  toggleLeftPanel: () =>
    set((s) => ({ isLeftPanelExpanded: !s.isLeftPanelExpanded })),

  setLeftPanel: (expanded) => set({ isLeftPanelExpanded: expanded }),

  transitionTo: (state) =>
    set((s) => {
      if (state === "seats-section") {
        return { ...s, bookingState: state, selectedSeatIds: [], selectedSectionId: null };
      }
      return { ...s, bookingState: state };
    }),

  selectSection: (sectionId) =>
    set({ selectedSectionId: sectionId, selectedSeatIds: [] }),

  toggleSeat: (seatId, maxSeats) =>
    set((s) => {
      const current = s.selectedSeatIds;
      if (current.includes(seatId)) {
        return { selectedSeatIds: current.filter((id) => id !== seatId) };
      }
      if (current.length >= maxSeats) return s;
      return { selectedSeatIds: [...current, seatId] };
    }),

  reset: () =>
    set({
      bookingState: "idle",
      isLoading: true,
      selectedSectionId: null,
      selectedSeatIds: [],
      confirmationData: null,
      seatTimerSecondsLeft: null,
      reservationRefs: [],
      orderId: null,
    }),

  setConfirmationData: (data) => set({ confirmationData: data }),

  setSeatTimerSecondsLeft: (seconds) => set({ seatTimerSecondsLeft: seconds }),

  setQueueToken: (token) => set({ queueToken: token }),

  setReservations: (refs, orderId) => set({ reservationRefs: refs, orderId }),
}));
