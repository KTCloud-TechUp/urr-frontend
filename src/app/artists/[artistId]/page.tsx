import { Suspense } from "react";
import { getArtists } from "@/features/artist";
import { ArtistDetailWidget } from "@/widgets/artist";
import { ArtistPageSkeleton } from "@/widgets/artist/ArtistPageSkeleton";

interface ArtistPageProps {
  params: Promise<{ artistId: string }>;
}

const FALLBACK_ARTIST_IDS = Array.from({ length: 18 }, (_, i) => String(i + 1));

export async function generateStaticParams() {
  try {
    const artists = await getArtists();
    if (artists.length > 0) {
      return artists.map((a) => ({ artistId: String(a.id) }));
    }
  } catch {
    // API not available at build time — use fallback
  }
  return FALLBACK_ARTIST_IDS.map((id) => ({ artistId: id }));
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistId } = await params;
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistDetailWidget artistId={artistId} />
    </Suspense>
  );
}
