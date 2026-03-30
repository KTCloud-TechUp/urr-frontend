import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMembership } from "../api/cancelMembership";
import { MEMBERSHIPS_QUERY_KEY } from "./useMemberships";

export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelMembership(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY });
    },
  });
}
