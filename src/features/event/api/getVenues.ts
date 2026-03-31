import { apiRequest } from "@/shared/api/client";

export interface VenueTemplate {
  venueTemplateId: number;
  name: string;
  baseCapacity: number;
  active: boolean;
  seatmapJson: string;
}

interface VenuesApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: VenueTemplate[];
}

interface VenueDetailApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: VenueTemplate;
}

export async function getVenues(): Promise<VenueTemplate[]> {
  const res = await apiRequest<VenuesApiResponse>("/events/venues", { service: "events" });
  return res.data.data;
}

export async function getVenueDetail(venueTemplateId: number | string): Promise<VenueTemplate> {
  const res = await apiRequest<VenueDetailApiResponse>(
    `/events/venues/${venueTemplateId}`,
    { service: "events" },
  );
  return res.data.data;
}
