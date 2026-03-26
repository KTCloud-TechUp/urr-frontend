import type { Artist } from "@/shared/types";

export const mockArtists: Artist[] = [
  {
    id: "gdragon",
    name: "G-Dragon",
    avatar: "/artists/profile_gdragon_artist-home.png",
    banner: "/heroes/hero_g-dragon.png",
    bio: "BIGBANG 리더이자 솔로 아티스트. K-POP의 아이콘.",
    followerCount: 2450000,
    category: "solo",
  },
  {
    id: "bts",
    name: "BTS",
    avatar: "/artists/artist_bts.png",
    banner: "/heroes/hero-banner.png",
    bio: "글로벌 K-POP 보이그룹. 전 세계를 사로잡은 음악과 메시지.",
    followerCount: 8900000,
    category: "boygroup",
  },
  {
    id: "aespa",
    name: "aespa",
    avatar: "/artists/artist_aespa.png",
    banner: "/heroes/hero_aespa.png",
    bio: "SM Entertainment 4인조 걸그룹. 메타버스 세계관의 선두주자.",
    followerCount: 3200000,
    category: "girlgroup",
  },
  {
    id: "ive",
    name: "IVE",
    avatar: "/artists/artist_ive.png",
    banner: "/events/event_ive-show-what-i-am.png",
    bio: 'Starship Entertainment 6인조 걸그룹. "나"를 당당하게 표현하는 음악.',
    followerCount: 2100000,
    category: "girlgroup",
  },
  {
    id: "blackpink",
    name: "BLACKPINK",
    avatar: "/artists/artist_blackpink.png",
    banner: "/heroes/hero_blackpink.png",
    bio: "YG Entertainment 글로벌 걸그룹. 음악, 패션, 퍼포먼스의 완성형.",
    followerCount: 7500000,
    category: "girlgroup",
  },
];

export function getArtistById(id: string): Artist | undefined {
  return mockArtists.find((a) => a.id === id);
}
