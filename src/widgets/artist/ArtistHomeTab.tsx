"use client";

import type {
  Artist,
  Event,
  Membership,
  TransferListing,
  CommunityPost,
} from "@/shared/types";
import type { ArtistExtendedInfo } from "@/shared/lib/mocks/artist-page";
import { MembershipSection } from "./MembershipSection";
import { ArtistInfoSection } from "./ArtistInfoSection";
import { CommunitySection } from "./CommunitySection";
import { EventsSection } from "./EventsSection";
import { TransferSection } from "./TransferSection";

type EnrichedTransfer = TransferListing & { event: Event };

interface ArtistHomeTabProps {
  artist: Artist;
  extendedInfo?: ArtistExtendedInfo;
  nextEvent?: Event;
  upcomingEvents: Event[];
  transferListings: EnrichedTransfer[];
  communityPosts: CommunityPost[];
  membership?: Membership;
  onNavigateTab: (tab: string) => void;
  hasRepresentativeImage?: boolean;
}

export function ArtistHomeTab({
  artist,
  extendedInfo,
  nextEvent,
  upcomingEvents,
  transferListings,
  communityPosts,
  membership,
  onNavigateTab,
  hasRepresentativeImage,
}: ArtistHomeTabProps) {
  return (
    <div className="space-y-12">
      <MembershipSection artist={artist} membership={membership} />
      <ArtistInfoSection artist={artist} extendedInfo={extendedInfo} />
      <CommunitySection
        artist={artist}
        membership={membership}
        communityPosts={communityPosts}
        onNavigateTab={onNavigateTab}
      />
      <EventsSection
        artist={artist}
        nextEvent={nextEvent}
        upcomingEvents={upcomingEvents}
        hasRepresentativeImage={hasRepresentativeImage}
        onNavigateTab={onNavigateTab}
      />
      <TransferSection
        artist={artist}
        membership={membership}
        transferListings={transferListings}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
