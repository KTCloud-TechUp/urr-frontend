import { apiRequest } from "@/shared/api/client";

export type ShowStatus = "DRAFT" | "ON_SALE" | "OPEN" | "CLOSED" | "CANCELLED";
export type BookingWindowTier = "LIGHTNING" | "THUNDER" | "CLOUD" | "MIST";

export interface BookingWindow {
  tier: BookingWindowTier;
  opensAt: string;
  fee: number;
}

export interface ShowSummary {
  showId: number;
  sessionNo: number;
  startAt: string;
  endAt: string;
  capacity: number;
  remainingSeats: number;
  saleOpenAt: string;
  saleCloseAt: string;
  bookingWindows: BookingWindow[];
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
