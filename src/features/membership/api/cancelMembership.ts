import { fetchWithAuth } from "@/shared/api";

export async function cancelMembership(
  orderId: string,
  userId: number,
  reason: string = "PAYMENT_CANCELED"
): Promise<void> {
  await fetchWithAuth("/artists/memberships/cancel", {
    method: "POST",
    service: "events",
    headers: { "X-User-Id": String(userId) },
    body: { orderId, reason },
  });
}
