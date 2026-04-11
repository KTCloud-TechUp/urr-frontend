import { apiRequest } from "@/shared/api/client";
import type { EventTag } from "@/entities/event";

export type EventApiCategory = "concert" | "fanmeeting" | "festival" | "musical" | "etc";

export const eventApiCategoryLabels: Record<EventApiCategory, string> = {
  concert: "콘서트",
  fanmeeting: "팬미팅",
  festival: "페스티벌",
  musical: "뮤지컬",
  etc: "기타",
};

export function getEventCategoryLabel(category: EventApiCategory | string): string {
  return eventApiCategoryLabels[category as EventApiCategory] ?? category;
}

export interface EventSummary {
  eventId: number;
  artistId: number;
  title: string;
  subtitle?: string;
  description: string;
  venueTemplateId: number;
  venueTemplateName: string;
  venueAddress?: string;
  openDate: string;
  active: boolean;
  posterImageUrl?: string;
  artistName?: string;
  category?: EventApiCategory;
  tags?: EventTag[];
  endDate?: string;
}

interface EventsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: EventSummary[];
}

export async function getEvents(): Promise<EventSummary[]> {
  const res = await apiRequest<EventsApiResponse>("/events", { service: "events" });
  return res.data.data;
}
