import { mockArtists } from "./artists";
import type {
  BannerEvent,
  TrendingEvent,
  RankingEvent,
  PreSaleEvent,
} from "@/entities/event";

// --- 아티스트별 그라디언트 (numeric ID 기준) ---
export const artistGradients: Record<string, string> = {
  "1": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", // G-Dragon
  "2": "linear-gradient(135deg, #4a0e4e 0%, #2b1055 50%, #7597de 100%)", // BTS
  "3": "linear-gradient(135deg, #0d7377 0%, #0a5c5e 50%, #083d3f 100%)", // aespa
  "4": "linear-gradient(135deg, #e8739e 0%, #c94c78 50%, #a62d5c 100%)", // IVE
  "5": "linear-gradient(135deg, #ff006e 0%, #1a1a1a 50%, #ff006e 100%)", // BLACKPINK
  "6": "linear-gradient(135deg, #1a1a1a 0%, #c70039 50%, #1a1a1a 100%)", // Stray Kids
  "7": "linear-gradient(135deg, #f7971e 0%, #e8891a 50%, #d47b16 100%)", // SEVENTEEN
  "8": "linear-gradient(135deg, #4a7fb5 0%, #3a6a9e 50%, #2b5587 100%)", // NewJeans
  "9": "linear-gradient(135deg, #6a0572 0%, #ab83a1 50%, #6a0572 100%)", // (G)I-DLE
  "10": "linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)", // TXT
  "11": "linear-gradient(135deg, #2d5016 0%, #4a7c23 50%, #2d5016 100%)", // DAY6
  "12": "linear-gradient(135deg, #264653 0%, #2a9d8f 50%, #264653 100%)", // TWS
  "13": "linear-gradient(135deg, #2c2c54 0%, #474787 50%, #2c2c54 100%)", // 악동뮤지션
  "14": "linear-gradient(135deg, #3d5a80 0%, #98c1d9 50%, #3d5a80 100%)", // 권정렬
  "15": "linear-gradient(135deg, #e63946 0%, #457b9d 50%, #1d3557 100%)", // RIIZE
  "16": "linear-gradient(135deg, #b5838d 0%, #e5989b 50%, #b5838d 100%)", // IU
  "17": "linear-gradient(135deg, #7b2d8b 0%, #d63384 50%, #7b2d8b 100%)", // NMIXX
};

export function getArtistGradient(artistId: string): string {
  return (
    artistGradients[artistId] ??
    "linear-gradient(135deg, #374151 0%, #6b7280 100%)"
  );
}

// --- 인기 아티스트 (followerCount 내림차순) ---
export const homePopularArtists = [...mockArtists].sort(
  (a, b) => (b.followerCount ?? 0) - (a.followerCount ?? 0),
);

// --- 히어로 배너 ---
export const homeBannerEvents: BannerEvent[] = [
  {
    id: "2",
    artistId: "2",
    artistName: "BTS",
    title: "BTS YET TO COME ENCORE IN SEOUL",
    venue: "잠실종합운동장 주경기장",
    date: "2026-08-01T19:00:00+09:00",
    status: "upcoming",
    bannerImage: "/artists/2/banner.png",
  },
  {
    id: "1",
    artistId: "1",
    artistName: "G-Dragon",
    title: "G-Dragon 2026 DOME TOUR",
    venue: "KSPO DOME (올림픽 체조 경기장)",
    date: "2026-06-01T18:00:00+09:00",
    status: "open",
    bannerImage: "/artists/1/banner.png",
  },
  {
    id: "4",
    artistId: "3",
    artistName: "aespa",
    title: "aespa LIVE SYNK : PARALLEL",
    venue: "KSPO DOME (올림픽 체조 경기장)",
    date: "2026-09-20T18:00:00+09:00",
    status: "upcoming",
    bannerImage: "/artists/3/banner.png",
  },
  {
    id: "7",
    artistId: "5",
    artistName: "BLACKPINK",
    title: "BLACKPINK BORN PINK WORLD TOUR FINALE",
    venue: "고척스카이돔",
    date: "2026-07-15T18:30:00+09:00",
    status: "open",
    bannerImage: "/artists/5/banner.png",
  },
];

