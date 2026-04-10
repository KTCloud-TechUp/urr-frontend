import { Suspense } from "react";
import { TransferDetailWidget, TransferDetailSkeleton } from "@/widgets/transfer";

interface Props {
  params: Promise<{ artistId: string; listingId: string }>;
}

export default async function TransferDetailPage({ params }: Props) {
  const { artistId, listingId } = await params;

  return (
    <Suspense fallback={<TransferDetailSkeleton />}>
      <TransferDetailWidget artistId={artistId} listingId={listingId} />
    </Suspense>
  );
}
