import { Suspense } from "react";
import { mockArtists } from "@/shared/lib/mocks/artists";
import { homePopularArtists } from "@/shared/lib/mocks/home";
import { ArtistDetailWidget } from "@/widgets/artist";
import { ArtistPageSkeleton } from "@/widgets/artist/ArtistPageSkeleton";

interface ArtistPageProps {
  params: Promise<{ artistId: string }>;
}

export function generateStaticParams() {
  const allIds = new Set([
    ...mockArtists.map((a) => a.id),
    ...homePopularArtists.map((a) => a.id),
  ]);
  return Array.from(allIds).map((id) => ({ artistId: id }));
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistId } = await params;
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistDetailWidget artistId={artistId} />
    </Suspense>
  );
}
