import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData, KakaoRejoinConfirmationResponse } from "../model/types";

export type KakaoLoginResponse = AuthResponseData | KakaoRejoinConfirmationResponse;

export async function kakaoLogin(
  code: string,
  redirectUri: string,
  rejoinConfirmed?: boolean,
): Promise<KakaoLoginResponse> {
  const res = await fetchWithAuth<ApiBaseResponse<KakaoLoginResponse>>(
    "/api/auth/oauth/kakao",
    {
      method: "POST",
      body: { code, redirectUri, rejoinConfirmed },
    },
  );
  return res.data.data;
}
