import { useState, useRef, useEffect, useMemo } from "react";
import type { Artist } from "@/shared/types";
import type { SearchableEvent } from "@/shared/lib/mocks/search";

function matchesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export function useSearchFilters(
  allArtists: Artist[],
  allEvents: SearchableEvent[],
  debouncedQuery: string,
) {
  const [filterType, _setFilterType] = useState<"all" | "artist" | "event">("all");
  const [sortBy, setSortBy] = useState<"popular" | "latest" | "name">("popular");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  function setFilterType(type: "all" | "artist" | "event") {
    _setFilterType(type);
    setShowAllArtists(false);
    setShowAllEvents(false);
  }

  function resetShowAll() {
    setShowAllArtists(false);
    setShowAllEvents(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredArtists = useMemo(() => {
    if (!debouncedQuery || filterType === "event") return [];
    const results = allArtists.filter(
      (a) =>
        matchesQuery(a.name, debouncedQuery) ||
        matchesQuery(a.bio, debouncedQuery),
    );
    if (sortBy === "name")
      return [...results].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return [...results].sort(
      (a, b) => (b.followerCount ?? 0) - (a.followerCount ?? 0),
    );
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
      return [...results].sort((a, b) => a.title.localeCompare(b.title, "ko"));
    if (sortBy === "latest")
      return [...results].sort((a, b) => {
        const dateA = a.dates[0]?.date ?? "";
        const dateB = b.dates[0]?.date ?? "";
        return dateB.localeCompare(dateA);
      });
    return results;
  }, [allEvents, debouncedQuery, filterType, sortBy]);

  const visibleArtists = showAllArtists
    ? filteredArtists
    : filteredArtists.slice(0, 5);
  const visibleEvents = showAllEvents
    ? filteredEvents
    : filteredEvents.slice(0, 5);

  return {
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
  };
}
