"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { getArtist } from "@/features/artist";
import { getArtistEvents } from "@/features/event";
import type { EventSummary } from "@/features/event";
import { mockUser } from "@/shared/lib/mocks/user";
import {
  getArtistExtendedInfo,
  getTransferListingsWithEvent,
} from "@/shared/lib/mocks/artist-page";
import type { Artist, Event } from "@/shared/types";
import { getCommunityPostsByArtistId } from "@/shared/lib/mocks/community";
import { ArtistHeader } from "./ArtistHeader";
import { ArtistHomeTab } from "./ArtistHomeTab";
import { ArtistCommunityTab } from "./ArtistCommunityTab";
import { ArtistEventsTab } from "./ArtistEventsTab";
import { ArtistTransferTab } from "./ArtistTransferTab";
import { MembershipGate } from "./MembershipGate";
import { ArtistPageSkeleton } from "./ArtistPageSkeleton";

type Tab = "home" | "community" | "events" | "transfers";

const TABS: { value: Tab; label: string; gated: boolean }[] = [
  { value: "home", label: "홈", gated: false },
  { value: "community", label: "소통", gated: true },
  { value: "events", label: "공연", gated: false },
  { value: "transfers", label: "양도", gated: true },
];

interface ArtistDetailWidgetProps {
  artistId: string;
}

export function ArtistDetailWidget({ artistId }: ArtistDetailWidgetProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [following, setFollowing] = useState(
    mockUser.followedArtistIds.includes(artistId),
  );

  const tabParam = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = TABS.some((t) => t.value === tabParam) ? (tabParam as Tab) : "home";

  const { data: artistData, isLoading, isError } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist(artistId),
  });

  const { data: artistEventsData = [] } = useQuery({
    queryKey: ["artist-events", artistId],
    queryFn: () => getArtistEvents(artistId),
    enabled: !!artistData,
  });

  const handleTabChange = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "home") params.delete("tab");
    else params.set("tab", tab);
    router.replace(`/artists/${artistId}${params.size ? `?${params}` : ""}`, { scroll: false });
  };

  if (isLoading) return <ArtistPageSkeleton />;

  if (isError || !artistData) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">아티스트를 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">잘못된 경로이거나 삭제된 아티스트입니다.</p>
      </div>
    );
  }

  const artist: Artist = {
    id: String(artistData.id),
    name: artistData.name,
    avatar: artistData.profileImageUrl,
    banner: "",
    bio: artistData.description,
    category: "solo",
  };

  const membership = mockUser.memberships.find((m) => m.artistId === artistId && m.isActive);
  const extendedInfo = getArtistExtendedInfo(artist.id);
  const allEvents: Event[] = artistEventsData.map((e: EventSummary) => ({
    id: String(e.eventId),
    artistId: String(e.artistId),
    title: e.title,
    venue: e.venueTemplateName,
    dates: [{
      id: String(e.eventId),
      date: e.openDate + "T19:00:00",
      bookingWindows: [],
      totalSeats: 0,
      remainingSeats: 0,
    }],
    poster: "",
    status: e.active ? "open" : "closed",
  }));
  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.dates[0]?.date ?? 0) >= now);
  const past = allEvents.filter((e) => new Date(e.dates[0]?.date ?? 0) < now);
  const nextEvent = upcoming[0];
  const transferListings = getTransferListingsWithEvent(artist.id);
  const communityPosts = getCommunityPostsByArtistId(artist.id);

  return (
    <div>
      <ArtistHeader
        artist={artist}
        membership={membership}
        isFollowing={following}
        onFollowToggle={() => setFollowing((prev) => !prev)}
      />

      {/* Tab navigation */}
      <div className="w-full mt-8 border-b border-border">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "flex items-center gap-1 px-4 pb-3 text-sm font-medium transition-colors relative cursor-pointer",
                activeTab === tab.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.gated && !membership && (
                <Lock size={12} className="text-muted-foreground" />
              )}
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="pt-8">
        {activeTab === "home" && (
          <ArtistHomeTab
            artist={artist}
            extendedInfo={extendedInfo}
            nextEvent={nextEvent}
            upcomingEvents={upcoming}
            transferListings={transferListings}
            communityPosts={communityPosts}
            membership={membership}
            onNavigateTab={(tab) => handleTabChange(tab as Tab)}
          />
        )}
        {activeTab === "community" && (
          membership
            ? <ArtistCommunityTab posts={communityPosts} artistId={artist.id} />
            : <MembershipGate artistId={artist.id} artistName={artist.name} />
        )}
        {activeTab === "events" && (
          <ArtistEventsTab upcoming={upcoming} past={past} artistName={artist.name} />
        )}
        {activeTab === "transfers" && (
          membership
            ? <ArtistTransferTab listings={transferListings} events={allEvents} membership={membership} artistId={artist.id} />
            : <MembershipGate artistId={artist.id} artistName={artist.name} />
        )}
      </div>
    </div>
  );
}
