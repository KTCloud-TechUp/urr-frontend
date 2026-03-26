import type { Artist, BookingStatus } from '@/types'
import { mockArtists } from './mock-artists'

// --- Asset imports ---
// Featured artist images (square)
import featKwon from '@/assets/recommend_kwon-jungyeol.png'
import featAkmu from '@/assets/recommend_akmu.png'
import featRiize from '@/assets/recommend_riize.png'
import featIU from '@/assets/recommend_iu.png'
import featAespa from '@/assets/recommend_aespa.png'
import featNMIXX from '@/assets/recommend_nmixx.png'
import featTXT from '@/assets/recommend_txt.png'
import featTours from '@/assets/recommend_tours.png'

// NEW 아티스트 이미지
import newArtistKwon from '@/assets/new-artist_kwon-jungyeol.png'
import newArtistAkmu from '@/assets/new-artist_akmu.png'
import newArtistRiize from '@/assets/new-artist_riize.png'

import avatarSKZ from '@/assets/artist_stray-kids.png'
import avatarSVT from '@/assets/artist_seventeen.png'
import avatarNJ from '@/assets/artist_newjeans.png'
import avatarGIDLE from '@/assets/artist_gi-dle.png'
import avatarTXT from '@/assets/artist_txt.png'
import bannerSKZ from '@/assets/event_stray-kids-domin-world-tour.png'
import bannerSVT from '@/assets/event_seventeen-be-the-sun.png'
import bannerNJ from '@/assets/event_newjeans-complexcon.png'
import bannerGIDLE from '@/assets/presale_gi-dle-world-tour.png'
import bannerTXT from '@/assets/presale_txt-world-tour.png'
import heroBannerImg from '@/assets/hero-banner.png'
import heroGDragon from '@/assets/hero_g-dragon.png'
import heroBlackpink from '@/assets/hero_blackpink.png'
import heroAespa from '@/assets/hero_aespa.png'
import posterBTSYTC from '@/assets/event_bts-yet-to-come-in-cinema.png'
import posterBPBornPink from '@/assets/event_blackpink-born-pink.png'
import posterIVESWIA from '@/assets/event_ive-show-what-i-am.png'
import posterNJComplexcon from '@/assets/event_newjeans-complexcon.png'
import posterSVTBetheSun from '@/assets/event_seventeen-be-the-sun.png'
import posterSKZDomin from '@/assets/event_stray-kids-domin-world-tour.png'

// Profile images (for ranking section)
import profileGDragon from '@/assets/profile_g-dragon.png'
import profileAespa from '@/assets/profile_aespa.png'
import profileSVT from '@/assets/profile_seventeen.png'
import profileIVE from '@/assets/profile_ive.png'
import profileNJ from '@/assets/profile_newjeans.png'
import profileDay6 from '@/assets/profile_day6.png'
import profileBP from '@/assets/profile_blackpink.png'
import profileBrunoMars from '@/assets/profile_bruno-mars.png'

// Pre-sale event thumbnails
import presaleSKZ from '@/assets/presale_straykids-dominance.png'
import presaleGIDLE from '@/assets/presale_gi-dle-world-tour.png'
import presaleSVT from '@/assets/presale_seventeen-follow-again-tour.png'
import presaleTXT from '@/assets/presale_txt-world-tour.png'
import presaleNJ from '@/assets/presale_newjeans-fan-meeting.png'
import presaleIVE from '@/assets/presale_ive-1st-world-tour.png'

// --- Gradient backgrounds per artist (for banner & poster placeholders) ---
export const artistGradients: Record<string, string> = {
  gdragon: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  bts: 'linear-gradient(135deg, #4a0e4e 0%, #2b1055 50%, #7597de 100%)',
  blackpink: 'linear-gradient(135deg, #ff006e 0%, #1a1a1a 50%, #ff006e 100%)',
  aespa: 'linear-gradient(135deg, #0d7377 0%, #0a5c5e 50%, #083d3f 100%)',
  ive: 'linear-gradient(135deg, #e8739e 0%, #c94c78 50%, #a62d5c 100%)',
  skz: 'linear-gradient(135deg, #1a1a1a 0%, #c70039 50%, #1a1a1a 100%)',
  seventeen: 'linear-gradient(135deg, #f7971e 0%, #e8891a 50%, #d47b16 100%)',
  newjeans: 'linear-gradient(135deg, #4a7fb5 0%, #3a6a9e 50%, #2b5587 100%)',
  gidle: 'linear-gradient(135deg, #6a0572 0%, #ab83a1 50%, #6a0572 100%)',
  txt: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)',
  day6: 'linear-gradient(135deg, #2d5016 0%, #4a7c23 50%, #2d5016 100%)',
  brunomars: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)',
}

