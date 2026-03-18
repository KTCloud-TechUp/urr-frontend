import { fetchWithAuth } from "@/shared/api";

export interface UpdateConsentsParams {
  marketingConsent: boolean;
  pushConsent: boolean;
  smsConsent: boolean;
}

export async function updateConsents(params: UpdateConsentsParams): Promise<void> {
  await fetchWithAuth("/api/auth/me/consents", {
    method: "PATCH",
    body: params,
  });
}
