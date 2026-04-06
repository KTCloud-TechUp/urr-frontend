"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { getMyReservations } from "../api/getMyReservations";
import { getEvents } from "@/features/event";
import { getShows } from "@/features/show";
import type { Ticket, Event } from "@/shared/types";

function parseSeatId(seatId: string): { section: string; row: string; seatNumber: string } {
  // seatId 형식이 불명확하므로 그대로 표시
  return { section: seatId, row: "-", seatNumber: "-" };
}

export function useMyReservations(userId?: string | number) {
  const { data: reservations = [], isLoading: resLoading } = useQuery({
    queryKey: ["my-reservations", userId, "CONFIRMED"],
    queryFn: () => getMyReservations(userId!, "CONFIRMED"),
    enabled: userId !== undefined,
  });

  const { data: allEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // 예약에 포함된 고유 eventId 목록
  const uniqueEventIds = [...new Set(reservations.map((r) => r.eventId))];

  const showResults = useQueries({
    queries: uniqueEventIds.map((eventId) => ({
      queryKey: ["shows", String(eventId)],
      queryFn: () => getShows(eventId),
      enabled: uniqueEventIds.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = resLoading || eventsLoading || showResults.some((r) => r.isLoading);

  const tickets: (Ticket & { event: Event })[] = reservations.flatMap((r) => {
    const eventSummary = allEvents.find((e) => e.eventId === r.eventId);
    const eventIndex = uniqueEventIds.indexOf(r.eventId);
    const shows = showResults[eventIndex]?.data ?? [];
    const show = shows.find((s) => s.showId === r.showId);

    const event: Event = {
      id: String(r.eventId),
      artistId: String(eventSummary?.artistId ?? ""),
      title: eventSummary?.title ?? `공연 #${r.eventId}`,
      venue: eventSummary?.venueTemplateName ?? "",
      dates: show
        ? [{ id: String(show.showId), date: show.startAt, bookingWindows: [], totalSeats: show.capacity, remainingSeats: show.remainingSeats }]
        : eventSummary
          ? [{ id: "1", date: eventSummary.openDate + "T19:00:00", bookingWindows: [], totalSeats: 0, remainingSeats: 0 }]
          : [],
      poster: eventSummary?.posterImageUrl ?? "",
      status: eventSummary?.active ? "open" : "closed",
    };

    const showDate = show?.startAt ?? eventSummary?.openDate ?? null;
    const isUpcoming = showDate ? new Date(showDate) > new Date() : false;

    const { section, row, seatNumber } = parseSeatId(r.seatId);

    const ticket: Ticket & { event: Event } = {
      id: r.reservationId,
      eventId: String(r.eventId),
      section,
      row,
      seatNumber,
      price: 0,
      tierFee: 0,
      qrCode: r.reservationId,
      isTransferable: isUpcoming,
      isUpcoming,
      event,
    };

    return [ticket];
  });

  return { tickets, isLoading };
}
