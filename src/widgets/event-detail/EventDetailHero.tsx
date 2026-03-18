import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Heart, Share2 } from "lucide-react";
import { BookingStatusBadge } from "@/entities/event";
import { EventTagBadge } from "@/entities/event";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";

interface EventDetailHeroProps {
  event: EventDetail;
}

function formatDateRange(dates: { date: string }[]): string {
  if (dates.length === 0) return "";
  const first = new Date(dates[0].date);
  const last = new Date(dates[dates.length - 1].date);
  const fmt = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  return dates.length === 1 ? fmt(first) : `${fmt(first)} ~ ${fmt(last)}`;
}

export function EventDetailHero({ event }: EventDetailHeroProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex items-center gap-2">
          {event.tags.map((tag) => (
            <EventTagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold leading-tight">{event.title}</h1>
        {event.subtitle && (
          <p className="text-base text-muted-foreground">{event.subtitle}</p>
        )}
        <p className="text-[13px] text-muted-foreground">
          {event.category === "concert"
            ? "콘서트"
            : event.category === "fanmeeting"
              ? "팬미팅"
              : event.category === "festival"
                ? "페스티벌"
                : "공연"}
        </p>
      </div>

      {/* Poster + Info Grid */}
      <div className="flex gap-6">
        {/* Poster */}
        <div className="w-[280px] shrink-0">
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-[3/4]">
            <Image
              src={event.poster}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            {/* Date overlay on poster bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2.5 space-y-0.5">
              {event.dates.map((d) => {
                const date = new Date(d.date);
                const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                return (
                  <p key={d.id} className="text-white text-[11px] font-medium">
                    {`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${weekdays[date.getDay()]})`}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Table */}
        <div className="flex-1 min-w-0">
          <dl className="space-y-4">
            <InfoRow icon={MapPin} label="장소" value={event.venue} />
            <InfoRow icon={Calendar} label="공연기간" value={formatDateRange(event.dates)} />
            <InfoRow icon={Clock} label="공연시간" value={event.runtime} />
            <InfoRow icon={Users} label="관람연령" value={event.ageRating} />
          </dl>
        </div>
      </div>

      {/* Bottom Bar: Like + Share + Status Badge */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Heart size={16} />
            <span>3,233</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Share2 size={16} />
            <span>공유</span>
          </button>
        </div>
        <BookingStatusBadge status={event.status} />
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground w-[80px] shrink-0 pt-0.5">
        <Icon size={15} className="text-muted-foreground/60" />
        {label}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
