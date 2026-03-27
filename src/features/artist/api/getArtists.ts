import { apiRequest } from "@/shared/api/client";

export type ArtistCategory =
  | "boygroup"
  | "girlgroup"
  | "coedgroup"
  | "solo"
  | "band";

export const artistCategoryLabels: Record<ArtistCategory, string> = {
  boygroup: "보이그룹",
  girlgroup: "걸그룹",
  coedgroup: "혼성그룹",
  solo: "솔로",
  band: "밴드",
};

export function getArtistCategoryLabel(
  category: ArtistCategory | string,
): string {
  return artistCategoryLabels[category as ArtistCategory] ?? category;
}

export interface ArtistSummary {
  id: number;
  name: string;
  profileImageUrl: string;
  followerCount?: number;
  bio?: string;
  bannerImageUrl?: string;
  category?: ArtistCategory;
}

interface ArtistsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ArtistSummary[];
}

export async function getArtists(): Promise<ArtistSummary[]> {
  const res = await apiRequest<ArtistsApiResponse>("/artists");
  return res.data.data;
}
