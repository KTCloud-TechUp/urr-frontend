import { apiRequest } from "@/shared/api/client";
import type { ArtistCategory } from "./getArtists";

export interface ArtistDetail {
  id: number;
  name: string;
  profileImageUrl: string;
  description: string;
  followerCount?: number;
  bio?: string;
  bannerImageUrl?: string;
  category?: ArtistCategory;
}

interface ArtistApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ArtistDetail;
}

export async function getArtist(
  artistId: string | number,
): Promise<ArtistDetail> {
  const res = await apiRequest<ArtistApiResponse>(`/artists/${artistId}`);
  return res.data.data;
}