export function getArtistGradient(artistId: string): string {
  return artistGradients[artistId] ?? 'linear-gradient(135deg, #374151 0%, #6b7280 100%)'
}

// --- Additional artists for Home page ---
const additionalArtists: Artist[] = [
  {
    id: 'skz',
    name: 'Stray Kids',
    avatar: avatarSKZ,
    banner: bannerSKZ,
    bio: 'JYP Entertainment 8인조 보이그룹. 자체 프로듀싱의 대명사.',
    followerCount: 4800000,
    category: 'boygroup',
  },
  {
    id: 'seventeen',
    name: 'SEVENTEEN',
    avatar: avatarSVT,
    banner: bannerSVT,
    bio: 'PLEDIS Entertainment 13인조 보이그룹. 자체 안무, 자작곡의 아이콘.',
    followerCount: 5600000,
    category: 'boygroup',
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    avatar: avatarNJ,
    banner: bannerNJ,
    bio: 'ADOR 5인조 걸그룹. 새로운 시대의 K-POP 트렌드세터.',
    followerCount: 6100000,
    category: 'girlgroup',
  },
  {
    id: 'gidle',
    name: '(G)I-DLE',
    avatar: avatarGIDLE,
    banner: bannerGIDLE,
    bio: 'CUBE Entertainment 5인조 걸그룹. 전원 자작곡 걸그룹의 선두주자.',
    followerCount: 3400000,
    category: 'girlgroup',
  },
  {
    id: 'txt',
    name: 'TXT',
    avatar: avatarTXT,
    banner: bannerTXT,
    bio: 'BIGHIT MUSIC 5인조 보이그룹. 독보적 세계관과 음악 실험.',
    followerCount: 4200000,
    category: 'boygroup',
  },
]

// 10 popular artists (sorted by followers desc)
export const homePopularArtists: Artist[] = [
  ...mockArtists,
  ...additionalArtists,
].sort((a, b) => b.followerCount - a.followerCount)

// --- Banner events ---
export interface HomeBannerEvent {
  id: string
  artistId: string
  artistName: string
  title: string
  venue: string
  date: string // ISO
  status: BookingStatus
  bannerImage?: string
}

export const homeBannerEvents: HomeBannerEvent[] = [
  {
    id: 'evt-bts-encore-2026',
    artistId: 'bts',
    artistName: 'BTS',
    title: 'BTS YET TO COME ENCORE IN SEOUL',
    venue: '잠실종합운동장 주경기장',
    date: '2026-08-01T19:00:00+09:00',
    status: 'upcoming',
    bannerImage: heroBannerImg,
  },
  {
    id: 'evt-gdragon-2026',
    artistId: 'gdragon',
    artistName: 'G-Dragon',
    title: 'G-Dragon 2020 MAMA DOME TOUR',
    venue: 'KSPO DOME (올림픽 체조 경기장)',
    date: '2026-06-01T18:00:00+09:00',
    status: 'open',
    bannerImage: heroGDragon,
  },
  {
    id: 'evt-aespa-synk-2026',
    artistId: 'aespa',
    artistName: 'aespa',
    title: 'aespa LIVE SYNK : PARALLEL',
    venue: 'KSPO DOME (올림픽 체조 경기장)',
    date: '2026-09-20T18:00:00+09:00',
    status: 'upcoming',
    bannerImage: heroAespa,
  },
  {
    id: 'evt-blackpink-world-2026',
    artistId: 'blackpink',
    artistName: 'BLACKPINK',
    title: 'BLACKPINK BORN PINK WORLD TOUR FINALE',
    venue: '고척스카이돔',
    date: '2026-07-15T18:30:00+09:00',
    status: 'open',
    bannerImage: heroBlackpink,
  },
]

// --- 오늘의 티켓팅 (Today's Ticketing) --- horizontal scroll with ranking
export interface TodayTicketingEvent {
  id: string
  artistId: string
  artistName: string
  title: string
  venue: string
  dateRange: string // e.g. "2026.3.31 ~ 6.14"
  status: BookingStatus
  tags?: string[] // e.g. ["좌석우위", "단독판매"]
  poster?: string
}

