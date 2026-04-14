import { apiRequest } from "@/shared/api/client";
import type { TierLevel } from "@/shared/types";

export type BookingType = "PRESALE" | "GENERAL";

export interface MembershipTierPolicy {
  tier: TierLevel;
  presaleOffsetMinutes: number;
  bookingFeeWon: number;
  bookingType: BookingType;
  transferFeeRate: number | null;
}

interface MembershipPoliciesResponse {
  artistId: number;
  tiers: MembershipTierPolicy[];
}

export async function getMembershipPolicies(
  artistId: string,
): Promise<MembershipTierPolicy[]> {
  const res = await apiRequest<{ data: MembershipPoliciesResponse }>(
    `/membership/artists/${artistId}/membership-policies`,
    { service: "events" },
  );
  return res.data.data.tiers;
}
