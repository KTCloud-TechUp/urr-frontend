import { apiRequest } from "@/shared/api/client";

export interface PaymentDetail {
  paymentKey: string;
  orderId: string;
  amount: number;
  method: string;
  referenceId: string;
  status: string;
  approvedAt: string;
}

interface GetPaymentApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: PaymentDetail;
}

export async function getPayment(orderId: string, userId: number | string): Promise<PaymentDetail> {
  const res = await apiRequest<GetPaymentApiResponse>(
    `/payments/order/${orderId}`,
    {
      method: "GET",
      service: "payments",
      headers: { "X-User-Id": String(userId) },
    },
  );
  return res.data.data;
}
