import { apiRequest } from "@/shared/api/client";

export async function unfollowArtist(
  artistId: string | number,
  userId: number,
): Promise<void> {
  await apiRequest(`/artists/${artistId}/follow?userId=${userId}`, {
    method: "DELETE",
    service: "events",
  });
}
