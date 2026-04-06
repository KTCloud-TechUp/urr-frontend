import { apiRequest } from "@/shared/api/client";
import type { BookingWindowTier } from "@/features/show/api/getShows";

export interface TierPolicy {
  tier: BookingWindowTier;
  presaleOffsetMinutes: number;
  bookingFeeWon: number;
  openAt: string;
}

export interface BookingWindowsData {
  bookingWindows: Record<string, string>;
  tierPolicies: TierPolicy[];
}

interface BookingWindowsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: BookingWindowsData;
}

export async function getBookingWindows(
  eventId: string | number,
  showId: string | number,
): Promise<BookingWindowsData> {
  const res = await apiRequest<BookingWindowsApiResponse>(
    `/shows/${eventId}/shows/${showId}/booking-windows`,
    { service: "events" },
  );
  return res.data.data;
}
