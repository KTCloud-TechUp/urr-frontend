import { useQuery } from "@tanstack/react-query";
import { getMemberships } from "../api/getMemberships";
import { tokenStore } from "@/shared/api/tokenStore";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";

export const MEMBERSHIPS_QUERY_KEY = ["memberships"] as const;

export function useMemberships() {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: MEMBERSHIPS_QUERY_KEY,
    queryFn: () => getMemberships(currentUser!.userId),
    enabled: !!tokenStore.getToken() && !!currentUser,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}
