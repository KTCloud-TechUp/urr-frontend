"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/shared/ui";
import { getTransferListingById } from "@/shared/lib/mocks/artist-page";
import { mockUser } from "@/shared/lib/mocks/user";
import { TransferInfoPanel } from "./TransferInfoPanel";
import { TransferPurchaseSidebar } from "./TransferPurchaseSidebar";

function TransferDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[160px] rounded-xl" />
          <Skeleton className="h-[140px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
        <div className="w-[400px] shrink-0">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface TransferDetailWidgetProps {
  artistId: string;
  listingId: string;
}

export function TransferDetailWidget({ artistId, listingId }: TransferDetailWidgetProps) {
  const router = useRouter();

  const listing = getTransferListingById(artistId, listingId);
  const membership = mockUser.memberships.find((m) => m.artistId === artistId && m.isActive);

  if (!listing) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">양도 리스팅을 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">
          이미 판매되었거나 삭제된 리스팅입니다.
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline mt-2"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push(`/artists/${artistId}?tab=transfers`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        양도 마켓으로 돌아가기
      </button>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <TransferInfoPanel listing={listing} />
        </div>

        <div className="w-[400px] shrink-0">
          <div className="sticky top-6">
            <TransferPurchaseSidebar
              listing={listing}
              membership={membership}
              artistId={artistId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { TransferDetailSkeleton };
