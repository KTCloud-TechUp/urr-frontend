import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, MeResponseData, AuthUser } from "../model/types";

export async function fetchMe(): Promise<AuthUser> {
  const res = await fetchWithAuth<ApiBaseResponse<MeResponseData>>("/auth/me", { service: "users" });
  const { data } = res.data;

  return {
    userId: data.userId,
    email: data.email,
    nickname: data.nickname,
    role: data.role,
    onboardingCompleted: data.onboardingCompleted,
    marketingConsent: data.marketingConsent,
    pushConsent: data.pushConsent,
    smsConsent: data.smsConsent,
  };
}
