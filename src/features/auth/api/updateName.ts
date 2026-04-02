import { fetchWithAuth } from "@/shared/api";

export async function updateName(name: string): Promise<void> {
  await fetchWithAuth("/auth/me/name", {
    method: "PATCH",
    body: { name },
    service: "users",
  });
}
