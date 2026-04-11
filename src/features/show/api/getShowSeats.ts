import { apiRequest } from "@/shared/api/client";

export interface ShowSeat {
  seatId: string;
  sectionCode: string;
  tier: string;
  zoneNo: number;
  row: string;
  number: number;
  sellable: boolean;
}

export interface ShowSeatsData {
  eventId: number;
  showId: number;
  seats: ShowSeat[];
}

interface ShowSeatsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ShowSeatsData;
}

export async function getShowSeats(
  eventId: string | number,
  showId: string | number,
): Promise<ShowSeatsData> {
  const res = await apiRequest<ShowSeatsApiResponse>(
    `/shows/${eventId}/shows/${showId}/seats`,
    { service: "events" },
  );
  return res.data.data;
}
