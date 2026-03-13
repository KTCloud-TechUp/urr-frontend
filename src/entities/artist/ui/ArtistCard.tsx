import { cn } from "@/shared/lib/utils";
import { formatCompactNumber } from "@/shared/lib/format";
import type { Artist } from "@/shared/types";

interface ArtistCardProps {
  artist: Artist;
  selected?: boolean;
  className?: string;
}

export function ArtistCard({ artist, selected = false, className }: ArtistCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 rounded-lg transition-colors", className)}>
      <div
        className={cn(
          "relative size-12 rounded-full overflow-hidden border-2 transition-colors shrink-0",
          selected ? "border-primary" : "border-transparent",
        )}
      >
        {artist.avatar ? (
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <span className="text-[11px] font-medium text-center leading-tight line-clamp-2 w-full">
        {artist.name}
      </span>
      <span className="text-[10px] text-muted-foreground text-center">
        팔로워 {formatCompactNumber(artist.followerCount)}
      </span>
    </div>
  );
}
