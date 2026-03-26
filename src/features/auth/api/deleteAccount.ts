import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse } from "../model/types";

export async function deleteAccount(): Promise<void> {
  await fetchWithAuth<ApiBaseResponse<Record<string, never>>>("/auth/me", {
    method: "DELETE",
  });
}
