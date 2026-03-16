import { fetchWithAuth } from "@/shared/api";
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
  await fetchWithAuth<ApiBaseResponse<object>>("/api/auth/onboarding/social", {
    method: "POST",
    body: params,
  });
}
