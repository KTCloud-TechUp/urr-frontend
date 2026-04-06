import { apiRequest } from "@/shared/api/client";

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface ConfirmPaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  method: string;
  referenceId: string;
  status: string;
  approvedAt: string;
}

interface ConfirmPaymentApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ConfirmPaymentResponse;
}

export async function confirmPayment(
  params: ConfirmPaymentParams,
): Promise<ConfirmPaymentResponse> {
  const res = await apiRequest<ConfirmPaymentApiResponse>(
    "/payments/confirm",
    {
      method: "POST",
      service: "payments",
      body: params,
    },
  );
  return res.data.data;
}
