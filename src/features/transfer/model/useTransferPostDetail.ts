import { useQuery } from "@tanstack/react-query";
import { getTransferPostById } from "../api/getTransferPosts";

export function useTransferPostDetail(id: string, userId?: number | string) {
  return useQuery({
    queryKey: ["transfer-post", id, userId],
    queryFn: () => getTransferPostById(id, userId),
    enabled: !!id,
  });
}
