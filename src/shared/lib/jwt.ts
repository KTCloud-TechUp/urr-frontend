import { tokenStore } from "@/shared/api/tokenStore";

export function getUserIdFromToken(): number | null {
  const token = tokenStore.getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}
