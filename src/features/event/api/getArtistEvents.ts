import { apiRequest } from "@/shared/api/client";
import type { EventSummary } from "./getEvents";

interface ArtistEventsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: EventSummary[];
}

export async function getArtistEvents(
  artistId: string | number,
): Promise<EventSummary[]> {
  const res = await apiRequest<ArtistEventsApiResponse>(
    `/artists/${artistId}/events`,
  );
  return res.data.data;
}
