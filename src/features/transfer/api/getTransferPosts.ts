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
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
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

export interface ReserveResult {
  postId: number;
  orderId: string;
  paymentId: number;
  sellingPrice: number;
}

export async function reserveTransferPost(
  postId: number | string,
  artistId: number | string,
  userId: number | string,
): Promise<ReserveResult> {
  const res = await apiRequest<{ isSuccess: boolean; data: ReserveResult }>(
    `/transfers/posts/${postId}/reserve?artistId=${artistId}`,
    {
      method: "POST",
      service: "community",
      headers: { "X-User-Id": String(userId) },
    },
  );
  return res.data.data;
}

export async function confirmTransferPost(
  orderId: string,
  paymentKey: string,
  userId: number | string,
): Promise<void> {
  await apiRequest("/transfers/posts/confirm", {
    method: "POST",
    service: "community",
    headers: { "X-User-Id": String(userId) },
    body: { orderId, paymentKey },
  });
}

export async function createTransferPost(
  userId: number | string,
  artistId: number | string,
  eventId: number | string,
  showId: number | string,
  reservationId: string,
): Promise<void> {
  await apiRequest("/transfers/posts", {
    method: "POST",
    service: "community",
    headers: { "X-User-Id": String(userId) },
    body: { artistId: Number(artistId), eventId: Number(eventId), showId: Number(showId), reservationId },
  });
}

export async function updateTransferPost(
  id: number | string,
  userId: number | string,
  sellingPrice: number,
): Promise<void> {
  await apiRequest(`/transfers/posts/${id}`, {
    method: "PATCH",
    service: "community",
    headers: { "X-User-Id": String(userId) },
    body: { sellingPrice },
  });
}

export async function deleteTransferPost(
  id: number | string,
  userId: number | string,
): Promise<void> {
  await apiRequest(`/transfers/posts/${id}`, {
    method: "DELETE",
    service: "community",
    headers: { "X-User-Id": String(userId) },
  });
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
    { service: "community", headers },
  );

  return res.data.data.content.map(mapToEnrichedTransfer);
}