// --- 지금 뜨는 공연 ---
export const homeTodayTicketing: TrendingEvent[] = [
  {
    id: "2",
    artistId: "2",
    artistName: "BTS",
    title: "BTS Yet to Come in Cinemas",
    venue: "잠실종합운동장 주경기장",
    dateRange: "2026.8.1 ~ 8.3",
    status: "open",
    poster: "/artists/2/events/event_bts-yet-to-come-in-cinema.png",
  },
  {
    id: "7",
    artistId: "5",
    artistName: "BLACKPINK",
    title: "BLACKPINK BORN PINK WORLD TOUR SEOUL",
    venue: "고척스카이돔",
    dateRange: "2026.7.15 ~ 7.16",
    status: "open",
    tags: ["좌석우위"],
    poster: "/artists/5/events/event_blackpink-born-pink.png",
  },
  {
    id: "5",
    artistId: "4",
    artistName: "IVE",
    title: "IVE WORLD TOUR SHOW WHAT I AM",
    venue: "KSPO DOME",
    dateRange: "2026.6.20 ~ 6.22",
    status: "open",
    poster: "/artists/4/events/event_ive-show-what-i-am.png",
  },
  {
    id: "11",
    artistId: "8",
    artistName: "NewJeans",
    title: "NewJeans × COMPLEXCON",
    venue: "Long Beach Convention Center",
    dateRange: "2026.5.10 ~ 5.11",
    status: "open",
    poster: "/artists/8/events/event_newjeans-complexcon.png",
  },
  {
    id: "9",
    artistId: "7",
    artistName: "SEVENTEEN",
    title: "SEVENTEEN WORLD TOUR BE THE SUN",
    venue: "잠실종합운동장 주경기장",
    dateRange: "2026.5.25 ~ 5.27",
    status: "open",
    tags: ["단독판매"],
    poster: "/artists/7/events/event_seventeen-be-the-sun.png",
  },
  {
    id: "8",
    artistId: "6",
    artistName: "Stray Kids",
    title: "Stray Kids DOMINANCE WORLD TOUR",
    venue: "고척스카이돔",
    dateRange: "2026.7.5 ~ 7.6",
    status: "open",
    poster: "/artists/6/events/event_stray-kids-domin-world-tour.png",
  },
];

// --- 인기 공연 랭킹 ---
export const homeRankingEvents: RankingEvent[] = [
  {
    id: "1",
    artistId: "1",
    artistName: "G-Dragon",
    title: "G-Dragon 2026 DOME TOUR",
    viewCount: 15000,
    status: "upcoming",
    profileImage: "/artists/1/profile.png",
  },
  {
    id: "2",
    artistId: "2",
    artistName: "BTS",
    title: "BTS WORLD TOUR ‘ARIRANG’ IN GOYANG",
    viewCount: 14200,
    status: "open",
    profileImage: "/artists/2/profile.png",
  },
  {
    id: "8",
    artistId: "6",
    artistName: "stray kids",
    title: "Stray Kids 6TH FANMEETING ‘STAY in Our Little House’",
    viewCount: 12800,
    status: "open",
    profileImage: "/artists/6/profile.png",
  },
  {
    id: "10",
    artistId: "7",
    artistName: "SEVENTEEN",
    title: "SEVENTEEN TOUR",
    viewCount: 10500,
    status: "open",
    profileImage: "/artists/7/profile.png",
  },
  {
    id: "6",
    artistId: "4",
    artistName: "IVE",
    title: "IVE Concert 2026",
    viewCount: 8900,
    status: "upcoming",
    profileImage: "/artists/4/profile.png",
  },
  {
    id: "16",
    artistId: "11",
    artistName: "DAY6",
    title: "DAY6 World Tour",
    viewCount: 6800,
    status: "open",
    profileImage: "/artists/11/profile.png",
  },
  {
    id: "7",
    artistId: "5",
    artistName: "BLACKPINK",
    title: "BLACKPINK BORN PINK",
    viewCount: 6100,
    status: "upcoming",
    profileImage: "/artists/5/profile.png",
  },
  {
    id: "12",
    artistId: "8",
    artistName: "NewJeans",
    title: "NewJeans × COMPLEXCON",
    viewCount: 5400,
    status: "upcoming",
    profileImage: "/artists/8/profile.png",
  },
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
  {
    id: "13",
    name: "악동뮤지션",
    image: "/home/featured-akmu.png",
    followerCount: 1420000,
    category: "group",
  },
  {
    id: "14",
    name: "권정렬",
    image: "/home/featured-kwon-jungyeol.png",
    followerCount: 1420000,
    category: "solo",
  },
  {
    id: "15",
    name: "RIIZE",
    image: "/home/featured-riize.png",
    followerCount: 1420000,
    category: "new",
  },
  {
    id: "16",
    name: "IU",
    image: "/home/featured-iu.png",
    followerCount: 7800000,
    category: "solo",
  },
  {
    id: "3",
    name: "aespa",
    image: "/home/featured-aespa.png",
    followerCount: 3200000,
    category: "group",
  },
  {
    id: "17",
    name: "NMIXX",
    image: "/home/featured-nmixx.png",
    followerCount: 2800000,
    category: "group",
  },
  {
    id: "10",
    name: "TXT",
    image: "/home/featured-txt.png",
    followerCount: 4200000,
    category: "group",
  },
  {
    id: "12",
    name: "TWS",
    image: "/home/featured-tws.png",
    followerCount: 1200000,
    category: "new",
  },
  {
    id: "8",
    name: "NewJeans",
    image: "/home/featured-newjeans.jpg",
    followerCount: 6100000,
    category: "new",
  },
  {
    id: "6",
    name: "Stray Kids",
    image: "/home/featured-stray-kids.jpg",
    followerCount: 4800000,
    category: "group",
  },
  {
    id: "7",
    name: "SEVENTEEN",
    image: "/home/featured-seventeen.jpg",
    followerCount: 5600000,
    category: "group",
  },
  {
    id: "9",
    name: "(G)I-DLE",
    image: "/home/featured-gi-dle.jpg",
    followerCount: 3400000,
    category: "group",
  },
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
    id: "15",
    name: "RIIZE",
    profileImage: "/home/new-artist-riize.png",
    label: "신인상 수상",
    title: "RIIZE, 데뷔와 동시에 음원차트 올킬",
    description:
      "SM의 새로운 보이그룹 RIIZE가 데뷔 앨범으로 주요 음원차트를 석권하며 신인상을 수상했습니다.",
  },
  {
    id: "13",
    name: "악동뮤지션",
    profileImage: "/home/new-artist-akmu.png",
    label: "컴백 확정",
    title: "악동뮤지션, 2년 만의 정규앨범 컴백",
    description:
      "악동뮤지션이 2년 만에 정규앨범으로 돌아옵니다. 타이틀곡 선공개가 예정되어 있습니다.",
  },
  {
    id: "14",
    name: "권정렬",
    profileImage: "/home/new-artist-kwon-jungyeol.png",
    label: "단독 콘서트",
    title: "권정렬, 첫 단독 콘서트 개최 확정",
    description:
      "10CM 권정렬이 첫 단독 콘서트를 개최합니다. 전석 매진이 예상되는 뜨거운 관심입니다.",
  },
];

