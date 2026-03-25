import { apiRequest } from "@/shared/api/client";

export interface ArtistSummary {
  id: number;
  name: string;
  profileImageUrl: string;
}

interface ArtistsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ArtistSummary[];
}

export async function getArtists(): Promise<ArtistSummary[]> {
  const res = await apiRequest<ArtistsApiResponse>("/api/artists");
  return res.data.data;
}
