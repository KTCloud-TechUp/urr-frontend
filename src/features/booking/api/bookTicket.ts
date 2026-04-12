import { apiRequest } from "@/shared/api/client";

export interface BookTicketParams {
  eventId: number | string;
  showId: number | string;
  artistId: number | string;
  seatIds: string[];
  holdSeconds?: number;
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
    body: {
      eventId: params.eventId,
      showId: params.showId,
      artistId: params.artistId,
      seatIds: params.seatIds,
      holdSeconds: params.holdSeconds ?? 300,
    },
  });
  return res.data.data;
}
