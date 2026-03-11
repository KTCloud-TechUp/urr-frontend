import type { BookingStatus } from "@/shared/types";

// 도메인 타입 re-export
export type { BookingStatus, Event } from "@/shared/types";
export { BOOKING_STATUS_LABELS } from "@/shared/types";

// 홈 페이지 배너용 이벤트 타입
export interface BannerEvent {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  venue: string;
  date: string; // ISO
  status: BookingStatus;
  bannerImage?: string;
  gradient?: string;
}

// 지금 뜨는 공연용 타입
export interface TrendingEvent {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  venue: string;
  dateRange: string;
  status: BookingStatus;
  tags?: string[];
  poster?: string;
}

// 인기 공연 랭킹용 타입
export interface RankingEvent {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  viewCount: number;
  status: BookingStatus;
  profileImage?: string;
}

// 선예매 오픈 임박용 타입
export interface PreSaleEvent {
  id: string;
  artistId: string;
  title: string;
  openDateTime: string;
  ticketType: string;
  tags: string[];
  venue?: string;
  poster?: string;
}