export const homeTodayTicketing: TodayTicketingEvent[] = [
  {
    id: 'evt-bts-encore-2026',
    artistId: 'bts',
    artistName: 'BTS',
    title: 'BTS Yet to Come in Cinemas',
    venue: '잠실종합운동장 주경기장',
    dateRange: '2026.8.1 ~ 8.3',
    status: 'open',
    poster: posterBTSYTC,
  },
  {
    id: 'evt-blackpink-world-2026',
    artistId: 'blackpink',
    artistName: 'BLACKPINK',
    title: 'BLACKPINK BORN PINK WORLD TOUR SEOUL',
    venue: '고척스카이돔',
    dateRange: '2026.7.15 ~ 7.16',
    status: 'open',
    tags: ['좌석우위'],
    poster: posterBPBornPink,
  },
  {
    id: 'evt-ive-show-2026',
    artistId: 'ive',
    artistName: 'IVE',
    title: 'IVE WORLD TOUR SHOW WHAT I AM',
    venue: 'KSPO DOME',
    dateRange: '2026.6.20 ~ 6.22',
    status: 'open',
    poster: posterIVESWIA,
  },
  {
    id: 'evt-newjeans-complexcon-2026',
    artistId: 'newjeans',
    artistName: 'NewJeans',
    title: 'NewJeans × COMPLEXCON',
    venue: 'Long Beach Convention Center',
    dateRange: '2026.5.10 ~ 5.11',
    status: 'open',
    poster: posterNJComplexcon,
  },
  {
    id: 'evt-seventeen-sun-2026',
    artistId: 'seventeen',
    artistName: 'SEVENTEEN',
    title: 'SEVENTEEN WORLD TOUR BE THE SUN',
    venue: '잠실종합운동장 주경기장',
    dateRange: '2026.5.25 ~ 5.27',
    status: 'open',
    tags: ['단독판매'],
    poster: posterSVTBetheSun,
  },
  {
    id: 'evt-skz-domtour-2026',
    artistId: 'skz',
    artistName: 'Stray Kids',
    title: 'Stray Kids DOMINANCE WORLD TOUR',
    venue: '고척스카이돔',
    dateRange: '2026.7.5 ~ 7.6',
    status: 'open',
    poster: posterSKZDomin,
  },
]

// --- 인기 공연 랭킹 (Popular Performance Ranking) ---
export interface RankingEvent {
  id: string
  artistId: string
  artistName: string
  title: string
  viewCount: number
  status: BookingStatus
  profileImage?: string
}

export const homeRankingEvents: RankingEvent[] = [
  { id: 'evt-gdragon-2026', artistId: 'gdragon', artistName: 'G-Dragon', title: 'G-Dragon WORLD TOUR', viewCount: 14200, status: 'open', profileImage: profileGDragon },
  { id: 'evt-aespa-synk-2026', artistId: 'aespa', artistName: 'aespa', title: 'aespa LIVE TOUR', viewCount: 12800, status: 'open', profileImage: profileAespa },
  { id: 'evt-seventeen-tour-2026', artistId: 'seventeen', artistName: 'SEVENTEEN', title: 'SEVENTEEN TOUR', viewCount: 10500, status: 'open', profileImage: profileSVT },
  { id: 'evt-ive-show-2026', artistId: 'ive', artistName: 'IVE', title: 'IVE Concert 2026', viewCount: 8900, status: 'upcoming', profileImage: profileIVE },
  { id: 'evt-newjeans-fanmeet-2026', artistId: 'newjeans', artistName: 'NewJeans', title: 'NewJeans Fan Meeting', viewCount: 7200, status: 'upcoming', profileImage: profileNJ },
  { id: 'evt-day6-world-2026', artistId: 'day6', artistName: 'DAY6', title: 'DAY6 World Tour', viewCount: 6800, status: 'open', profileImage: profileDay6 },
  { id: 'evt-blackpink-world-2026', artistId: 'blackpink', artistName: 'BLACKPINK', title: 'BLACKPINK BORN PINK', viewCount: 6100, status: 'upcoming', profileImage: profileBP },
  { id: 'evt-brunomars-2026', artistId: 'brunomars', artistName: 'Bruno Mars', title: 'Bruno Mars Live in Seoul', viewCount: 5400, status: 'upcoming', profileImage: profileBrunoMars },
]

// --- 선예매 오픈 임박 (Pre-sale Opening Soon) ---
export interface PreSaleEvent {
  id: string
  artistId: string
  title: string
  openDateTime: string // e.g. "03.05(목) 20:00"
  ticketType: string   // e.g. "일반예매", "선예매"
  tags: string[]       // e.g. ["HOT", "단독판매"]
  venue?: string
  poster?: string
}

