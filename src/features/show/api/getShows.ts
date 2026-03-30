import { apiRequest } from "@/shared/api/client";

export type ShowStatus = "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";

export interface ShowSummary {
  showId: number;
  sessionNo: number;
  startAt: string;
  endAt: string;
  capacity: number;
  saleOpenAt: string;
  saleCloseAt: string;
  status: ShowStatus;
  active: boolean;
  seatmapVersion: number;
}

interface ShowsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ShowSummary[];
}

export async function getShows(eventId: string | number): Promise<ShowSummary[]> {
  const res = await apiRequest<ShowsApiResponse>(`/shows/${eventId}/shows`, { service: "ticketing" });
  return res.data.data;
}
