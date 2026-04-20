// === Enums & Literals ===

export type TierLevel = "LIGHTNING" | "THUNDER" | "CLOUD" | "MIST";
export type BookingStatus = "open" | "upcoming" | "soldout" | "closed";
export type TransferStatus = "listed" | "sold" | "completed" | "cancelled";
export type SeatStatus = "available" | "selected" | "taken" | "locked";
export type BookingState =
  | "idle"
  | "queue"
  | "seats-section"
  | "seats-individual"
  | "payment"
  | "confirmation"
  | "payment-failed"
  | "seats-expired";
export type NotificationType =
  | "booking"
  | "transfer"
  | "tier"
  | "payment"
  | "membership";

// === Domain Entities ===

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  followerCount?: number;
  category: "boygroup" | "girlgroup" | "coedgroup" | "solo" | "band";
}

export interface Event {
  id: string;
  artistId: string;
  title: string;
  venue: string;
  dates: EventDate[];
  poster: string;
  status: BookingStatus;
}

export interface EventDate {
  id: string;
  date: string;
  bookingWindows: TierWindow[];
  totalSeats: number;
  remainingSeats: number;
}

export interface TierWindow {
  tier: TierLevel;
  opensAt: string;
  fee: number;
}

export interface Section {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  remainingSeats: number;
}

export interface Seat {
  id: string;
  sectionId: string;
  row: string;
  number: string;
  status: SeatStatus;
}

export interface Ticket {
  id: string;
  eventId: string;
  showId?: string;
  /** 원본 seatId — 예약 취소 API (POST /ticket/reservations/cancel) 호출용 */
  seatId?: string;
  section: string;
  row: string;
  seatNumber: string;
  price: number;
  tierFee: number;
  qrCode: string;
  isTransferable: boolean;
  isUpcoming: boolean;
  refundStatus?: "NONE" | "REQUESTED" | "COMPLETED" | "FAILED";
  cancelledAt?: string | null;
}

export interface TransferListing {
  id: string;
  ticketId: string;
  eventId: string;
  sellerId: string;
  sellerTier: TierLevel;
  sellerTransactionCount: number;
  price: number;
  faceValue: number;
  feeAmount: number;
  sellerExpectedAmount: number;
  section: string;
  zone: string;
  seatInfo: string;
  status: TransferStatus;
  createdAt: string;
}

export interface Membership {
  id: string;
  artistId: string;
  artistName: string;
  tier: TierLevel;
  nickname: string;
  membershipNumber: string;
  joinedAt: string;
  expiresAt: string;
  isActive: boolean;
  orderId?: string;
  /** Tier progress: current points / required points for next tier */
  tierProgress?: { current: number; required: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: TierLevel;
  phoneNumber: string;
  birthDate: string;
  gender: "male" | "female";
  authProvider: "kakao" | "naver" | "email";
  memberships: Membership[];
  followedArtistIds: string[];
}

export interface CommunityPost {
  id: string;
  artistId: string;
  authorName: string;
  authorAvatar: string;
  isOfficial: boolean;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link: string;
}

export interface VQAQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ConfirmationData {
  bookingId: string;
  tickets: {
    seatId: string;
    sectionName: string;
    row: string;
    seatNumber: string;
    price: number;
    tierFee: number;
  }[];
  totalAmount: number;
  bookedAt: string;
  /** /booking/complete 페이지에서 사용 — Toss 리다이렉트 전 sessionStorage에 저장 */
  eventTitle?: string;
  eventVenue?: string;
  showDate?: string;
  userTier?: TierLevel;
}
// === Label Constants ===

export const TIER_LABELS: Record<TierLevel, string> = {
  LIGHTNING: "라이트닝",
  THUNDER: "썬더",
  CLOUD: "클라우드",
  MIST: "미스트",
};

export const TIER_EMOJIS: Record<TierLevel, string> = {
  LIGHTNING: "🌩️",
  THUNDER: "⚡",
  CLOUD: "☁️",
  MIST: "🌫️",
};

export const TIER_IMAGES: Record<TierLevel, string> = {
  LIGHTNING: "/membership/lightning.svg",
  THUNDER: "/membership/thunder.svg",
  CLOUD: "/membership/cloud.svg",
  MIST: "/membership/mist.svg",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  open: "예매 오픈",
  upcoming: "오픈 예정",
  soldout: "매진",
  closed: "종료",
};

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
  listed: "등록 중",
  sold: "판매 완료",
  completed: "양도 완료",
  cancelled: "취소됨",
};

export const SEAT_STATUS_LABELS: Record<SeatStatus, string> = {
  available: "선택 가능",
  selected: "내 선택",
  taken: "판매 완료",
  locked: "타인 점유",
};
