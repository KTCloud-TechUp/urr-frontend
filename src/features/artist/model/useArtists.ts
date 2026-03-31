import { useQuery } from "@tanstack/react-query";
import { getArtists } from "../api/getArtists";
import type { Artist } from "@/shared/types";

export const ARTISTS_QUERY_KEY = ["artists"] as const;

export function useArtists() {
  return useQuery({
    queryKey: ARTISTS_QUERY_KEY,
    queryFn: async (): Promise<Artist[]> => {
      const items = await getArtists();
      return items.map((item) => ({
        id: String(item.id),
        name: item.name,
        avatar: item.profileImageUrl,
        banner: item.bannerImageUrl ?? "",
        bio: item.bio ?? "",
        followerCount: item.followerCount,
        category: item.category ?? "solo",
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
