"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/shared/ui";
import { TransferCard } from "@/entities/transfer";
import type { Artist, Event, Membership, TransferListing } from "@/shared/types";

type EnrichedTransfer = TransferListing & { event: Event };

interface TransferSectionProps {
  artist: Artist;
  membership?: Membership;
  transferListings: EnrichedTransfer[];
  onNavigateTab: (tab: string) => void;
}

export function TransferSection({
  artist,
  membership,
  transferListings,
  onNavigateTab,
}: TransferSectionProps) {
  const router = useRouter();
  const listedTransfers = transferListings.filter((t) => t.status === "listed");

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag size={20} className="text-muted-foreground" />
          양도 마켓
        </h2>
        {membership?.isActive && listedTransfers.length > 0 && (
          <button
            onClick={() => onNavigateTab("transfers")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            {listedTransfers.length}건 전체 보기
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {membership?.isActive ? (
        listedTransfers.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {listedTransfers.slice(0, 3).map((listing) => (
              <TransferCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              현재 양도 가능한 티켓이 없습니다
            </p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
          <Lock size={24} className="mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            멤버십 회원만 양도 마켓을 이용할 수 있습니다
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/membership?artistId=${artist.id}`)}
          >
            멤버십 가입하기
          </Button>
        </div>
      )}
    </section>
  );
}
