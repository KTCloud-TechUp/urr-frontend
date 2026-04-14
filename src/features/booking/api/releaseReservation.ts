import { apiRequest } from "@/shared/api/client";

export interface ReleaseReservationParams {
  reservationIds: string[];
  reason?: string;
}

export interface ReleaseReservationResponse {
  requestedCount: number;
  releasedCount: number;
  releasedReservationIds: string[];
  skippedReservations: Record<string, string>;
}

interface ReleaseReservationApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ReleaseReservationResponse;
}

export async function releaseReservation(
  params: ReleaseReservationParams,
  userId: number | string,
): Promise<ReleaseReservationResponse> {
  const res = await apiRequest<ReleaseReservationApiResponse>(
    "/ticket/reservations/release",
    {
      method: "POST",
      service: "ticketing",
      headers: { "X-User-Id": String(userId) },
      body: params,
    },
  );
  return res.data.data;
}
