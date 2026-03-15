"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  TrendingUp,
  Users,
  Calendar,
  Flame,
  SlidersHorizontal,
  ChevronDown,
  ListFilter,
} from "lucide-react";
import { getArtistGradient, homeRankingEvents } from "@/shared/lib/mocks/home";
import {
  trendingSearchTerms,
  getAllArtists,
  getAllEvents,
} from "@/shared/lib/mocks/search";
import { BookingStatusBadge } from "@/entities/event";
import { formatDateCompact } from "@/shared/lib/format";
import type { Artist } from "@/shared/types";
import type { SearchableEvent } from "@/shared/lib/mocks/search";

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */

function matchesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ------------------------------------------------------------------ */
/*  sub-components                                                     */
/* ------------------------------------------------------------------ */

function TrendingSection({
  onSelect,
}: {
  onSelect: (term: string) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
        <TrendingUp size={18} />
        인기 검색어
      </h2>
      <div className="flex flex-wrap gap-2">
        {trendingSearchTerms.map((term) => (
          <button
            key={term}
            onClick={() => onSelect(term)}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  );
}

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
            className="flex flex-col items-center gap-2 shrink-0 w-[72px] group"
          >
            {artist.avatar ? (
              <img
                src={artist.avatar}
                alt={artist.name}
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

function PopularEventsSection() {
  const top5 = homeRankingEvents.slice(0, 5);
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
            {evt.profileImage ? (
              <img
                src={evt.profileImage}
                alt={evt.title}
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

function ArtistResultRow({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      {artist.avatar ? (
        <img
          src={artist.avatar}
          alt={artist.name}
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
        <p className="text-sm text-muted-foreground">
          팔로워 {formatFollowers(artist.followerCount)}
        </p>
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
        <img
          src={event.poster}
          alt={event.title}
          className="size-[60px] rounded-lg shrink-0 object-cover"
        />
      ) : (
        <div
          className="size-[60px] rounded-lg shrink-0"
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

/* ------------------------------------------------------------------ */
/*  main                                                               */
/* ------------------------------------------------------------------ */

export function SearchWidget() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "artist" | "event">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"popular" | "latest" | "name">(
    "popular",
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 200ms debounce
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Escape → clear, close dropdowns on outside click
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
    function handleClickOutside(e: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // filtered results
  const allArtists = useMemo(() => getAllArtists(), []);
  const allEvents = useMemo(() => getAllEvents(), []);

  const filteredArtists = useMemo(() => {
    if (!debouncedQuery || filterType === "event") return [];
    const results = allArtists.filter(
      (a) =>
        matchesQuery(a.name, debouncedQuery) ||
        matchesQuery(a.bio, debouncedQuery),
    );
    if (sortBy === "name")
      return [...results].sort((a, b) =>
        a.name.localeCompare(b.name, "ko"),
      );
    // 'popular' = default order (by followerCount desc), 'latest' = same for artists
    return [...results].sort((a, b) => b.followerCount - a.followerCount);
  }, [allArtists, debouncedQuery, filterType, sortBy]);

  const filteredEvents = useMemo(() => {
    if (!debouncedQuery || filterType === "artist") return [];
    const results = allEvents.filter(
      (e) =>
        matchesQuery(e.title, debouncedQuery) ||
        matchesQuery(e.venue, debouncedQuery) ||
        matchesQuery(e.artistName, debouncedQuery),
    );
    if (sortBy === "name")
      return [...results].sort((a, b) =>
        a.title.localeCompare(b.title, "ko"),
      );
    if (sortBy === "latest")
      return [...results].sort((a, b) => {
        const dateA = a.dates[0]?.date ?? "";
        const dateB = b.dates[0]?.date ?? "";
        return dateB.localeCompare(dateA);
      });
    return results; // popular = default order
  }, [allEvents, debouncedQuery, filterType, sortBy]);

  const hasResults = filteredArtists.length > 0 || filteredEvents.length > 0;
  const isSearching = debouncedQuery.length > 0;

  function handleTrendingClick(term: string) {
    setQuery(term);
    setDebouncedQuery(term);
    setShowAllArtists(false);
    setShowAllEvents(false);
  }

  function handleClear() {
    setQuery("");
    setDebouncedQuery("");
    setShowAllArtists(false);
    setShowAllEvents(false);
    inputRef.current?.focus();
  }

  const visibleArtists = showAllArtists
    ? filteredArtists
    : filteredArtists.slice(0, 5);
  const visibleEvents = showAllEvents
    ? filteredEvents
    : filteredEvents.slice(0, 5);

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
                    setShowAllArtists(false);
                    setShowAllEvents(false);
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

      {/* --- state: empty → curation --- */}
      {!isSearching && (
        <div className="space-y-8">
          <TrendingSection onSelect={handleTrendingClick} />
          <PopularArtistsSection artists={allArtists} />
          <PopularEventsSection />
        </div>
      )}

      {/* --- state: results --- */}
      {isSearching && hasResults && (
        <div className="space-y-6">
          {/* artists */}
          {filteredArtists.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-1">
                <Users size={16} />
                아티스트
                <span className="text-xs font-normal">
                  ({filteredArtists.length})
                </span>
              </h2>
              <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {visibleArtists.map((a) => (
                  <ArtistResultRow key={a.id} artist={a} />
                ))}
              </div>
              {filteredArtists.length > 5 && !showAllArtists && (
                <button
                  onClick={() => setShowAllArtists(true)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer"
                >
                  아티스트 {filteredArtists.length - 5}개 더 보기
                </button>
              )}
            </section>
          )}

          {/* events */}
          {filteredEvents.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-1">
                <Calendar size={16} />
                공연
                <span className="text-xs font-normal">
                  ({filteredEvents.length})
                </span>
              </h2>
              <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {visibleEvents.map((e) => (
                  <EventResultRow key={e.id} event={e} />
                ))}
              </div>
              {filteredEvents.length > 5 && !showAllEvents && (
                <button
                  onClick={() => setShowAllEvents(true)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer"
                >
                  공연 {filteredEvents.length - 5}개 더 보기
                </button>
              )}
            </section>
          )}
        </div>
      )}

      {/* --- state: no results --- */}
      {isSearching && !hasResults && (
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
