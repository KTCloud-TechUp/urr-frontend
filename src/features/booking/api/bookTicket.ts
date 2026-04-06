import { apiRequest } from "@/shared/api/client";

export interface BookTicketParams {
  eventId: number | string;
  showId: number | string;
  artistId: number | string;
  seatId: string;
  holdSeconds?: number;
}

export interface BookTicketResponse {
  reservationId: string;
  status: string;
  paymentStatus: string;
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
    body: {
      eventId: params.eventId,
      showId: params.showId,
      artistId: params.artistId,
      seatId: params.seatId,
      holdSeconds: params.holdSeconds ?? 180,
    },
  });
  return res.data.data;
}
