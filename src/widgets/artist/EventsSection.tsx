"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight, Ticket } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { BookingStatusBadge } from "@/entities/event";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { formatDateFull, formatDateShort } from "@/shared/lib/format";
import type { Artist, Event } from "@/shared/types";

interface EventsSectionProps {
  artist: Artist;
  nextEvent?: Event;
  upcomingEvents: Event[];
  hasRepresentativeImage?: boolean;
  onNavigateTab: (tab: string) => void;
}

export function EventsSection({
  artist,
  nextEvent,
  upcomingEvents,
  hasRepresentativeImage,
  onNavigateTab,
}: EventsSectionProps) {
  if (hasRepresentativeImage === false) return null;

  const firstDate = nextEvent?.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateFull(firstDate) : "";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Ticket size={20} className="text-muted-foreground" />
          공연
        </h2>
        {upcomingEvents.length > 0 && (
          <button
            onClick={() => onNavigateTab("events")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            전체 보기
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {nextEvent ? (
        <div className="space-y-3">
          <Link
            href={`/events/${nextEvent.id}`}
            className="group block rounded-xl overflow-hidden border border-border bg-card hover:border-primary/20 transition-all"
          >
            <div className="flex">
              <div
                className="w-[160px] shrink-0 relative overflow-hidden"
                style={{ background: getArtistGradient(artist.id) }}
              >
                {nextEvent.poster ? (
                  <Image
                    src={nextEvent.poster}
                    alt={nextEvent.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {nextEvent.title.split(" ")[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {nextEvent.title}
                    </h3>
                    <BookingStatusBadge status={nextEvent.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {nextEvent.venue}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm">예매하기</Button>
                </div>
              </div>
            </div>
          </Link>

          {upcomingEvents.length > 1 && (
            <div className="rounded-lg border border-border overflow-hidden">
              {upcomingEvents.slice(1, 4).map((event, idx) => {
                const evDate = event.dates[0]?.date ?? "";
                const evDateStr = evDate ? formatDateShort(evDate) : "";
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors",
                      idx > 0 && "border-t border-border",
                    )}
                  >
                    <div
                      className="size-9 rounded-lg shrink-0 overflow-hidden relative"
                      style={{ background: getArtistGradient(artist.id) }}
                    >
                      {event.poster ? (
                        <Image
                          src={event.poster}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium">
                          {event.title.split(" ")[0]?.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evDateStr} · {event.venue}
                      </p>
                    </div>
                    <BookingStatusBadge status={event.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <Calendar size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">예정된 공연이 없습니다</p>
        </div>
      )}
    </section>
  );
}
