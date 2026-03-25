import type { Artist } from "@/shared/types";
import { mockArtists } from "./artists";
import type {
  BannerEvent,
  TrendingEvent,
  RankingEvent,
  PreSaleEvent,
} from "@/entities/event";

// --- 아티스트별 그라디언트 ---
export const artistGradients: Record<string, string> = {
  gdragon: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  bts: "linear-gradient(135deg, #4a0e4e 0%, #2b1055 50%, #7597de 100%)",
  blackpink: "linear-gradient(135deg, #ff006e 0%, #1a1a1a 50%, #ff006e 100%)",
  aespa: "linear-gradient(135deg, #0d7377 0%, #0a5c5e 50%, #083d3f 100%)",
  ive: "linear-gradient(135deg, #e8739e 0%, #c94c78 50%, #a62d5c 100%)",
  skz: "linear-gradient(135deg, #1a1a1a 0%, #c70039 50%, #1a1a1a 100%)",
  seventeen: "linear-gradient(135deg, #f7971e 0%, #e8891a 50%, #d47b16 100%)",
  newjeans: "linear-gradient(135deg, #4a7fb5 0%, #3a6a9e 50%, #2b5587 100%)",
  gidle: "linear-gradient(135deg, #6a0572 0%, #ab83a1 50%, #6a0572 100%)",
  txt: "linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)",
  day6: "linear-gradient(135deg, #2d5016 0%, #4a7c23 50%, #2d5016 100%)",
  brunomars: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)",
};

export function getArtistGradient(artistId: string): string {
  return (
    artistGradients[artistId] ??
    "linear-gradient(135deg, #374151 0%, #6b7280 100%)"
  );
}

// --- 인기 아티스트 10명 (followerCount 내림차순) ---
const additionalArtists: Artist[] = [
  {
    id: "skz",
    name: "Stray Kids",
    avatar: "/artists/artist_stray-kids.png",
    banner: "/events/event_stray-kids-domin-world-tour.png",
    bio: "JYP Entertainment 8인조 보이그룹. 자체 프로듀싱의 대명사.",
    followerCount: 4800000,
    category: "boygroup",
  },
  {
    id: "seventeen",
    name: "SEVENTEEN",
    avatar: "/artists/artist_seventeen.png",
    banner: "/events/event_seventeen-be-the-sun.png",
    bio: "PLEDIS Entertainment 13인조 보이그룹. 자체 안무, 자작곡의 아이콘.",
    followerCount: 5600000,
    category: "boygroup",
  },
  {
    id: "newjeans",
    name: "NewJeans",
    avatar: "/artists/artist_newjeans.png",
    banner: "/events/event_newjeans-complexcon.png",
    bio: "ADOR 5인조 걸그룹. 새로운 시대의 K-POP 트렌드세터.",
    followerCount: 6100000,
    category: "girlgroup",
  },
  {
    id: "gidle",
    name: "(G)I-DLE",
    avatar: "/artists/artist_gi-dle.png",
    banner: "/events/presale_gi-dle-world-tour.png",
    bio: "CUBE Entertainment 5인조 걸그룹. 전원 자작곡 걸그룹의 선두주자.",
    followerCount: 3400000,
    category: "girlgroup",
  },
  {
    id: "txt",
    name: "TXT",
    avatar: "/artists/artist_txt.png",
    banner: "/events/presale_txt-world-tour.png",
    bio: "BIGHIT MUSIC 5인조 보이그룹. 독보적 세계관과 음악 실험.",
    followerCount: 4200000,
    category: "boygroup",
  },
];

export const homePopularArtists: Artist[] = [
  ...mockArtists,
  ...additionalArtists,
].sort((a, b) => (b.followerCount ?? 0) - (a.followerCount ?? 0));

// --- 히어로 배너 ---
export const homeBannerEvents: BannerEvent[] = [
  {
    id: "evt-bts-encore-2026",
    artistId: "bts",
    artistName: "BTS",
    title: "BTS YET TO COME ENCORE IN SEOUL",
    venue: "잠실종합운동장 주경기장",
    date: "2026-08-01T19:00:00+09:00",
    status: "upcoming",
    bannerImage: "/heroes/hero-banner.png",
  },
  {
    id: "evt-gdragon-2026",
    artistId: "gdragon",
    artistName: "G-Dragon",
    title: "G-Dragon 2026 DOME TOUR",
    venue: "KSPO DOME (올림픽 체조 경기장)",
    date: "2026-06-01T18:00:00+09:00",
    status: "open",
    bannerImage: "/heroes/hero_g-dragon.png",
  },
  {
    id: "evt-aespa-synk-2026",
    artistId: "aespa",
    artistName: "aespa",
    title: "aespa LIVE SYNK : PARALLEL",
    venue: "KSPO DOME (올림픽 체조 경기장)",
    date: "2026-09-20T18:00:00+09:00",
    status: "upcoming",
    bannerImage: "/heroes/hero_aespa.png",
  },
  {
    id: "evt-blackpink-world-2026",
    artistId: "blackpink",
    artistName: "BLACKPINK",
    title: "BLACKPINK BORN PINK WORLD TOUR FINALE",
    venue: "고척스카이돔",
    date: "2026-07-15T18:30:00+09:00",
    status: "open",
    bannerImage: "/heroes/hero_blackpink.png",
  },
];