// --- 선예매 오픈 임박 ---
export const homePreSaleEvents: PreSaleEvent[] = [
  {
    id: "8",
    artistId: "6",
    title: "Stray Kids DOMINANCE WORLD TOUR",
    openDateTime: "03.11(수) 20:00",
    ticketType: "일반예매",
    tags: ["HOT"],
    venue: "고척스카이돔",
    poster: "/artists/6/events/presale_straykids-dominance.png",
  },
  {
    id: "13",
    artistId: "9",
    title: "(G)I-DLE WORLD TOUR 'iDOL'",
    openDateTime: "03.06(금) 14:00",
    ticketType: "선예매",
    tags: ["HOT", "좌석우위"],
    poster: "/artists/9/events/presale_gi-dle-world-tour.png",
  },
  {
    id: "10",
    artistId: "7",
    title: "SEVENTEEN FOLLOW AGAIN TOUR",
    openDateTime: "03.06(금) 17:00",
    ticketType: "일반예매",
    tags: ["좌석우위"],
    poster: "/artists/7/events/presale_seventeen-follow-again-tour.png",
  },
  {
    id: "14",
    artistId: "10",
    title: "TXT WORLD TOUR ACT : PROMISE",
    openDateTime: "내일 20:00",
    ticketType: "일반예매",
    tags: ["HOT", "단독판매"],
    poster: "/artists/10/events/presale_txt-world-tour.png",
  },
  {
    id: "12",
    artistId: "8",
    title: "NewJeans Fan Meeting 'Bunnies Camp'",
    openDateTime: "03.09(월) 14:00",
    ticketType: "일반예매",
    tags: ["HOT"],
    poster: "/artists/8/events/presale_newjeans-fan-meeting.png",
  },
  {
    id: "6",
    artistId: "4",
    title: "IVE THE 1ST WORLD TOUR",
    openDateTime: "03.03(화) 20:00",
    ticketType: "일반예매",
    tags: ["단독판매"],
    poster: "/artists/4/events/presale_ive-1st-world-tour.png",
  },
];
