import { apiRequest } from "@/shared/api/client";

export interface ConfirmReservationParams {
  eventId: number;
  showId: number;
  seatId: string;
}

export interface ConfirmReservationResponse {
  reservationId: string;
  eventId: number;
  showId: number;
  seatId: string;
  userId: number;
  status: string;
  paymentStatus: string;
  paidAt: string;
  refundStatus: string;
  expiresAt: string;
  refundedAt: string | null;
  updatedAt: string;
}

interface ConfirmReservationApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ConfirmReservationResponse;
}

export async function confirmReservation(
  params: ConfirmReservationParams,
): Promise<ConfirmReservationResponse> {
  const res = await apiRequest<ConfirmReservationApiResponse>(
    "/ticket/reservations/confirm",
    {
      method: "POST",
      service: "ticketing",
      body: params,
    },
  );
  return res.data.data;
}
