import { apiRequest } from "@/shared/api/client";

export async function followArtist(
  artistId: string | number,
  userId: number,
): Promise<void> {
  await apiRequest(`/artists/${artistId}/follow`, {
    method: "POST",
    service: "events",
    headers: { "X-User-Id": String(userId) },
  });
}
