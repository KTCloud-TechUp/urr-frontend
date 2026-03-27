import { apiRequest } from "@/shared/api/client";
import type { ShowSummary } from "./getShows";

export interface ShowDetail extends ShowSummary {
  eventId: number;
  seatmapJson: string;
}

interface ShowDetailApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ShowDetail;
}

export async function getShowDetail(
  eventId: string | number,
  showId: string | number,
): Promise<ShowDetail> {
  const res = await apiRequest<ShowDetailApiResponse>(
    `/shows/${eventId}/shows/${showId}`,
  );
  return res.data.data;
}
