import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse } from "../model/types";

export async function logout(): Promise<void> {
  await fetchWithAuth<ApiBaseResponse<Record<string, never>>>(
    "/auth/logout",
    { method: "POST" },
  );
}
