import { apiRequest } from "@/shared/api/client";
import type { ConfirmationData } from "@/shared/types";

// ⚠️ 요청/응답 타입은 백엔드 스펙 미확정으로 가정. 실제 스펙 수신 후 타입 조정 필요.

export interface BookTicketParams {
  showId: string | number;
  seatIds: string[];
  buyerName: string;
  buyerPhone: string;
  paymentMethod: string;
}

interface BookTicketTicket {
  seatId: string;
  sectionName: string;
  row: string;
  seatNumber: string;
  price: number;
  tierFee: number;
}

export interface BookTicketResponse {
  bookingId: string;
  orderId: string;
  tickets: BookTicketTicket[];
  totalAmount: number;
  bookedAt: string;
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
  const res = await apiRequest<BookTicketApiResponse>("/ticketing/book", {
    method: "POST",
    service: "ticketing",
    body: params,
  });
  return res.data.data;
}

export function toConfirmationData(booking: BookTicketResponse): ConfirmationData {
  return {
    bookingId: booking.bookingId,
    tickets: booking.tickets,
    totalAmount: booking.totalAmount,
    bookedAt: booking.bookedAt,
  };
}
