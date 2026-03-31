import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse } from "../model/types";

export async function smsSend(phoneNumber: string): Promise<void> {
  await fetchWithAuth<ApiBaseResponse<null>>("/auth/sms/send", {
    method: "POST",
    body: { phoneNumber },
    service: "users",
  });
}
