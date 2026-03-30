import { apiRequest } from "@/shared/api/client";

export async function cancelMembership(orderId: string): Promise<void> {
  await apiRequest("/artists/memberships/cancel", {
    method: "POST",
    service: "events",
    body: { orderId, reason: "PAYMENT_CANCELED" },
  });
}
