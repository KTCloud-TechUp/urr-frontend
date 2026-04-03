import { apiRequest } from "@/shared/api/client";

export interface SeatsSummaryZone {
  sectionCode: string;
  zoneNo: number;
  totalSeats: number;
  sellableSeats: number;
  bookableSeats: number;
}

export interface SeatsSummaryTier {
  tier: string;
  totalSeats: number;
  sellableSeats: number;
  bookableSeats: number;
  zones: SeatsSummaryZone[];
}

export interface SeatsSummaryData {
  eventId: number;
  showId: number;
  tiers: SeatsSummaryTier[];
}

interface SeatsSummaryApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: SeatsSummaryData;
}

export async function getSeatsSummary(
  eventId: string | number,
  showId: string | number,
): Promise<SeatsSummaryData> {
  const res = await apiRequest<SeatsSummaryApiResponse>(
    `/shows/${eventId}/shows/${showId}/seats/summary`,
    { service: "events" },
  );
  return res.data.data;
}
