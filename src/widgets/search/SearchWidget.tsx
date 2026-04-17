"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  Users,
  Flame,
  SlidersHorizontal,
  ChevronDown,
  ListFilter,
  Loader2,
} from "lucide-react";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { getArtists } from "@/features/artist/api/getArtists";
import { getEvents } from "@/features/event/api/getEvents";
import { BookingStatusBadge } from "@/entities/event";
import type { Artist, BookingStatus } from "@/shared/types";
import type { SearchableEvent } from "@/shared/lib/mocks/search";
import type { ArtistSummary } from "@/features/artist/api/getArtists";
import type { EventSummary } from "@/features/event/api/getEvents";
import { TrendingSection } from "./TrendingSection";
import { SearchResults } from "./SearchResults";
import { useSearchFilters } from "./model/useSearchFilters";

/* ------------------------------------------------------------------ */
/*  mapping helpers                                                    */
/* ------------------------------------------------------------------ */

function toArtist(a: ArtistSummary): Artist {
  return {
    id: String(a.id),
    name: a.name,
    avatar: a.profileImageUrl ?? "",
    banner: "",
    bio: a.bio ?? "",
    followerCount: a.followerCount,
    category: (a.category?.toLowerCase() as Artist["category"]) ?? "solo",
  };
}

function toSearchableEvent(e: EventSummary): SearchableEvent {
  const status: BookingStatus = e.active ? "open" : "closed";
  return {
    id: String(e.eventId),
    artistId: String(e.artistId),
    title: e.title,
    venue: e.venueTemplateName,
    poster: e.posterImageUrl ?? "",
    status,
    dates: [
      {
        id: "0",
        date: e.openDate,
        bookingWindows: [],
        totalSeats: 0,
        remainingSeats: 0,
      },
    ],
    artistName: e.artistName ?? "",
  };
}

/* ------------------------------------------------------------------ */
/*  pre-search curation sub-components                                */
/* ------------------------------------------------------------------ */

