"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { getMyReservations } from "../api/getMyReservations";
import { getEvents } from "@/features/event";
import { getShows, getSections } from "@/features/show";
import type { Ticket, Event, TierLevel } from "@/shared/types";

// seatId 형식: "{tier}-{zoneNo}-{row}-{number}" 또는 "{sectionCode}-{row}-{number}"
// 예: "VIP-1-3-1" 또는 "VIP1-A-1"
function parseSeatId(seatId: string): {
  section: string;
  row: string;
  seatNumber: string;
} {
  const parts = seatId.split("-");
  if (parts.length >= 3) {
    const seatNumber = parts[parts.length - 1];
    const row = parts[parts.length - 2];
    const section = parts.slice(0, parts.length - 2).join("-");
    return { section, row, seatNumber };
  }
  return { section: seatId, row: "-", seatNumber: "-" };
}

function normalizeSectionCode(code: string): string {
  return code.replace(/-/g, "").toUpperCase();
}

function getTierFee(
  show: { bookingWindows: { tier: TierLevel; fee: number }[] } | undefined,
  userTier: TierLevel,
) {
  return (
    show?.bookingWindows.find((window) => window.tier === userTier)?.fee ?? 0
  );
}

export function useMyReservations(
  userId?: string | number,
  userTier: TierLevel = "MIST",
) {
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

  const uniqueShowIds = [...new Set(reservations.map((r) => r.showId))];

  const sectionResults = useQueries({
    queries: uniqueShowIds.map((showId) => ({
      queryKey: ["sections", String(showId)],
      queryFn: () => getSections(showId),
      enabled: uniqueShowIds.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading =
    resLoading ||
    eventsLoading ||
    showResults.some((r) => r.isLoading) ||
    sectionResults.some((r) => r.isLoading);

  const tickets: (Ticket & { event: Event })[] = reservations.flatMap((r) => {
    const eventSummary = allEvents.find((e) => e.eventId === r.eventId);
    const eventIndex = uniqueEventIds.indexOf(r.eventId);
    const shows = showResults[eventIndex]?.data ?? [];
    const show = shows.find((s) => s.showId === r.showId);
    const tierFee = getTierFee(show, userTier);

    const event: Event = {
      id: String(r.eventId),
      artistId: String(eventSummary?.artistId ?? ""),
      title: eventSummary?.title ?? `공연 #${r.eventId}`,
      venue: eventSummary?.venueTemplateName ?? "",
      dates: show
        ? [
            {
              id: String(show.showId),
              date: show.startAt,
              bookingWindows: [],
              totalSeats: show.capacity,
              remainingSeats: show.remainingSeats,
            },
          ]
        : eventSummary
          ? [
              {
                id: "1",
                date: eventSummary.openDate + "T19:00:00",
                bookingWindows: [],
                totalSeats: 0,
                remainingSeats: 0,
              },
            ]
          : [],
      poster: eventSummary?.posterImageUrl ?? "",
      status: eventSummary?.active ? "open" : "closed",
    };

    const showDate = show?.startAt ?? eventSummary?.openDate ?? null;
    const isUpcoming = showDate ? new Date(showDate) > new Date() : false;

    const { section, row, seatNumber } = parseSeatId(r.seatId);

    const showIndex = uniqueShowIds.indexOf(r.showId);
    const sections = sectionResults[showIndex]?.data?.sections ?? [];
    const tierCode = section.replace(/-?\d+$/, "");
    const normalizedSection = normalizeSectionCode(section);
    const matchedSection =
      sections.find((s) => s.code === section) ??
      sections.find(
        (s) => normalizeSectionCode(s.code) === normalizedSection,
      ) ??
      sections.find((s) => s.code === tierCode) ??
      sections.find(
        (s) => normalizeSectionCode(s.code) === normalizeSectionCode(tierCode),
      );
    const price = matchedSection?.price ?? 0;

    const ticket: Ticket & { event: Event } = {
      id: r.reservationId,
      eventId: String(r.eventId),
      showId: String(r.showId),
      seatId: r.seatId,
      section,
      row,
      seatNumber,
      price,
      tierFee,
      qrCode: r.reservationId,
      isTransferable: r.transferEligible,
      isUpcoming,
      event,
    };

    return [ticket];
  });

  return { tickets, isLoading };
}
