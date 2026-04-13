import { fetchWithAuth } from "@/shared/api";
import { tokenStore } from "@/shared/api/tokenStore";
import { getUserIdFromToken } from "@/shared/lib/jwt";
import type { ApiBaseResponse } from "@/features/auth/model/types";

// --- VWR (Tier 1) ---

const VWR_BASE_URL = typeof window !== "undefined"
  ? `${window.location.origin}/vwr`
  : "https://urr.guru/vwr";

export interface VwrAssignData {
  requestId: string;
  position: number;
  estimatedWait: number;
}

export interface VwrCheckData {
  admitted: boolean;
  token?: string;
  position: number;
  servingCounter: number;
  totalInQueue: number;
  ahead: number;
  estimatedWait?: number;
  nextPoll?: number;
}

export async function vwrAssign(eventId: string | number): Promise<VwrAssignData> {
  const response = await fetch(`${VWR_BASE_URL}/assign/${eventId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  if (!response.ok) throw new Error(`VWR assign failed: ${response.status}`);
  return response.json();
}

export async function vwrCheck(eventId: string | number, requestId: string): Promise<VwrCheckData> {
  const response = await fetch(`${VWR_BASE_URL}/check/${eventId}/${requestId}`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error(`VWR check failed: ${response.status}`);
  return response.json();
}

function getAuthHeader(): Record<string, string> {
  const token = tokenStore.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setEntryTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `urr-entry-token=${token}; path=/; max-age=900; SameSite=Lax`;
}

// --- Queue (Tier 2) ---

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

export { setEntryTokenCookie };
