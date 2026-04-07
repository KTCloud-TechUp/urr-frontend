import { apiRequest } from "@/shared/api/client";

export type SeatApiStatus = "AVAILABLE" | "LOCKED" | "RESERVED" | "SOLD";

export interface SeatAvailability {
  seatId: string;
  status: SeatApiStatus;
  lockedUntil: string | null;
  section: string;
  row: string;
  number: string;
  price: number;
  sellable: boolean;
  seatVersion: number;
}

interface SeatsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: SeatAvailability[];
}

export async function getSeatsAvailability(
  eventId: string | number,
  showId: string | number,
  section?: string,
): Promise<SeatAvailability[]> {
  const query = section ? `?section=${section}` : "";
  const res = await apiRequest<SeatsApiResponse>(
    `/ticket/events/${eventId}/shows/${showId}/seats${query}`,
    { service: "ticketing" },
  );
  return res.data.data;
}