function PopularArtistsSection({ artists }: { artists: Artist[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
        <Users size={18} />
        인기 아티스트
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {artists.slice(0, 10).map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.id}`}
            className="flex flex-col items-center gap-2 shrink-0 w-18 group"
          >
            {artist.avatar ? (
              <Image
                src={artist.avatar}
                alt={artist.name}
                width={64}
                height={64}
                className="size-16 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/40 transition-all"
              />
            ) : (
              <div
                className="size-16 rounded-full ring-2 ring-transparent group-hover:ring-primary/40 transition-all"
                style={{ background: getArtistGradient(artist.id) }}
              />
            )}
            <span className="text-xs font-medium text-center truncate w-full">
              {artist.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PopularEventsSection({ events }: { events: SearchableEvent[] }) {
  const top5 = events.slice(0, 5);
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
        <Flame size={18} />
        인기 공연
      </h2>
      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {top5.map((evt, i) => (
          <Link
            key={evt.id}
            href={`/events/${evt.id}`}
            className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
          >
            <span className="text-lg font-bold text-muted-foreground/50 w-6 text-center shrink-0">
              {i + 1}
            </span>
            {evt.poster ? (
              <Image
                src={evt.poster}
                alt={evt.title}
                width={44}
                height={44}
                className="size-11 rounded-lg shrink-0 object-cover"
              />
            ) : (
              <div
                className="size-11 rounded-lg shrink-0"
                style={{ background: getArtistGradient(evt.artistId) }}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{evt.title}</p>
              <p className="text-xs text-muted-foreground">{evt.artistName}</p>
            </div>
            <BookingStatusBadge status={evt.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  main                                                               */
/* ------------------------------------------------------------------ */

export function SearchWidget() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: artistsRaw = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const { data: eventsRaw = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const allArtists = useMemo(
    () =>
      [...artistsRaw]
        .sort((a, b) => (b.followerCount ?? 0) - (a.followerCount ?? 0))
        .map(toArtist),
    [artistsRaw],
  );

  const allEvents = useMemo(() => eventsRaw.map(toSearchableEvent), [eventsRaw]);

  const isLoading = artistsLoading || eventsLoading;

  const {
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    showFilterDropdown,
    setShowFilterDropdown,
    showSortDropdown,
    setShowSortDropdown,
    filterRef,
    sortRef,
    filteredArtists,
    filteredEvents,
    showAllArtists,
    setShowAllArtists,
    showAllEvents,
    setShowAllEvents,
    visibleArtists,
    visibleEvents,
    resetShowAll,
  } = useSearchFilters(allArtists, allEvents, debouncedQuery);

  // autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 200ms debounce
  useEffect(() => {
    const value = query.trim();
    const timer = setTimeout(() => setDebouncedQuery(value), value ? 200 : 0);
    return () => clearTimeout(timer);
  }, [query]);

  // Escape → clear query, close dropdowns
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setQuery("");
        setDebouncedQuery("");
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setShowFilterDropdown, setShowSortDropdown]);

  const hasResults = filteredArtists.length > 0 || filteredEvents.length > 0;
  const isSearching = debouncedQuery.length > 0;

  function handleTrendingClick(term: string) {
    setQuery(term);
    setDebouncedQuery(term);
    resetShowAll();
  }

  function handleClear() {
    setQuery("");
    setDebouncedQuery("");
    resetShowAll();
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      {/* --- search input + filter + sort --- */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="공연명 또는 아티스트명을 검색하세요"
            className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => {
              setShowFilterDropdown((v) => !v);
              setShowSortDropdown(false);
            }}
            className="h-12 flex items-center gap-2 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            필터
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-border bg-card shadow-lg z-50 py-1 overflow-hidden">
              {(
                [
                  { value: "all", label: "전체" },
                  { value: "artist", label: "아티스트만" },
                  { value: "event", label: "공연만" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilterType(opt.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer ${filterType === opt.value ? "text-primary font-semibold" : "text-foreground"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => {
              setShowSortDropdown((v) => !v);
              setShowFilterDropdown(false);
            }}
            className="h-12 flex items-center gap-2 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent transition-colors cursor-pointer whitespace-nowrap"
          >
            <ListFilter size={16} className="text-muted-foreground" />
            {sortBy === "popular"
              ? "인기순"
              : sortBy === "latest"
                ? "최신순"
                : "이름순"}
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-border bg-card shadow-lg z-50 py-1 overflow-hidden">
              {(
                [
                  { value: "popular", label: "인기순" },
                  { value: "latest", label: "최신순" },
                  { value: "name", label: "이름순" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer ${sortBy === opt.value ? "text-primary font-semibold" : "text-foreground"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- loading --- */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* --- state: empty → curation --- */}
      {!isLoading && !isSearching && (
        <div className="space-y-8">
          <TrendingSection onSelect={handleTrendingClick} />
          <PopularArtistsSection artists={allArtists} />
          <PopularEventsSection events={allEvents} />
        </div>
      )}

      {/* --- state: results --- */}
      {!isLoading && isSearching && hasResults && (
        <SearchResults
          filteredArtists={filteredArtists}
          filteredEvents={filteredEvents}
          visibleArtists={visibleArtists}
          visibleEvents={visibleEvents}
          showAllArtists={showAllArtists}
          showAllEvents={showAllEvents}
          onShowMoreArtists={() => setShowAllArtists(true)}
          onShowMoreEvents={() => setShowAllEvents(true)}
        />
      )}

      {/* --- state: no results --- */}
      {!isLoading && isSearching && !hasResults && (
        <div className="text-center py-16 space-y-4">
          <Search size={48} className="mx-auto text-muted-foreground/30" />
          <div className="space-y-1">
            <p className="text-lg font-semibold">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground">
              다른 검색어를 입력하거나, 인기 검색어를 확인해 보세요.
            </p>
          </div>
          <div className="pt-4">
            <TrendingSection onSelect={handleTrendingClick} />
          </div>
        </div>
      )}
    </div>
  );
}
