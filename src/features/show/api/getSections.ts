import { apiRequest } from "@/shared/api/client";

export interface ShowSection {
  code: string;
  grade: string;
  zoneNo: number;
  price: number;
  color: string;
}

export interface ShowSectionsData {
  showId: number;
  sections: ShowSection[];
}

interface ShowSectionsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ShowSectionsData;
}

export async function getSections(showId: string | number): Promise<ShowSectionsData> {
  const res = await apiRequest<ShowSectionsApiResponse>(
    `/shows/${showId}/sections`,
    { service: "events" },
  );
  return res.data.data;
}
