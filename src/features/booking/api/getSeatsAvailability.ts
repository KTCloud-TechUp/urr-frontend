import { apiRequest } from "@/shared/api/client";

export interface SeatAvailability {
  seatId: string;
  row: string;
  number: number;
  sellable: boolean;
  ticketStatus: string;
  bookable: boolean;
}

export interface SeatsAvailabilityData {
  eventId: number;
  showId: number;
  tier: string;
  zoneNo: number;
  sectionCode: string;
  totalSeats: number;
  sellableSeats: number;
  bookableSeats: number;
  seats: SeatAvailability[];
}

interface SeatsAvailabilityApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: SeatsAvailabilityData;
}

export async function getSeatsAvailability(
  eventId: string | number,
  showId: string | number,
  tier: string,
  zoneNo: number,
): Promise<SeatsAvailabilityData> {
  const res = await apiRequest<SeatsAvailabilityApiResponse>(
    `/shows/${eventId}/shows/${showId}/seats/availability?tier=${tier}&zoneNo=${zoneNo}`,
    { service: "events" },
  );
  return res.data.data;
}
