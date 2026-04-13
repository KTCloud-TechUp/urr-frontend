import { apiRequest } from "@/shared/api/client";

interface CreatePaymentRecordParams {
  userId: string | number;
  referenceId: string;
  orderId: string;
  amount: number;
}

interface CreatePaymentRecordResponse {
  paymentId: number;
  orderId: string;
  referenceId: string;
  amount: number;
  status: string;
}

interface CreatePaymentRecordApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: CreatePaymentRecordResponse;
}

export async function createPaymentRecord(
  params: CreatePaymentRecordParams,
): Promise<CreatePaymentRecordResponse> {
  const { userId, ...body } = params;
  const res = await apiRequest<CreatePaymentRecordApiResponse>(
    "/payments/create",
    {
      method: "POST",
      service: "payments",
      headers: { "X-User-Id": String(userId) },
      body,
    },
  );
  return res.data.data;
}
