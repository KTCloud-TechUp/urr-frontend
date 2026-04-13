import { apiRequest } from "@/shared/api/client";

export interface SeatAvailability {
  seatId: string;
  section: string;
  row: string;
  number: string;
  status: string;
  price: number;
  lockedUntil: string | null;
  sellable: boolean;
  seatVersion: number;
}

interface SeatsAvailabilityApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: SeatAvailability[];
}

export async function getSeatsAvailability(
  showId: string | number,
  tier: string,
  zoneNo: number,
): Promise<SeatAvailability[]> {
  const res = await apiRequest<SeatsAvailabilityApiResponse>(
    `/shows/${showId}/seats/availability?tier=${tier}&zoneNo=${zoneNo}`,
    { service: "events" },
  );
  return res.data.data ?? [];
}
