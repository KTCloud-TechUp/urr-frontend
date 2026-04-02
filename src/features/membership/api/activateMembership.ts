import { apiRequest } from "@/shared/api/client";

export async function activateMembership(
  orderId: string,
  paymentId: string,
): Promise<void> {
  await apiRequest("/artists/memberships/activate", {
    method: "POST",
    service: "events",
    body: { orderId, paymentId },
  });
}
