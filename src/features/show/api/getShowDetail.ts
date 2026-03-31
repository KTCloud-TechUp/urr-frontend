import { apiRequest } from "@/shared/api/client";
import type { ShowStatus } from "./getShows";

export interface ShowDetail {
  showId: number;
  eventId: number;
  sessionNo: number;
  startAt: string;
  endAt: string;
  capacity: number;
  saleOpenAt: string;
  saleCloseAt: string;
  status: ShowStatus;
  active: boolean;
  seatmapVersion: number;
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
    { service: "ticketing" },
  );
  return res.data.data;
}
