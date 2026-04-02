import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMembership } from "../api/cancelMembership";
import { MEMBERSHIPS_QUERY_KEY } from "./useMemberships";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";

export function useCancelMembership() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (orderId: string) => cancelMembership(orderId, currentUser!.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY });
    },
  });
}
