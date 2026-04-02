import { fetchWithAuth } from "@/shared/api";
import { getUserIdFromToken } from "@/shared/lib/jwt";
import type { ApiBaseResponse, MeResponseData, AuthUser } from "../model/types";

export async function fetchMe(): Promise<AuthUser> {
  const userId = getUserIdFromToken();
  const res = await fetchWithAuth<ApiBaseResponse<MeResponseData>>("/auth/me", {
    service: "users",
    headers: userId ? { "X-User-Id": String(userId) } : {},
  });
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
    memberships: data.memberships ?? [],
  };
}
