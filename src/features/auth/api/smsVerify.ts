import { fetchWithAuth } from "@/shared/api";
import type { ApiBaseResponse } from "../model/types";

export interface SmsVerifyResult {
  verified: boolean;
}

export async function smsVerify(
  phoneNumber: string,
  code: string,
): Promise<SmsVerifyResult> {
  const res = await fetchWithAuth<ApiBaseResponse<SmsVerifyResult>>(
    "/auth/sms/verify",
    {
      method: "POST",
      body: { phoneNumber, code },
      service: "users",
    },
  );
  return res.data.data;
}
