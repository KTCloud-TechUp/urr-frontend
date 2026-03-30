import { fetchWithAuth } from "@/shared/api";

export async function updateNickname(
  membershipId: string | number,
  userId: number,
  nickname: string,
): Promise<void> {
  await fetchWithAuth(`/membership/${membershipId}/nickname`, {
    method: "PATCH",
    service: "events",
    headers: { "X-User-Id": String(userId) },
    body: { nickname },
  });
}
