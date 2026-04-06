import { apiRequest } from "@/shared/api/client";

interface CreatePaymentRecordParams {
  referenceId: string;
  orderId: string;
  amount: number;
}

export interface CreatePaymentRecordResponse {
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
  const res = await apiRequest<CreatePaymentRecordApiResponse>(
    "/payments/create",
    {
      method: "POST",
      service: "payments",
      body: params,
    },
  );
  return res.data.data;
}
