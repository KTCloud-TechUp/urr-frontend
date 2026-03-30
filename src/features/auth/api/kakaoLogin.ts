import { fetchWithAuth } from "@/shared/api";
import { ApiError } from "@/shared/api/client";
import type {
  ApiBaseResponse,
  AuthResponseData,
  KakaoRejoinConfirmationResponse,
} from "../model/types";

export type KakaoLoginResponse =
  | AuthResponseData
  | KakaoRejoinConfirmationResponse;

export async function kakaoLogin(
  code: string,
  redirectUri: string,
): Promise<KakaoLoginResponse> {
  try {
    const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
      "/auth/oauth/kakao",
      {
        method: "POST",
        body: { code, redirectUri },
        service: "users",
      },
    );
    return res.data.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      const body = (await err.response.json()) as ApiBaseResponse<{
        rejoinToken: string;
        nickname?: string;
        recoveryEligible?: boolean;
      }>;
      return {
        requiresRejoinConfirmation: true,
        rejoinToken: body.data.rejoinToken,
        nickname: body.data.nickname ?? "",
        recoveryEligible: body.data.recoveryEligible ?? false,
      };
    }
    throw err;
  }
}
