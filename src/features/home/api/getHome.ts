import { apiRequest } from "@/shared/api/client";

export interface HomePopularArtist {
  artistId: number;
  artistName: string;
  profileImageUrl: string | null;
  followerCount: number;
  category: string;
}

export interface HomeRankingEvent {
  rank: number;
  eventId: number;
  eventTitle: string;
  artistId: number;
  artistName: string;
  posterImageUrl: string | null;
  openDate: string;
  endDate: string | null;
}

export interface HomeTrendingEvent {
  eventId: number;
  eventTitle: string;
  artistId: number;
  artistName: string;
  posterImageUrl: string | null;
  venueAddress: string | null;
  openDate: string;
  endDate: string | null;
}

export interface HomePresaleEvent {
  showId: number;
  eventId: number;
  eventTitle: string;
  artistId: number;
  artistName: string;
  saleOpenAt: string;
  venueAddress: string | null;
}

export interface HomeData {
  popularEventRanking: HomeRankingEvent[];
  popularArtists: HomePopularArtist[];
  trendingEvents: HomeTrendingEvent[];
  presaleOpeningSoon: HomePresaleEvent[];
  newArtists: HomePopularArtist[];
}

interface HomeApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: HomeData;
}

export async function getHome(): Promise<HomeData> {
  const res = await apiRequest<HomeApiResponse>("/events/home", {
    service: "events",
  });
  return res.data.data;
}
