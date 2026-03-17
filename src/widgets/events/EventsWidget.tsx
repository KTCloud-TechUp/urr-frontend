"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FilterChip, ScrollableRow, ViewToggle } from "@/shared/ui";
import { EventTagBadge } from "@/entities/event";
import {
  allEventsData,
  eventCategoryFilters,
  filterEventsByCategory,
  popularEvents,
  type EventCategoryFilter,
  type EventListItem,
} from "@/shared/lib/mocks/events-page";

/* ------------------------------------------------------------------ */
/*  PopularEventCard — carousel card with poster overlay              */
/* ------------------------------------------------------------------ */

function PopularEventCard({ event }: { event: EventListItem }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group shrink-0 w-[240px] rounded-xl overflow-hidden relative block"
    >
      {/* Poster image */}
      <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Tag badge (top-left) */}
      {event.tags && event.tags.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Text overlay (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
          {event.title}
        </h3>
        <p className="text-white/70 text-xs truncate">{event.venue}</p>
        <p className="text-white/70 text-xs">{event.dateRange}</p>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  EventGridCard — grid view card                                    */
/* ------------------------------------------------------------------ */

function EventGridCard({ event }: { event: EventListItem }) {
  return (
    <Link href={`/events/${event.id}`} className="group min-w-0">
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-muted">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-2.5 space-y-1.5">
        <p className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{event.venue}</p>
        <p className="text-xs text-muted-foreground">{event.dateRange}</p>
        {event.tags && event.tags.length > 0 && (
          <div className="flex gap-1 pt-0.5">
            {event.tags.map((tag) => (
              <EventTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  EventListRow — list view row                                      */
/* ------------------------------------------------------------------ */

function EventListRow({ event }: { event: EventListItem }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-[#F3F2F0] transition-colors"
    >
      <div className="relative w-[72px] aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="text-base font-semibold truncate group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-[13px] text-muted-foreground truncate">
          {event.artistName} · {event.venue}
        </p>
        <p className="text-[13px] text-muted-foreground">{event.dateRange}</p>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  main                                                              */
/* ------------------------------------------------------------------ */

export function EventsWidget() {
  const [category, setCategory] = useState<EventCategoryFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEvents = useMemo(() => {
    return filterEventsByCategory(allEventsData, category);
  }, [category]);

  return (
    <div className="space-y-14">
      {/* ===== 1. 가장 인기있는 공연 ===== */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold">가장 인기있는 공연</h2>
        <ScrollableRow className="flex gap-4">
          {popularEvents.map((event) => (
            <PopularEventCard key={event.id} event={event} />
          ))}
        </ScrollableRow>
      </section>

      {/* ===== 2. 전체 공연 보기 ===== */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold">전체 공연 보기</h2>
        <div className="flex items-center justify-between">
          <FilterChip options={eventCategoryFilters} value={category} onChange={setCategory} />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        {/* Result count */}
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{filteredEvents.length}개</span>의 공연
        </p>

        {/* Grid or List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            해당 카테고리에 공연이 없습니다.
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-5 gap-x-4 gap-y-10">
            {filteredEvents.map((event) => (
              <EventGridCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEvents.map((event) => (
              <EventListRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
