"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { BookingStatusBadge } from "@/entities/event";
import { formatDateCompact } from "@/shared/lib/format";
import type { Artist } from "@/shared/types";
import type { SearchableEvent } from "@/shared/lib/mocks/search";

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function ArtistResultRow({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      {artist.avatar ? (
        <Image
          src={artist.avatar}
          alt={artist.name}
          width={48}
          height={48}
          className="size-12 rounded-full shrink-0 object-cover"
        />
      ) : (
        <div
          className="size-12 rounded-full shrink-0"
          style={{ background: getArtistGradient(artist.id) }}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate">{artist.name}</p>
        {artist.followerCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            팔로워 {formatFollowers(artist.followerCount)}
          </p>
        )}
      </div>
    </Link>
  );
}

function EventResultRow({ event }: { event: SearchableEvent }) {
  const firstDate = event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateCompact(firstDate) : "";

  return (
    <Link
      href={`/events/${event.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      {event.poster ? (
        <Image
          src={event.poster}
          alt={event.title}
          width={60}
          height={60}
          className="size-15 rounded-lg shrink-0 object-cover"
        />
      ) : (
        <div
          className="size-15 rounded-lg shrink-0"
          style={{ background: getArtistGradient(event.artistId) }}
        />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{event.title}</p>
          <BookingStatusBadge status={event.status} />
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {event.artistName} · {dateStr} · {event.venue}
        </p>
      </div>
    </Link>
  );
}

interface SearchResultsProps {
  filteredArtists: Artist[];
  filteredEvents: SearchableEvent[];
  visibleArtists: Artist[];
  visibleEvents: SearchableEvent[];
  showAllArtists: boolean;
  showAllEvents: boolean;
  onShowMoreArtists: () => void;
  onShowMoreEvents: () => void;
}

export function SearchResults({
  filteredArtists,
  filteredEvents,
  visibleArtists,
  visibleEvents,
  showAllArtists,
  showAllEvents,
  onShowMoreArtists,
  onShowMoreEvents,
}: SearchResultsProps) {
  return (
    <div className="space-y-6">
      {filteredArtists.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-1">
            <Users size={16} />
            아티스트
            <span className="text-xs font-normal">({filteredArtists.length})</span>
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {visibleArtists.map((a) => (
              <ArtistResultRow key={a.id} artist={a} />
            ))}
          </div>
          {filteredArtists.length > 5 && !showAllArtists && (
            <button
              onClick={onShowMoreArtists}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer"
            >
              아티스트 {filteredArtists.length - 5}개 더 보기
            </button>
          )}
        </section>
      )}

      {filteredEvents.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-1">
            <Calendar size={16} />
            공연
            <span className="text-xs font-normal">({filteredEvents.length})</span>
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {visibleEvents.map((e) => (
              <EventResultRow key={e.id} event={e} />
            ))}
          </div>
          {filteredEvents.length > 5 && !showAllEvents && (
            <button
              onClick={onShowMoreEvents}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer"
            >
              공연 {filteredEvents.length - 5}개 더 보기
            </button>
          )}
        </section>
      )}
    </div>
  );
}
