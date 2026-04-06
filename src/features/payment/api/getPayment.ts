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

export async function getPayment(orderId: string): Promise<PaymentDetail> {
  const res = await apiRequest<GetPaymentApiResponse>(
    `/payments/order/${orderId}`,
    {
      method: "GET",
      service: "payments",
    },
  );
  return res.data.data;
}
