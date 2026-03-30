import { fetchWithAuth } from "@/shared/api";
import type { TierLevel, Membership } from "@/shared/types";

interface MembershipApiItem {
  membershipId: number;
  artistId: number;
  artistName: string;
  nickname: string;
  tier: string;
  tierLevel: number;
  tierProgressPercent: number;
  status: string;
  orderId: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}

interface MembershipsResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: MembershipApiItem[];
}

const TIER_MAP: Record<string, TierLevel> = {
  LIGHTNING: "lightning",
  THUNDER: "thunder",
  CLOUD: "cloud",
  MIST: "mist",
};

export async function getMemberships(userId: number): Promise<Membership[]> {
  const res = await fetchWithAuth<MembershipsResponse>("/membership", {
    service: "events",
    headers: { "X-User-Id": String(userId) },
  });
  return res.data.data.map(
    (item): Membership => ({
      id: String(item.membershipId),
      artistId: String(item.artistId),
      artistName: item.artistName,
      tier: TIER_MAP[item.tier] ?? "mist",
      nickname: item.nickname,
      membershipNumber: String(item.membershipId),
      joinedAt: item.startDate ?? "",
      expiresAt: item.endDate ?? "",
      isActive: item.active,
      orderId: item.orderId ?? undefined,
      tierProgress: { current: item.tierProgressPercent, required: 100 },
    }),
  );
}
