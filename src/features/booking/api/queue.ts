import { fetchWithAuth } from "@/shared/api";
import { getUserIdFromToken } from "@/shared/lib/jwt";
import type { ApiBaseResponse } from "@/features/auth/model/types";

export interface QueueEntryData {
  userId: number | null;
  showId: number | null;
  status: "ACTIVE" | "WAIT";
  rank: number | null;
  total: number | null;
  waitTime: number | null;
}

export interface QueuePollData {
  userId: number | null;
  showId: number | null;
  status: "ACTIVE" | "WAIT" | "NOT_WAIT";
  rank: number | null;
  total: number | null;
  waitTime: number | null;
  token: string | null;
  remainMs: number | null;
}

function getUserHeader(): Record<string, string> {
  const userId = getUserIdFromToken();
  return userId ? { "X-User-Id": String(userId) } : {};
}

export async function checkQueue(showId: string | number): Promise<QueueEntryData> {
  const res = await fetchWithAuth<ApiBaseResponse<QueueEntryData>>(
    `/queue/check/${showId}`,
    {
      method: "POST",
      service: "queue",
      headers: getUserHeader(),
    },
  );
  return res.data.data;
}

export async function pollQueue(showId: string | number): Promise<QueuePollData> {
  const res = await fetchWithAuth<ApiBaseResponse<QueuePollData>>(
    `/queue/${showId}`,
    {
      method: "GET",
      service: "queue",
      headers: getUserHeader(),
    },
  );
  return res.data.data;
}
