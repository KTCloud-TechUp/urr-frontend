import { apiRequest } from "@/shared/api/client";

interface CancelPaymentApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: null;
}

export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
): Promise<void> {
  await apiRequest<CancelPaymentApiResponse>(
    `/payments/${paymentKey}/cancel`,
    {
      method: "POST",
      service: "payments",
      body: { cancelReason },
    },
  );
}
