import { Suspense } from "react";
import { TransferDetailWidget, TransferDetailSkeleton } from "@/widgets/transfer";
import { getTransferPosts } from "@/features/transfer";

interface Props {
  params: Promise<{ artistId: string; listingId: string }>;
}

const FALLBACK_ARTIST_IDS = Array.from({ length: 10 }, (_, i) => String(i + 1));
const FALLBACK_LISTING_IDS = Array.from({ length: 20 }, (_, i) => String(i + 1));

export async function generateStaticParams() {
  try {
    const params: { artistId: string; listingId: string }[] = [];
    for (const artistId of FALLBACK_ARTIST_IDS) {
      const posts = await getTransferPosts(artistId);
      for (const post of posts) {
        params.push({ artistId, listingId: post.id });
      }
    }
    if (params.length > 0) return params;
  } catch {
    // API not available at build time — use fallback
  }
  return FALLBACK_ARTIST_IDS.flatMap((artistId) =>
    FALLBACK_LISTING_IDS.map((listingId) => ({ artistId, listingId })),
  );
}

export default async function TransferDetailPage({ params }: Props) {
  const { artistId, listingId } = await params;

  return (
    <Suspense fallback={<TransferDetailSkeleton />}>
      <TransferDetailWidget artistId={artistId} listingId={listingId} />
    </Suspense>
  );
}