export const homePreSaleEvents: PreSaleEvent[] = [
  {
    id: 'evt-skz-domtour-2026',
    artistId: 'skz',
    title: 'Stray Kids DOMINANCE WORLD TOUR',
    openDateTime: '03.11(수) 20:00',
    ticketType: '일반예매',
    tags: ['HOT'],
    venue: '고척스카이돔',
    poster: presaleSKZ,
  },
  {
    id: 'evt-gidle-world-2026',
    artistId: 'gidle',
    title: "(G)I-DLE WORLD TOUR 'iDOL'",
    openDateTime: '03.06(금) 14:00',
    ticketType: '선예매',
    tags: ['HOT', '좌석우위'],
    poster: presaleGIDLE,
  },
  {
    id: 'evt-seventeen-tour-2026',
    artistId: 'seventeen',
    title: 'SEVENTEEN FOLLOW AGAIN TOUR',
    openDateTime: '03.06(금) 17:00',
    ticketType: '일반예매',
    tags: ['좌석우위'],
    poster: presaleSVT,
  },
  {
    id: 'evt-txt-act-2026',
    artistId: 'txt',
    title: 'TXT WORLD TOUR ACT : PROMISE',
    openDateTime: '내일 20:00',
    ticketType: '일반예매',
    tags: ['HOT', '단독판매'],
    poster: presaleTXT,
  },
  {
    id: 'evt-newjeans-fanmeet-2026',
    artistId: 'newjeans',
    title: "NewJeans Fan Meeting 'Bunnies Camp'",
    openDateTime: '03.09(월) 14:00',
    ticketType: '일반예매',
    tags: ['HOT'],
    poster: presaleNJ,
  },
  {
    id: 'evt-ive-show-2026',
    artistId: 'ive',
    title: 'IVE THE 1ST WORLD TOUR',
    openDateTime: '03.03(화) 20:00',
    ticketType: '일반예매',
    tags: ['단독판매'],
    poster: presaleIVE,
  },
]

// --- 추천 아티스트 (Featured Artists — square images) ---
export interface FeaturedArtist {
  id: string
  name: string
  image: string
  followerCount: number
  category: 'group' | 'solo' | 'new'
}

export const featuredArtists: FeaturedArtist[] = [
  { id: 'akmu', name: '악동뮤지션', image: featAkmu, followerCount: 1420000, category: 'group' },
  { id: 'kwon', name: '권정렬', image: featKwon, followerCount: 1420000, category: 'solo' },
  { id: 'riize', name: 'RIIZE', image: featRiize, followerCount: 1420000, category: 'new' },
  { id: 'iu', name: 'IU', image: featIU, followerCount: 7800000, category: 'solo' },
  { id: 'aespa-feat', name: 'aespa', image: featAespa, followerCount: 5500000, category: 'group' },
  { id: 'nmixx-feat', name: 'NMIXX', image: featNMIXX, followerCount: 2800000, category: 'group' },
  { id: 'txt-feat', name: 'TXT', image: featTXT, followerCount: 4300000, category: 'group' },
  { id: 'tours-feat', name: '투어스', image: featTours, followerCount: 1200000, category: 'new' },
  { id: 'newjeans-feat', name: 'NewJeans', image: avatarNJ, followerCount: 6100000, category: 'new' },
  { id: 'straykids-feat', name: 'Stray Kids', image: avatarSKZ, followerCount: 5800000, category: 'group' },
  { id: 'seventeen-feat', name: 'SEVENTEEN', image: avatarSVT, followerCount: 5200000, category: 'group' },
  { id: 'gidle-feat', name: '(G)I-DLE', image: avatarGIDLE, followerCount: 3900000, category: 'group' },
]

// --- 주목할 만한 NEW 아티스트 ---
export interface NewArtistCard {
  id: string
  name: string
  profileImage: string
  label: string
  title: string
  description: string
}

export const newArtistCards: NewArtistCard[] = [
  {
    id: 'riize',
    name: 'RIIZE',
    profileImage: newArtistRiize,
    label: '신인상 수상',
    title: 'RIIZE, 데뷔와 동시에 음원차트 올킬',
    description: 'SM의 새로운 보이그룹 RIIZE가 데뷔 앨범으로 주요 음원차트를 석권하며 신인상을 수상했습니다.',
  },
  {
    id: 'akmu',
    name: '악동뮤지션',
    profileImage: newArtistAkmu,
    label: '컴백 확정',
    title: '악동뮤지션, 2년 만의 정규앨범 컴백',
    description: '악동뮤지션이 2년 만에 정규앨범으로 돌아옵니다. 타이틀곡 선공개가 예정되어 있습니다.',
  },
  {
    id: 'kwon',
    name: '권정렬',
    profileImage: newArtistKwon,
    label: '단독 콘서트',
    title: '권정렬, 첫 단독 콘서트 개최 확정',
    description: '10CM 권정렬이 첫 단독 콘서트를 개최합니다. 전석 매진이 예상되는 뜨거운 관심입니다.',
  },
]
