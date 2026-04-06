import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeMembership } from "../api/subscribeMembership";
import { MEMBERSHIPS_QUERY_KEY } from "./useMemberships";

export function useSubscribeMembership(userId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artistId: string | number) => subscribeMembership(artistId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY });
    },
  });
}
