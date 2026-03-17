import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { formatDateShort } from "@/shared/lib/format";
import type { Event } from "@/shared/types";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact";
  artistName?: string;
  className?: string;
}

export function EventCard({ event, variant = "default", artistName, className }: EventCardProps) {
  const firstDate = event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateShort(firstDate) : "";

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group flex flex-col rounded-lg border border-border bg-card overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-px",
          className,
        )}
      >
        <div className="aspect-[3/4] bg-muted relative overflow-hidden">
          {event.poster ? (
            <Image src={event.poster} alt={event.title} fill className="object-cover" />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
              style={{ background: getArtistGradient(event.artistId) }}
            >
              {event.title.split(" ")[0]}
            </div>
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold line-clamp-1">{event.title}</h4>
            <BookingStatusBadge status={event.status} />
          </div>
          {artistName && <p className="text-xs text-muted-foreground truncate">{artistName}</p>}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex gap-4 rounded-lg border border-border bg-card p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-px",
        className,
      )}
    >
      <div className="w-[100px] h-[140px] rounded-lg bg-muted shrink-0 overflow-hidden relative">
        {event.poster ? (
          <Image src={event.poster} alt={event.title} fill className="object-cover" />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium"
            style={{ background: getArtistGradient(event.artistId) }}
          >
            {event.title.split(" ")[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
          <BookingStatusBadge status={event.status} />
        </div>
        <p className="text-[13px] text-muted-foreground">{artistName ?? event.artistId}</p>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <Calendar size={14} />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <MapPin size={14} />
          <span>{event.venue}</span>
        </div>
      </div>
    </div>
  );
}
