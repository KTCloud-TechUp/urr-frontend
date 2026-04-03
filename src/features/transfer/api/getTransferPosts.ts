import { apiRequest } from "@/shared/api/client";
import type { TransferListing, TransferStatus, TierLevel, Event } from "@/shared/types";

export type EnrichedTransfer = TransferListing & { event: Event };

interface TransferPostItem {
  id: number;
  artistId: number;
  showId: number;
  showName: string;
  showDate: string;
  section: string;
  rowInfo: string;
  faceValue: number;
  sellingPrice: number;
  sellerTier: string;
  status: string;
  createdAt: string;
}

interface TransferPostsApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: {
    content: TransferPostItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

const VALID_TIERS: TierLevel[] = ["LIGHTNING", "THUNDER", "CLOUD", "MIST"];

function toTierLevel(raw: string): TierLevel {
  const upper = raw.toUpperCase() as TierLevel;
  return VALID_TIERS.includes(upper) ? upper : "MIST";
}

function toTransferStatus(raw: string): TransferStatus {
  return raw.toLowerCase() as TransferStatus;
}

function mapToEnrichedTransfer(item: TransferPostItem): EnrichedTransfer {
  return {
    id: String(item.id),
    ticketId: "",
    eventId: String(item.showId),
    sellerId: "",
    sellerTier: toTierLevel(item.sellerTier),
    sellerTransactionCount: 0,
    price: item.sellingPrice,
    faceValue: item.faceValue,
    section: item.section,
    seatInfo: item.rowInfo ?? "",
    status: toTransferStatus(item.status),
    createdAt: item.createdAt,
    event: {
      id: String(item.showId),
      artistId: String(item.artistId),
      title: item.showName,
      venue: "",
      dates: [
        {
          id: String(item.showId),
          date: item.showDate,
          bookingWindows: [],
          totalSeats: 0,
          remainingSeats: 0,
        },
      ],
      poster: "",
      status: "open",
    },
  };
}

export async function getTransferPosts(
  artistId: string | number,
  userId?: number | string,
): Promise<EnrichedTransfer[]> {
  const headers: Record<string, string> = {};
  if (userId !== undefined) {
    headers["X-User-Id"] = String(userId);
  }

  const res = await apiRequest<TransferPostsApiResponse>(
    `/transfers/posts?artistId=${artistId}&size=50`,
    { headers },
  );

  return res.data.data.content.map(mapToEnrichedTransfer);
}
