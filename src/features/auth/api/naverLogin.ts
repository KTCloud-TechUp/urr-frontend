import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function naverLogin(
  code: string,
  redirectUri: string,
): Promise<AuthResponseData> {
  const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
    "/api/auth/oauth/naver",
    {
      method: "POST",
      body: { code, redirectUri },
    },
  );
  return res.data.data;
}
