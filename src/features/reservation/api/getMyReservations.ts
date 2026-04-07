import { apiRequest } from "@/shared/api/client";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "FAILED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type RefundStatus = "NONE" | "REQUESTED" | "COMPLETED";

export interface ReservationSummary {
  reservationId: string;
  eventId: number;
  showId: number;
  seatId: string;
  userId: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  refundStatus: RefundStatus;
  expiresAt: string | null;
  refundedAt: string | null;
  updatedAt: string;
  transferEligible: boolean;
}

interface ReservationsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ReservationSummary[];
}

export async function getMyReservations(
  userId: string | number,
  status?: ReservationStatus,
): Promise<ReservationSummary[]> {
  const params = status ? `?status=${status}` : "";
  const res = await apiRequest<ReservationsApiResponse>(
    `/ticket/users/reservations${params}`,
    {
      service: "ticketing",
      headers: { "X-User-Id": String(userId) },
    },
  );
  return res.data.data;
}
