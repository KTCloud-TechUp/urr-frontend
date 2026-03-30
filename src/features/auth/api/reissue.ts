import { apiRequest } from "@/shared/api/client";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function reissueToken(): Promise<string | null> {
  try {
    const res = await apiRequest<ApiBaseResponse<AuthResponseData>>(
      "/auth/token/reissue",
      { method: "POST", service: "users" },
    );
    return res.data.data.tokens.accessToken;
  } catch {
    return null;
  }
}
