import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function kakaoRejoin(
  rejoinToken: string,
  agree: boolean,
): Promise<AuthResponseData> {
  const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
    "/auth/oauth/kakao/rejoin",
    {
      method: "POST",
      body: { rejoinToken, agree },
    },
  );
  return res.data.data;
}
