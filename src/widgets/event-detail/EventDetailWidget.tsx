"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/shared/ui";
import { getEvents } from "@/features/event";
import { getShows } from "@/features/show";
import { getPresalePolicy } from "@/features/membership";
import type { EventSummary } from "@/features/event";
import type { ShowSummary } from "@/features/show";
import type { PresalePolicy } from "@/features/membership";
import type { TierLevel, TierWindow } from "@/shared/types";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";
import { EventDetailHero } from "./EventDetailHero";
import { EventDetailTabs } from "./EventDetailTabs";
import { EventBookingSidebar } from "./EventBookingSidebar";

function mapPresalePolicyToWindows(policy: PresalePolicy | undefined): TierWindow[] {
  if (!policy) return [];
  return policy.tiers.map((t) => ({
    tier: t.tier.toLowerCase() as TierLevel,
    opensAt: t.openAt,
    fee: t.bookingFeeWon,
  }));
}

function mapToEventDetail(
  event: EventSummary,
  shows: ShowSummary[],
  presalePolicies: (PresalePolicy | undefined)[],
): EventDetail {
  const dates = shows.map((show, i) => ({
    id: String(show.showId),
    date: show.startAt,
    bookingWindows: mapPresalePolicyToWindows(presalePolicies[i]),
    totalSeats: show.capacity,
    remainingSeats: show.capacity,
  }));

  if (dates.length === 0) {
    dates.push({
      id: "1",
      date: event.openDate + "T19:00:00",
      bookingWindows: [],
      totalSeats: 0,
      remainingSeats: 0,
    });
  }

  return {
    id: String(event.eventId),
    artistId: String(event.artistId),
    artistName: event.artistName ?? "",
    title: event.title,
    subtitle: "",
    venue: event.venueTemplateName,
    venueAddress: "",
    dates,
    poster: event.posterImageUrl ?? "",
    status: event.active ? "open" : "closed",
    category: event.category ?? "concert",
    tags: event.tags ?? [],
    runtime: "미정",
    ageRating: "전체 이용가",
    notices: [],
    membershipPreSaleNotice: [],
    identityVerification: [],
    castInfo: "",
    performanceDescription: event.description,
    organizer: { host: "", manager: "", contact: "", email: "" },
    sections: [],
    bookingFee: "미정",
    shippingFee: "미정",
    validityPeriod: "미정",
    cancellationPolicy: [],
    ticketDelivery: [],
    mobileTicketInfo: [],
    precautions: [],
    sellerInfo: { name: "URR", bizNumber: "", ceo: "", address: "" },
    escrowInfo: "",
  };
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-100 rounded-xl" />
          <Skeleton className="h-50 rounded-xl" />
        </div>
        <div className="w-100 shrink-0">
          <Skeleton className="h-125 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface EventDetailWidgetProps {
  eventId: string;
}

export function EventDetailWidget({ eventId }: EventDetailWidgetProps) {
  const { data: allEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const eventSummary = allEvents?.find((e) => String(e.eventId) === eventId);

  const { data: shows = [], isLoading: showsLoading } = useQuery({
    queryKey: ["shows", eventId],
    queryFn: () => getShows(eventId),
    enabled: !!eventSummary,
  });

  const presalePolicyResults = useQueries({
    queries: shows.map((show) => ({
      queryKey: ["presale-policy", eventId, show.showId],
      queryFn: () => getPresalePolicy(eventId, show.showId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = eventsLoading || showsLoading;

  if (isLoading) return <EventDetailSkeleton />;

  if (!eventSummary) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">공연을 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">
          요청하신 공연 정보가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link
          href="/events"
          className="text-sm text-primary hover:underline mt-2"
        >
          공연 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const presalePolicies = presalePolicyResults.map((r) => r.data);
  const event = mapToEventDetail(eventSummary, shows, presalePolicies);

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        공연 목록으로 돌아가기
      </Link>

      {/* Two-panel layout */}
      <div className="flex gap-8">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 space-y-8">
          <EventDetailHero event={event} />
          <EventDetailTabs event={event} />
        </div>

        {/* Right: Sticky sidebar */}
        <div className="w-100 shrink-0">
          <div className="sticky top-6">
            <EventBookingSidebar event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
