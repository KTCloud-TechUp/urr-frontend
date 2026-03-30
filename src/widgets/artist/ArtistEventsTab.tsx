import Link from "next/link";
import { Calendar, ImageOff } from "lucide-react";
import { EmptyState } from "@/shared/ui";
import { EventCard } from "@/entities/event";
import type { Event } from "@/shared/types";

interface ArtistEventsTabProps {
  upcoming: Event[];
  past: Event[];
  artistName: string;
  hasRepresentativeImage?: boolean;
}

export function ArtistEventsTab({ upcoming, past, artistName, hasRepresentativeImage }: ArtistEventsTabProps) {
  if (hasRepresentativeImage === false) {
    return (
      <EmptyState
        icon={ImageOff}
        description="아티스트 대표 이미지가 등록되지 않아 공연 정보를 표시할 수 없습니다"
      />
    );
  }

  if (upcoming.length === 0 && past.length === 0) {
    return <EmptyState icon={Calendar} description="등록된 공연이 없습니다" />;
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">다가오는 공연</h2>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <EventCard event={event} artistName={artistName} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-muted-foreground">지난 공연</h2>
          <div className="space-y-3 opacity-60">
            {past.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <EventCard event={event} artistName={artistName} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
