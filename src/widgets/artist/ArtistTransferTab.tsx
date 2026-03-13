"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button, Input, EmptyState } from "@/shared/ui";
import { TransferCard } from "@/entities/transfer";
import type { Event, TransferListing, Membership } from "@/shared/types";

type EnrichedTransfer = TransferListing & { event: Event };

interface ArtistTransferTabProps {
  listings: EnrichedTransfer[];
  events: Event[];
  membership?: Membership;
  artistId: string;
}

const selectClass =
  "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

export function ArtistTransferTab({ listings, events, membership, artistId }: ArtistTransferTabProps) {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [section, setSection] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "price_asc" | "price_desc">("latest");

  const isMember = membership?.isActive === true;

  const sections = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.section))).sort();
  }, [listings]);

  const eventsWithTransfers = useMemo(() => {
    const ids = new Set(listings.map((l) => l.eventId));
    return events.filter((e) => ids.has(e.id));
  }, [listings, events]);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => l.status === "listed");
    if (eventId) result = result.filter((l) => l.eventId === eventId);
    if (section) result = result.filter((l) => l.section === section);
    if (priceMin) result = result.filter((l) => l.price >= Number(priceMin));
    if (priceMax) result = result.filter((l) => l.price <= Number(priceMax));
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [listings, eventId, section, priceMin, priceMax, sortBy]);

  return (
    <div className="space-y-6">
      {!isMember && (
        <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <span className="text-warning text-lg">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">멤버십 회원 전용 양도 마켓</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              멤버십 가입 후 양도 티켓을 구매할 수 있습니다
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            멤버십 가입
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={selectClass}>
          <option value="">전체 공연</option>
          {eventsWithTransfers.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        <select value={section} onChange={(e) => setSection(e.target.value)} className={selectClass}>
          <option value="">전체 구역</option>
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="최소 가격"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-28 h-9"
          />
          <span className="text-xs text-muted-foreground">~</span>
          <Input
            type="number"
            placeholder="최대 가격"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-28 h-9"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className={`${selectClass} ml-auto`}
        >
          <option value="latest">최신순</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((listing) => (
            <div key={listing.id} className="relative">
              <TransferCard
                listing={listing}
                onClick={() => router.push(`/transfer/${artistId}/${listing.id}`)}
              />
              {!isMember && (
                <div
                  className="absolute inset-0 rounded-lg bg-background/60 flex items-center justify-center cursor-not-allowed"
                  title="멤버십 필요"
                >
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    멤버십 필요
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ShoppingBag} description="현재 양도 가능한 티켓이 없습니다" />
      )}
    </div>
  );
}
