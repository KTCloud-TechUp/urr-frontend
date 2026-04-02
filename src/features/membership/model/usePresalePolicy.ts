import { useQuery } from "@tanstack/react-query";
import { getPresalePolicy } from "../api/getPresalePolicy";

export function usePresalePolicy(
  eventId: string | number,
  showId: string | number,
) {
  return useQuery({
    queryKey: ["presale-policy", eventId, showId],
    queryFn: () => getPresalePolicy(eventId, showId),
    enabled: !!eventId && !!showId,
    staleTime: 5 * 60 * 1000,
  });
}
