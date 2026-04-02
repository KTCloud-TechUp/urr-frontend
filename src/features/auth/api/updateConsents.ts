import { fetchWithAuth } from "@/shared/api";
import { getUserIdFromToken } from "@/shared/lib/jwt";

export interface UpdateConsentsParams {
  marketingConsent: boolean;
  pushConsent: boolean;
  smsConsent: boolean;
}

export async function updateConsents(params: UpdateConsentsParams): Promise<void> {
  const userId = getUserIdFromToken();
  await fetchWithAuth("/auth/me/consents", {
    method: "PATCH",
    body: params,
    service: "users",
    headers: userId ? { "X-User-Id": String(userId) } : {},
  });
}
