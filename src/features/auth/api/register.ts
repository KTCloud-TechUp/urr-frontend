import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse, AuthResponseData } from "../model/types";

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  birthDate: string; // "YYYY-MM-DD"
  phone: string;
  gender: "MALE" | "FEMALE";
}

export async function register(
  params: RegisterParams,
): Promise<AuthResponseData> {
  const res = await fetchWithAuth<ApiBaseResponse<AuthResponseData>>(
    "/api/auth/register",
    {
      method: "POST",
      body: params,
    },
  );
  return res.data.data;
}
