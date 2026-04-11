import { apiRequest } from "@/shared/api/client";

export interface CancelReservationParams {
  eventId: number;
  showId: number;
  seatId: string;
}

export interface CancelReservationResponse {
  reservationId: string;
  eventId: number;
  showId: number;
  seatId: string;
  userId: number;
  status: string;
  paymentStatus: string;
  paidAt: string | null;
  refundStatus: string;
  expiresAt: string;
  refundedAt: string | null;
  updatedAt: string;
}

interface CancelReservationApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: CancelReservationResponse;
}

export async function cancelReservation(
  params: CancelReservationParams,
  userId: number | string,
): Promise<CancelReservationResponse> {
  const res = await apiRequest<CancelReservationApiResponse>(
    "/ticket/reservations/cancel",
    {
      method: "POST",
      service: "ticketing",
      headers: { "X-User-Id": String(userId) },
      body: params,
    },
  );
  return res.data.data;
}
