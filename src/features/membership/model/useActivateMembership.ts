import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateMembership } from "../api/activateMembership";
import { MEMBERSHIPS_QUERY_KEY } from "./useMemberships";

export function useActivateMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, paymentId }: { orderId: string; paymentId: string }) =>
      activateMembership(orderId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY });
    },
  });
}