// --- 지금 뜨는 공연 ---
export const homeTodayTicketing: TrendingEvent[] = [
  {
    id: "evt-bts-encore-2026",
    artistId: "bts",
    artistName: "BTS",
    title: "BTS Yet to Come in Cinemas",
    venue: "잠실종합운동장 주경기장",
    dateRange: "2026.8.1 ~ 8.3",
    status: "open",
    poster: "/events/event_bts-yet-to-come-in-cinema.png",
  },
  {
    id: "evt-blackpink-world-2026",
    artistId: "blackpink",
    artistName: "BLACKPINK",
    title: "BLACKPINK BORN PINK WORLD TOUR SEOUL",
    venue: "고척스카이돔",
    dateRange: "2026.7.15 ~ 7.16",
    status: "open",
    tags: ["좌석우위"],
    poster: "/events/event_blackpink-born-pink.png",
  },
  {
    id: "evt-ive-show-2026",
    artistId: "ive",
    artistName: "IVE",
    title: "IVE WORLD TOUR SHOW WHAT I AM",
    venue: "KSPO DOME",
    dateRange: "2026.6.20 ~ 6.22",
    status: "open",
    poster: "/events/event_ive-show-what-i-am.png",
  },
  {
    id: "evt-newjeans-complexcon-2026",
    artistId: "newjeans",
    artistName: "NewJeans",
    title: "NewJeans × COMPLEXCON",
    venue: "Long Beach Convention Center",
    dateRange: "2026.5.10 ~ 5.11",
    status: "open",
    poster: "/events/event_newjeans-complexcon.png",
  },
  {
    id: "evt-seventeen-sun-2026",
    artistId: "seventeen",
    artistName: "SEVENTEEN",
    title: "SEVENTEEN WORLD TOUR BE THE SUN",
    venue: "잠실종합운동장 주경기장",
    dateRange: "2026.5.25 ~ 5.27",
    status: "open",
    tags: ["단독판매"],
    poster: "/events/event_seventeen-be-the-sun.png",
  },
  {
    id: "evt-skz-domtour-2026",
    artistId: "skz",
    artistName: "Stray Kids",
    title: "Stray Kids DOMINANCE WORLD TOUR",
    venue: "고척스카이돔",
    dateRange: "2026.7.5 ~ 7.6",
    status: "open",
    poster: "/events/event_stray-kids-domin-world-tour.png",
  },
];

// --- 인기 공연 랭킹 ---
export const homeRankingEvents: RankingEvent[] = [
  { id: "evt-gdragon-2026", artistId: "gdragon", artistName: "G-Dragon", title: "G-Dragon WORLD TOUR", viewCount: 14200, status: "open", profileImage: "/artists/profile_g-dragon.png" },
  { id: "evt-aespa-synk-2026", artistId: "aespa", artistName: "aespa", title: "aespa LIVE TOUR", viewCount: 12800, status: "open", profileImage: "/artists/profile_aespa.png" },
  { id: "evt-seventeen-tour-2026", artistId: "seventeen", artistName: "SEVENTEEN", title: "SEVENTEEN TOUR", viewCount: 10500, status: "open", profileImage: "/artists/profile_seventeen.png" },
  { id: "evt-ive-show-2026", artistId: "ive", artistName: "IVE", title: "IVE Concert 2026", viewCount: 8900, status: "upcoming", profileImage: "/artists/profile_ive.png" },
  { id: "evt-newjeans-fanmeet-2026", artistId: "newjeans", artistName: "NewJeans", title: "NewJeans Fan Meeting", viewCount: 7200, status: "upcoming", profileImage: "/artists/profile_newjeans.png" },
  { id: "evt-day6-world-2026", artistId: "day6", artistName: "DAY6", title: "DAY6 World Tour", viewCount: 6800, status: "open", profileImage: "/artists/profile_day6.png" },
  { id: "evt-blackpink-world-2026", artistId: "blackpink", artistName: "BLACKPINK", title: "BLACKPINK BORN PINK", viewCount: 6100, status: "upcoming", profileImage: "/artists/profile_blackpink.png" },
  { id: "evt-brunomars-2026", artistId: "brunomars", artistName: "Bruno Mars", title: "Bruno Mars Live in Seoul", viewCount: 5400, status: "upcoming", profileImage: "/artists/profile_bruno-mars.png" },
];

// --- 추천 아티스트 ---
export interface FeaturedArtist {
  id: string;
  name: string;
  image: string;
  followerCount: number;
  category: "group" | "solo" | "new";
}

