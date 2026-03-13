import { Suspense } from "react";
import { TransferDetailWidget, TransferDetailSkeleton } from "@/widgets/transfer";
import { getTransfersByArtistId } from "@/shared/lib/mocks/artist-page";
import { mockArtists } from "@/shared/lib/mocks/artists";

export function generateStaticParams() {
  return mockArtists.flatMap((artist) =>
    getTransfersByArtistId(artist.id).map((t) => ({
      artistId: artist.id,
      listingId: t.id,
    }))
  );
}

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
