import { loadTossPayments } from "@tosspayments/payment-sdk";
import type { PaymentMethod } from "@/shared/lib/constants";

export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

// SDK에서 requestPayment 첫 번째 인자 타입 추론
type TossPaymentsInstance = Awaited<ReturnType<typeof loadTossPayments>>;
export type TossMethod = Parameters<TossPaymentsInstance["requestPayment"]>[0];

// 우리 결제수단 ID → Toss requestPayment 메서드 타입
export const TOSS_METHOD_MAP: Record<PaymentMethod, TossMethod> = {
  card:  "카드",
  toss:  "토스페이",
  kakao: "카카오페이" as TossMethod, // PaymentMethodCode 포함
  naver: "네이버페이" as TossMethod, // PaymentMethodCode 포함
  phone: "휴대폰",
};

export async function getTossPayments(): Promise<TossPaymentsInstance> {
  return loadTossPayments(TOSS_CLIENT_KEY);
}