export const featuredArtists: FeaturedArtist[] = [
  { id: "akmu", name: "악동뮤지션", image: "/recommend/recommend_akmu.png", followerCount: 1420000, category: "group" },
  { id: "kwon", name: "권정렬", image: "/recommend/recommend_kwon-jungyeol.png", followerCount: 1420000, category: "solo" },
  { id: "riize", name: "RIIZE", image: "/recommend/recommend_riize.png", followerCount: 1420000, category: "new" },
  { id: "iu", name: "IU", image: "/recommend/recommend_iu.png", followerCount: 7800000, category: "solo" },
  { id: "aespa-feat", name: "aespa", image: "/recommend/recommend_aespa.png", followerCount: 5500000, category: "group" },
  { id: "nmixx-feat", name: "NMIXX", image: "/recommend/recommend_nmixx.png", followerCount: 2800000, category: "group" },
  { id: "txt-feat", name: "TXT", image: "/recommend/recommend_txt.png", followerCount: 4300000, category: "group" },
  { id: "tours-feat", name: "투어스", image: "/recommend/recommend_tours.png", followerCount: 1200000, category: "new" },
  { id: "newjeans-feat", name: "NewJeans", image: "/artists/artist_newjeans.png", followerCount: 6100000, category: "new" },
  { id: "straykids-feat", name: "Stray Kids", image: "/artists/artist_stray-kids.png", followerCount: 5800000, category: "group" },
  { id: "seventeen-feat", name: "SEVENTEEN", image: "/artists/artist_seventeen.png", followerCount: 5200000, category: "group" },
  { id: "gidle-feat", name: "(G)I-DLE", image: "/artists/artist_gi-dle.png", followerCount: 3900000, category: "group" },
];

// --- 주목할 만한 NEW 아티스트 ---
export interface NewArtistCard {
  id: string;
  name: string;
  profileImage: string;
  label: string;
  title: string;
  description: string;
}

export const newArtistCards: NewArtistCard[] = [
  {
    id: "riize",
    name: "RIIZE",
    profileImage: "/recommend/new-artist_riize.png",
    label: "신인상 수상",
    title: "RIIZE, 데뷔와 동시에 음원차트 올킬",
    description: "SM의 새로운 보이그룹 RIIZE가 데뷔 앨범으로 주요 음원차트를 석권하며 신인상을 수상했습니다.",
  },
  {
    id: "akmu",
    name: "악동뮤지션",
    profileImage: "/recommend/new-artist_akmu.png",
    label: "컴백 확정",
    title: "악동뮤지션, 2년 만의 정규앨범 컴백",
    description: "악동뮤지션이 2년 만에 정규앨범으로 돌아옵니다. 타이틀곡 선공개가 예정되어 있습니다.",
  },
  {
    id: "kwon",
    name: "권정렬",
    profileImage: "/recommend/new-artist_kwon-jungyeol.png",
    label: "단독 콘서트",
    title: "권정렬, 첫 단독 콘서트 개최 확정",
    description: "10CM 권정렬이 첫 단독 콘서트를 개최합니다. 전석 매진이 예상되는 뜨거운 관심입니다.",
  },
];

// --- 선예매 오픈 임박 ---
export const homePreSaleEvents: PreSaleEvent[] = [
  {
    id: "evt-skz-domtour-2026",
    artistId: "skz",
    title: "Stray Kids DOMINANCE WORLD TOUR",
    openDateTime: "03.11(수) 20:00",
    ticketType: "일반예매",
    tags: ["HOT"],
    venue: "고척스카이돔",
    poster: "/events/presale_straykids-dominance.png",
  },
  {
    id: "evt-gidle-world-2026",
    artistId: "gidle",
    title: "(G)I-DLE WORLD TOUR 'iDOL'",
    openDateTime: "03.06(금) 14:00",
    ticketType: "선예매",
    tags: ["HOT", "좌석우위"],
    poster: "/events/presale_gi-dle-world-tour.png",
  },
  {
    id: "evt-seventeen-tour-2026",
    artistId: "seventeen",
    title: "SEVENTEEN FOLLOW AGAIN TOUR",
    openDateTime: "03.06(금) 17:00",
    ticketType: "일반예매",
    tags: ["좌석우위"],
    poster: "/events/presale_seventeen-follow-again-tour.png",
  },
  {
    id: "evt-txt-act-2026",
    artistId: "txt",
    title: "TXT WORLD TOUR ACT : PROMISE",
    openDateTime: "내일 20:00",
    ticketType: "일반예매",
    tags: ["HOT", "단독판매"],
    poster: "/events/presale_txt-world-tour.png",
  },
  {
    id: "evt-newjeans-fanmeet-2026",
    artistId: "newjeans",
    title: "NewJeans Fan Meeting 'Bunnies Camp'",
    openDateTime: "03.09(월) 14:00",
    ticketType: "일반예매",
    tags: ["HOT"],
    poster: "/events/presale_newjeans-fan-meeting.png",
  },
  {
    id: "evt-ive-show-2026",
    artistId: "ive",
    title: "IVE THE 1ST WORLD TOUR",
    openDateTime: "03.03(화) 20:00",
    ticketType: "일반예매",
    tags: ["단독판매"],
    poster: "/events/presale_ive-1st-world-tour.png",
  },
];
