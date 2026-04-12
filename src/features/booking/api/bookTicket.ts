import { apiRequest } from "@/shared/api/client";

export interface BookTicketParams {
  eventId: number | string;
  showId: number | string;
  artistId: number | string;
  seatIds: string[];
  holdSeconds?: number;
  userId: number | string;
}

export interface BookTicketResponse {
  reservationIds: string[];
  seatIds: string[];
  status: string;
  paymentStatus: string;
  paymentId: number;
  totalAmount: number;
  expiresAt: string;
}

interface BookTicketApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: BookTicketResponse;
}

export async function bookTicket(
  params: BookTicketParams,
): Promise<BookTicketResponse> {
  const res = await apiRequest<BookTicketApiResponse>("/ticket/reservations", {
    method: "POST",
    service: "ticketing",
    headers: { "X-User-Id": String(params.userId) },
    body: {
      eventId: Number(params.eventId),
      showId: Number(params.showId),
      artistId: Number(params.artistId),
      seatIds: params.seatIds,
      holdSeconds: params.holdSeconds ?? 180,
    },
  });
  return res.data.data;
}
