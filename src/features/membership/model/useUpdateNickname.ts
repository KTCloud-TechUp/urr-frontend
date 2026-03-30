import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNickname } from "../api/updateNickname";
import { MEMBERSHIPS_QUERY_KEY } from "./useMemberships";

export function useUpdateNickname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      membershipId,
      userId,
      nickname,
    }: {
      membershipId: string | number;
      userId: number;
      nickname: string;
    }) => updateNickname(membershipId, userId, nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_QUERY_KEY });
    },
  });
}
