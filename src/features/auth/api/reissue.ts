import { apiRequest } from "@/shared/api/client";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function reissueToken(): Promise<string | null> {
  try {
    const res = await apiRequest<ApiBaseResponse<AuthResponseData>>(
      "/api/auth/token/reissue",
      { method: "POST" },
    );
    return res.data.data.tokens.accessToken;
  } catch {
    return null;
  }
}
