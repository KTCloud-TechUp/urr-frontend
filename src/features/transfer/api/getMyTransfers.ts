import { apiRequest } from "@/shared/api/client";
import type { TransferStatus, Event } from "@/shared/types";
import type { MyTransferRecord } from "@/shared/lib/mocks/my-page";

// ── API response types ──────────────────────────────────

interface SaleItem {
  id: number;
  showName: string;
  showDate: string;
  section: string;
  rowInfo: string;
  seatNumber: string;
  sellingPrice: number;
  feeAmount: number;
  sellerExpectedAmount: number;
  status: string;
  createdAt: string;
}

interface PurchaseItem {
  id: number;
  showName: string;
  showDate: string;
  section: string;
  rowInfo: string;
  seatNumber: string;
  sellingPrice: number;
  sellerUserId: number;
  status: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T[];
}

// ── Helpers ─────────────────────────────────────────────

function toStatus(raw: string): TransferStatus {
  return raw.toLowerCase() as TransferStatus;
}

function makeEvent(showName: string, showDate: string): Event {
  return {
    id: "",
    artistId: "",
    title: showName,
    venue: "",
    dates: [{ id: "", date: showDate, bookingWindows: [], totalSeats: 0, remainingSeats: 0 }],
    poster: "",
    status: "open",
  };
}

function makeHeaders(userId?: string | number): Record<string, string> {
  return userId !== undefined ? { "X-User-Id": String(userId) } : {};
}

// ── Exported functions ───────────────────────────────────

export async function getMySales(
  userId?: string | number,
): Promise<(MyTransferRecord & { event: Event })[]> {
  const res = await apiRequest<ApiResponse<SaleItem>>("/transfers/me/sales", {
    service: "community",
    headers: makeHeaders(userId),
  });
  return res.data.data.map((item) => ({
    id: String(item.id),
    ticketId: "",
    eventId: "",
    role: "seller" as const,
    counterpartyName: "",
    price: item.sellingPrice,
    faceValue: item.sellingPrice + item.feeAmount,
    platformFee: item.feeAmount,
    section: item.section,
    seatInfo: `${item.rowInfo}열 ${item.seatNumber}번`,
    status: toStatus(item.status),
    createdAt: item.createdAt,
    event: makeEvent(item.showName, item.showDate),
  }));
}

export async function getMyPurchases(
  userId?: string | number,
): Promise<(MyTransferRecord & { event: Event })[]> {
  const res = await apiRequest<ApiResponse<PurchaseItem>>("/transfers/me/purchases", {
    service: "community",
    headers: makeHeaders(userId),
  });
  return res.data.data.map((item) => ({
    id: String(item.id),
    ticketId: "",
    eventId: "",
    role: "buyer" as const,
    counterpartyName: "",
    price: item.sellingPrice,
    faceValue: item.sellingPrice,
    platformFee: 0,
    section: item.section,
    seatInfo: `${item.rowInfo}열 ${item.seatNumber}번`,
    status: toStatus(item.status),
    createdAt: item.updatedAt,
    event: makeEvent(item.showName, item.showDate),
  }));
}
