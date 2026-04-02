import { apiRequest } from "@/shared/api/client";
import type { TierLevel } from "@/shared/types";

export interface PresaleTierPolicy {
  tier: TierLevel;
  openAt: string;
  presaleOffsetMinutes: number;
  bookingFeeWon: number;
}

export interface PresalePolicy {
  eventId: number;
  showId: number;
  generalOpenAt: string;
  tiers: PresaleTierPolicy[];
}

interface PresalePolicyResponse {
  data: PresalePolicy;
}

export async function getPresalePolicy(
  eventId: string | number,
  showId: string | number,
): Promise<PresalePolicy> {
  const res = await apiRequest<PresalePolicyResponse>(
    `/membership/events/${eventId}/shows/${showId}/presale-policy`,
    { service: "events" },
  );
  return res.data.data;
}
