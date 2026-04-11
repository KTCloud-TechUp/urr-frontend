import { apiRequest } from "@/shared/api/client";
import type { EventApiCategory } from "./getEvents";

export interface EventDetailOrganizer {
  host: string;
  manager: string;
  contact: string;
  email: string;
}

export interface EventDetailSection {
  name: string;
  price: number;
  totalSeats: number;
}

export interface EventDetailCancellationRule {
  period: string;
  fee: string;
}

export interface EventDetailResponse {
  eventId: number;
  artistId: number;
  artistName: string;
  title: string;
  subtitle: string;
  description: string;
  venueTemplateId: number;
  venueTemplateName: string;
  venueAddress: string;
  posterImageUrl: string;
  category: EventApiCategory;
  tags: string[];
  openDate: string;
  endDate: string;
  active: boolean;
  runtime: string;
  ageRating: string;
  notices: string[];
  identityVerification: string[];
  castInfo: string;
  cancellationPolicy: EventDetailCancellationRule[];
  ticketDelivery: string[];
  sections: EventDetailSection[];
  organizer: EventDetailOrganizer;
}

interface EventDetailApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: EventDetailResponse;
}

export async function getEventDetail(
  artistId: string | number,
  eventId: string | number,
): Promise<EventDetailResponse> {
  const res = await apiRequest<EventDetailApiResponse>(
    `/artists/${artistId}/events/${eventId}`,
    { service: "events" },
  );
  return res.data.data;
}
