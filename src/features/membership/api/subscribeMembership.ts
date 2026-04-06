import { apiRequest } from "@/shared/api/client";

export interface SubscribeMembershipResponse {
  membershipId: number;
  orderId: string;
  paymentId: string;
  pendingExpiresAt: string;
}

interface SubscribeMembershipApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: SubscribeMembershipResponse;
}

export async function subscribeMembership(
  artistId: string | number,
  userId: string | number,
): Promise<SubscribeMembershipResponse> {
  const res = await apiRequest<SubscribeMembershipApiResponse>(
    `/artists/${artistId}/membership`,
    {
      method: "POST",
      service: "events",
      headers: { "X-User-Id": String(userId) },
    },
  );
  return res.data.data;
}
