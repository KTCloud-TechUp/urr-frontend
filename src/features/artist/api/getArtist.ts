import { apiRequest } from "@/shared/api/client";

export interface ArtistDetail {
  id: number;
  name: string;
  profileImageUrl: string;
  description: string;
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
