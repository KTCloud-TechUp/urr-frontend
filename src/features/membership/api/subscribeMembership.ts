import { apiRequest } from "@/shared/api/client";

export interface SubscribeMembershipResponse {
  membershipId: number;
  orderId: string;
  paymentId: string;
  pendingExpiresAt: string;
}

interface SubscribeMembershipApiResponse {
  data: SubscribeMembershipResponse;
}

export async function subscribeMembership(
  artistId: string | number,
): Promise<SubscribeMembershipResponse> {
  const res = await apiRequest<SubscribeMembershipApiResponse>(
    `/artists/${artistId}/membership`,
    {
      method: "POST",
      service: "events",
    },
  );
  return res.data.data;
}
