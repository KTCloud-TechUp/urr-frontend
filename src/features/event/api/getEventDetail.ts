import { apiRequest } from "@/shared/api/client";
import type { EventSummary } from "./getEvents";

interface EventDetailApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: EventSummary;
}

export async function getEventDetail(
  artistId: string | number,
  eventId: string | number,
): Promise<EventSummary> {
  const res = await apiRequest<EventDetailApiResponse>(
    `/artists/${artistId}/events/${eventId}`,
    { service: "events" },
  );
  return res.data.data;
}
