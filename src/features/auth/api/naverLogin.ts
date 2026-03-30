import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function naverLogin(
  code: string,
  redirectUri: string,
): Promise<AuthResponseData> {
  const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
    "/auth/oauth/naver",
    {
      method: "POST",
      body: { code, redirectUri },
      service: "users",
    },
  );
  return res.data.data;
}
