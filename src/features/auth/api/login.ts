import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponseData> {
  const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
    "/api/auth/login",
    {
      method: "POST",
      body: { email, password },
    },
  );
  return res.data.data;
}
