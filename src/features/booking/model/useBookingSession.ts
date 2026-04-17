import type { ReservationRef } from "./useBookingStore";
import type { ConfirmationData } from "@/shared/types";

const KEYS = {
  booking: "urr:toss:booking",
  reservations: "urr:toss:reservations",
  userId: "urr:toss:userId",
} as const;

export function useBookingSession() {
  function save(
    reservationRefList: ReservationRef[],
    confirmationData: ConfirmationData,
    userId: string,
  ) {
    sessionStorage.setItem(KEYS.reservations, JSON.stringify(reservationRefList));
    sessionStorage.setItem(KEYS.booking, JSON.stringify(confirmationData));
    sessionStorage.setItem(KEYS.userId, userId);
  }

  function clear() {
    sessionStorage.removeItem(KEYS.booking);
    sessionStorage.removeItem(KEYS.reservations);
    sessionStorage.removeItem(KEYS.userId);
  }

  function consume(): {
    confirmationData: ConfirmationData;
    reservationRefs: ReservationRef[];
    userId: string;
  } | null {
    const raw = sessionStorage.getItem(KEYS.booking);
    const rawReservations = sessionStorage.getItem(KEYS.reservations);
    const userId = sessionStorage.getItem(KEYS.userId) ?? "";
    clear();
    if (!raw) return null;
    return {
      confirmationData: JSON.parse(raw) as ConfirmationData,
      reservationRefs: rawReservations
        ? (JSON.parse(rawReservations) as ReservationRef[])
        : [],
      userId,
    };
  }

  return { save, clear, consume };
}
