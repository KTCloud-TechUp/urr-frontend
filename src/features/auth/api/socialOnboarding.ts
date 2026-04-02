import { fetchWithAuth } from "@/shared/api";
import { getUserIdFromToken } from "@/shared/lib/jwt";
import type { ApiBaseResponse } from "../model/types";

export interface SocialOnboardingParams {
  nickname: string;
  birthDate: string; // "YYYY-MM-DD"
  phone: string;
  gender: "MALE" | "FEMALE";
}

export async function socialOnboarding(
  params: SocialOnboardingParams,
): Promise<void> {
  const userId = getUserIdFromToken();
  await fetchWithAuth<ApiBaseResponse<object>>("/auth/onboarding/social", {
    method: "POST",
    body: params,
    service: "users",
    headers: userId ? { "X-User-Id": String(userId) } : {},
  });
}
