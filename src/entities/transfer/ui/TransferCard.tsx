import { cn } from "@/shared/lib/utils";
import { Calendar } from "lucide-react";
import { PriceDisplay, FaceValueBadge } from "@/shared/ui";
import { TierBadge } from "@/entities/user";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import { formatDateShort } from "@/shared/lib/format";
import type { TransferListing, Event } from "@/shared/types";

interface TransferCardProps {
  listing: TransferListing & { event: Event };
  onClick?: () => void;
  className?: string;
}

export function TransferCard({ listing, onClick, className }: TransferCardProps) {
  const pct = Math.round((listing.price / listing.faceValue) * 100);
  const firstDate = listing.event.dates[0]?.date ?? "";
  const dateStr = firstDate ? formatDateShort(firstDate) : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-accent-foreground/20",
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-16 rounded bg-muted shrink-0 overflow-hidden relative">
          {listing.event.poster ? (
            <img
              src={listing.event.poster}
              alt={listing.event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium"
              style={{ background: getArtistGradient(listing.event.artistId) }}
            >
              {listing.event.title.split(" ")[0]?.slice(0, 2)}
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-0.5">
          <h4 className="text-sm font-semibold line-clamp-1">{listing.event.title}</h4>
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Calendar size={13} />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium mb-2">
        {listing.section} · {listing.seatInfo}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <PriceDisplay amount={listing.price} />
        <FaceValueBadge percentage={pct} />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <TierBadge tier={listing.sellerTier} size="sm" />
        <span className="text-xs text-muted-foreground">거래 {listing.sellerTransactionCount}회</span>
      </div>
    </div>
  );
}
