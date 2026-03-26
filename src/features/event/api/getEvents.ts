import { apiRequest } from "@/shared/api/client";

export interface EventSummary {
  eventId: number;
  artistId: number;
  title: string;
  description: string;
  venueTemplateId: number;
  venueTemplateName: string;
  openDate: string;
  active: boolean;
}

interface EventsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: EventSummary[];
}

export async function getEvents(): Promise<EventSummary[]> {
  const res = await apiRequest<EventsApiResponse>("/events");
  return res.data.data;
}
