import type { Event, TransferListing } from "@/shared/types";

// --- Extended artist info ---

export interface ArtistExtendedInfo {
  artistId: string;
  debutDate: string;
  agency: string;
  genres: string[];
  memberCount?: number;
}

const artistExtendedInfoMap: Record<string, ArtistExtendedInfo> = {
  gdragon: { artistId: "gdragon", debutDate: "2006.08.19", agency: "Galaxy Corporation", genres: ["K-POP", "Hip-Hop", "R&B"] },
  bts: { artistId: "bts", debutDate: "2013.06.13", agency: "BIGHIT MUSIC", genres: ["K-POP", "Hip-Hop", "Pop"], memberCount: 7 },
  aespa: { artistId: "aespa", debutDate: "2020.11.17", agency: "SM Entertainment", genres: ["K-POP", "Hyperpop", "EDM"], memberCount: 4 },
  ive: { artistId: "ive", debutDate: "2021.12.01", agency: "Starship Entertainment", genres: ["K-POP", "Pop", "Dance"], memberCount: 6 },
  blackpink: { artistId: "blackpink", debutDate: "2016.08.08", agency: "YG Entertainment", genres: ["K-POP", "Pop", "EDM"], memberCount: 4 },
};

export function getArtistExtendedInfo(artistId: string): ArtistExtendedInfo | undefined {
  return artistExtendedInfoMap[artistId];
}

// --- Artist events ---

const artistEventsMap: Record<string, Event[]> = {
  gdragon: [
    { id: "evt-gdragon-2026", artistId: "gdragon", title: "G-Dragon 2026 MAMA DOME TOUR", venue: "KSPO DOME (올림픽체조경기장)", dates: [{ id: "gd-d1", date: "2026-06-01T18:00:00+09:00", bookingWindows: [], totalSeats: 15000, remainingSeats: 3200 }, { id: "gd-d2", date: "2026-06-02T18:00:00+09:00", bookingWindows: [], totalSeats: 15000, remainingSeats: 5100 }], poster: "/Hero_G-dragon.png", status: "open" },
    { id: "evt-gdragon-solo-2026", artistId: "gdragon", title: "G-Dragon DETOX WORLD TOUR", venue: "고척스카이돔", dates: [{ id: "gd-d3", date: "2026-09-20T19:00:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 20000 }], poster: "", status: "upcoming" },
    { id: "evt-gdragon-past-2025", artistId: "gdragon", title: "G-Dragon POWER CONCERT 2025", venue: "잠실종합운동장 주경기장", dates: [{ id: "gd-d4", date: "2025-12-25T18:00:00+09:00", bookingWindows: [], totalSeats: 50000, remainingSeats: 0 }], poster: "", status: "closed" },
  ],
  bts: [
    { id: "evt-bts-encore-2026", artistId: "bts", title: "BTS WORLD TOUR ARIRANG", venue: "잠실종합운동장 주경기장", dates: [{ id: "bts-d1", date: "2026-08-01T19:00:00+09:00", bookingWindows: [], totalSeats: 65000, remainingSeats: 12000 }, { id: "bts-d2", date: "2026-08-02T19:00:00+09:00", bookingWindows: [], totalSeats: 65000, remainingSeats: 18000 }], poster: "/공연_BTS Yet to Come in Cinema.png", status: "open" },
    { id: "evt-bts-fanmeet-2026", artistId: "bts", title: "2026 BTS FAN MEETING: MAGIC SHOP", venue: "KSPO DOME (올림픽체조경기장)", dates: [{ id: "bts-d3", date: "2026-10-15T18:00:00+09:00", bookingWindows: [], totalSeats: 15000, remainingSeats: 15000 }], poster: "", status: "upcoming" },
    { id: "evt-bts-busan-2026", artistId: "bts", title: "BTS YET TO COME IN BUSAN", venue: "부산 아시아드 주경기장", dates: [{ id: "bts-d4", date: "2026-04-20T17:00:00+09:00", bookingWindows: [], totalSeats: 40000, remainingSeats: 0 }], poster: "", status: "soldout" },
    { id: "evt-bts-past-2025", artistId: "bts", title: "BTS PERMISSION TO DANCE ON STAGE", venue: "고척스카이돔", dates: [{ id: "bts-d5", date: "2025-11-10T18:00:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 0 }], poster: "", status: "closed" },
  ],
  aespa: [
    { id: "evt-aespa-synk-2026", artistId: "aespa", title: "aespa LIVE SYNK : PARALLEL", venue: "KSPO DOME (올림픽체조경기장)", dates: [{ id: "ae-d1", date: "2026-09-20T18:00:00+09:00", bookingWindows: [], totalSeats: 15000, remainingSeats: 4500 }], poster: "/Hero_aespa.png", status: "open" },
    { id: "evt-aespa-world-2026", artistId: "aespa", title: "aespa WORLD TOUR : MYWORLD", venue: "잠실실내체육관", dates: [{ id: "ae-d2", date: "2026-11-05T19:00:00+09:00", bookingWindows: [], totalSeats: 10000, remainingSeats: 10000 }], poster: "", status: "upcoming" },
    { id: "evt-aespa-aexis-2026", artistId: "aespa", title: "aespa SYNK : AEXIS LINE", venue: "인스파이어 아레나", dates: [{ id: "ae-d4", date: "2026-12-20T18:00:00+09:00", bookingWindows: [], totalSeats: 12000, remainingSeats: 12000 }], poster: "", status: "upcoming" },
    { id: "evt-aespa-past-2025", artistId: "aespa", title: "aespa SYNK : HYPER LINE", venue: "고척스카이돔", dates: [{ id: "ae-d3", date: "2025-10-01T18:00:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 0 }], poster: "", status: "closed" },
  ],
  ive: [
    { id: "evt-ive-show-2026", artistId: "ive", title: "IVE THE 1ST WORLD TOUR: SHOW WHAT I HAVE", venue: "KSPO DOME (올림픽체조경기장)", dates: [{ id: "ive-d1", date: "2026-07-12T18:00:00+09:00", bookingWindows: [], totalSeats: 15000, remainingSeats: 15000 }], poster: "/공연_IVE Show What i am.png", status: "upcoming" },
    { id: "evt-ive-fanmeet-2026", artistId: "ive", title: "IVE 2nd FAN MEETING: I HAVE", venue: "잠실실내체육관", dates: [{ id: "ive-d2", date: "2026-05-18T17:00:00+09:00", bookingWindows: [], totalSeats: 10000, remainingSeats: 2300 }], poster: "", status: "open" },
  ],
  blackpink: [
    { id: "evt-blackpink-world-2026", artistId: "blackpink", title: "BLACKPINK BORN PINK WORLD TOUR FINALE", venue: "고척스카이돔", dates: [{ id: "bp-d1", date: "2026-07-15T18:30:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 1800 }, { id: "bp-d2", date: "2026-07-16T18:30:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 3200 }], poster: "/공연_BlackPink Born Pink.png", status: "open" },
    { id: "evt-blackpink-concert-2026", artistId: "blackpink", title: "BLACKPINK IN YOUR AREA 2026", venue: "잠실종합운동장 주경기장", dates: [{ id: "bp-d3", date: "2026-12-01T18:00:00+09:00", bookingWindows: [], totalSeats: 65000, remainingSeats: 65000 }], poster: "", status: "upcoming" },
    { id: "evt-blackpink-past-2025", artistId: "blackpink", title: "BLACKPINK THE SHOW 2025", venue: "고척스카이돔", dates: [{ id: "bp-d4", date: "2025-09-20T18:00:00+09:00", bookingWindows: [], totalSeats: 20000, remainingSeats: 0 }], poster: "", status: "soldout" },
  ],
};

export function getEventsByArtistId(artistId: string): Event[] {
  return artistEventsMap[artistId] ?? [];
}

export function categorizeEvents(events: Event[]): { upcoming: Event[]; past: Event[] } {
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    if (e.status === "open" || e.status === "upcoming") upcoming.push(e);
    else past.push(e);
  }
  return { upcoming, past };
}

// --- Transfer listings ---

const artistTransfersMap: Record<string, TransferListing[]> = {
  gdragon: [
    { id: "tf-gd-01", ticketId: "tk-gd-01", eventId: "evt-gdragon-2026", sellerId: "u-101", sellerTier: "lightning", sellerTransactionCount: 12, price: 198000, faceValue: 165000, section: "VIP석", seatInfo: "A구역 3열 15번", status: "listed", createdAt: "2026-02-28T10:00:00+09:00" },
    { id: "tf-gd-02", ticketId: "tk-gd-02", eventId: "evt-gdragon-2026", sellerId: "u-102", sellerTier: "thunder", sellerTransactionCount: 5, price: 150000, faceValue: 165000, section: "R석", seatInfo: "B구역 7열 22번", status: "listed", createdAt: "2026-02-27T15:30:00+09:00" },
    { id: "tf-gd-03", ticketId: "tk-gd-03", eventId: "evt-gdragon-2026", sellerId: "u-103", sellerTier: "cloud", sellerTransactionCount: 3, price: 130000, faceValue: 132000, section: "S석", seatInfo: "C구역 12열 8번", status: "listed", createdAt: "2026-02-26T09:20:00+09:00" },
    { id: "tf-gd-04", ticketId: "tk-gd-04", eventId: "evt-gdragon-solo-2026", sellerId: "u-104", sellerTier: "lightning", sellerTransactionCount: 28, price: 220000, faceValue: 165000, section: "VIP석", seatInfo: "A구역 1열 5번", status: "listed", createdAt: "2026-02-25T18:45:00+09:00" },
    { id: "tf-gd-05", ticketId: "tk-gd-05", eventId: "evt-gdragon-solo-2026", sellerId: "u-105", sellerTier: "thunder", sellerTransactionCount: 8, price: 99000, faceValue: 110000, section: "A석", seatInfo: "D구역 5열 30번", status: "listed", createdAt: "2026-02-24T12:00:00+09:00" },
    { id: "tf-gd-06", ticketId: "tk-gd-06", eventId: "evt-gdragon-solo-2026", sellerId: "u-106", sellerTier: "mist", sellerTransactionCount: 1, price: 88000, faceValue: 88000, section: "B석", seatInfo: "E구역 10열 18번", status: "listed", createdAt: "2026-02-23T20:10:00+09:00" },
  ],
  bts: [
    { id: "tf-bts-01", ticketId: "tk-bts-01", eventId: "evt-bts-encore-2026", sellerId: "u-201", sellerTier: "lightning", sellerTransactionCount: 15, price: 250000, faceValue: 198000, section: "VIP석", seatInfo: "A구역 2열 10번", status: "listed", createdAt: "2026-03-01T08:00:00+09:00" },
    { id: "tf-bts-02", ticketId: "tk-bts-02", eventId: "evt-bts-encore-2026", sellerId: "u-202", sellerTier: "thunder", sellerTransactionCount: 7, price: 180000, faceValue: 165000, section: "R석", seatInfo: "B구역 5열 17번", status: "listed", createdAt: "2026-03-01T09:30:00+09:00" },
    { id: "tf-bts-03", ticketId: "tk-bts-03", eventId: "evt-bts-encore-2026", sellerId: "u-203", sellerTier: "cloud", sellerTransactionCount: 2, price: 140000, faceValue: 132000, section: "S석", seatInfo: "C구역 8열 25번", status: "listed", createdAt: "2026-02-28T14:20:00+09:00" },
    { id: "tf-bts-04", ticketId: "tk-bts-04", eventId: "evt-bts-encore-2026", sellerId: "u-204", sellerTier: "thunder", sellerTransactionCount: 10, price: 160000, faceValue: 165000, section: "R석", seatInfo: "A구역 6열 12번", status: "listed", createdAt: "2026-02-27T16:00:00+09:00" },
    { id: "tf-bts-05", ticketId: "tk-bts-05", eventId: "evt-bts-encore-2026", sellerId: "u-205", sellerTier: "mist", sellerTransactionCount: 0, price: 110000, faceValue: 110000, section: "A석", seatInfo: "D구역 15열 3번", status: "listed", createdAt: "2026-02-26T11:45:00+09:00" },
    { id: "tf-bts-06", ticketId: "tk-bts-06", eventId: "evt-bts-encore-2026", sellerId: "u-206", sellerTier: "lightning", sellerTransactionCount: 22, price: 280000, faceValue: 198000, section: "VIP석", seatInfo: "A구역 1열 8번", status: "listed", createdAt: "2026-02-25T07:30:00+09:00" },
  ],
  aespa: [
    { id: "tf-ae-01", ticketId: "tk-ae-01", eventId: "evt-aespa-synk-2026", sellerId: "u-301", sellerTier: "thunder", sellerTransactionCount: 6, price: 165000, faceValue: 154000, section: "R석", seatInfo: "A구역 4열 19번", status: "listed", createdAt: "2026-02-28T12:00:00+09:00" },
    { id: "tf-ae-02", ticketId: "tk-ae-02", eventId: "evt-aespa-synk-2026", sellerId: "u-302", sellerTier: "cloud", sellerTransactionCount: 2, price: 120000, faceValue: 121000, section: "S석", seatInfo: "B구역 9열 5번", status: "listed", createdAt: "2026-02-27T10:15:00+09:00" },
    { id: "tf-ae-03", ticketId: "tk-ae-03", eventId: "evt-aespa-synk-2026", sellerId: "u-303", sellerTier: "lightning", sellerTransactionCount: 18, price: 200000, faceValue: 176000, section: "VIP석", seatInfo: "A구역 1열 12번", status: "listed", createdAt: "2026-02-26T08:30:00+09:00" },
    { id: "tf-ae-04", ticketId: "tk-ae-04", eventId: "evt-aespa-synk-2026", sellerId: "u-304", sellerTier: "mist", sellerTransactionCount: 1, price: 95000, faceValue: 99000, section: "A석", seatInfo: "C구역 7열 22번", status: "listed", createdAt: "2026-02-25T15:40:00+09:00" },
    { id: "tf-ae-05", ticketId: "tk-ae-05", eventId: "evt-aespa-world-2026", sellerId: "u-305", sellerTier: "thunder", sellerTransactionCount: 9, price: 143000, faceValue: 143000, section: "R석", seatInfo: "B구역 3열 15번", status: "listed", createdAt: "2026-02-24T13:20:00+09:00" },
  ],
  ive: [
    { id: "tf-ive-01", ticketId: "tk-ive-01", eventId: "evt-ive-fanmeet-2026", sellerId: "u-401", sellerTier: "cloud", sellerTransactionCount: 3, price: 88000, faceValue: 88000, section: "R석", seatInfo: "A구역 6열 8번", status: "listed", createdAt: "2026-02-28T09:00:00+09:00" },
    { id: "tf-ive-02", ticketId: "tk-ive-02", eventId: "evt-ive-fanmeet-2026", sellerId: "u-402", sellerTier: "thunder", sellerTransactionCount: 11, price: 110000, faceValue: 88000, section: "VIP석", seatInfo: "A구역 1열 3번", status: "listed", createdAt: "2026-02-27T17:30:00+09:00" },
    { id: "tf-ive-03", ticketId: "tk-ive-03", eventId: "evt-ive-show-2026", sellerId: "u-403", sellerTier: "mist", sellerTransactionCount: 0, price: 75000, faceValue: 77000, section: "S석", seatInfo: "B구역 11열 20번", status: "listed", createdAt: "2026-02-26T14:10:00+09:00" },
  ],
  blackpink: [
    { id: "tf-bp-01", ticketId: "tk-bp-01", eventId: "evt-blackpink-world-2026", sellerId: "u-501", sellerTier: "lightning", sellerTransactionCount: 20, price: 240000, faceValue: 198000, section: "VIP석", seatInfo: "A구역 1열 7번", status: "listed", createdAt: "2026-03-01T10:00:00+09:00" },
    { id: "tf-bp-02", ticketId: "tk-bp-02", eventId: "evt-blackpink-world-2026", sellerId: "u-502", sellerTier: "thunder", sellerTransactionCount: 8, price: 180000, faceValue: 165000, section: "R석", seatInfo: "B구역 4열 18번", status: "listed", createdAt: "2026-02-28T13:45:00+09:00" },
    { id: "tf-bp-03", ticketId: "tk-bp-03", eventId: "evt-blackpink-world-2026", sellerId: "u-503", sellerTier: "cloud", sellerTransactionCount: 3, price: 132000, faceValue: 132000, section: "S석", seatInfo: "C구역 10열 25번", status: "listed", createdAt: "2026-02-27T09:20:00+09:00" },
    { id: "tf-bp-04", ticketId: "tk-bp-04", eventId: "evt-blackpink-world-2026", sellerId: "u-504", sellerTier: "thunder", sellerTransactionCount: 13, price: 99000, faceValue: 99000, section: "A석", seatInfo: "D구역 14열 6번", status: "listed", createdAt: "2026-02-26T16:30:00+09:00" },
    { id: "tf-bp-05", ticketId: "tk-bp-05", eventId: "evt-blackpink-concert-2026", sellerId: "u-505", sellerTier: "mist", sellerTransactionCount: 1, price: 165000, faceValue: 154000, section: "R석", seatInfo: "A구역 8열 11번", status: "listed", createdAt: "2026-02-25T20:00:00+09:00" },
  ],
};

export function getTransfersByArtistId(artistId: string): TransferListing[] {
  return artistTransfersMap[artistId] ?? [];
}

export function getTransferListingsWithEvent(
  artistId: string,
): (TransferListing & { event: Event })[] {
  const transfers = getTransfersByArtistId(artistId);
  const events = getEventsByArtistId(artistId);
  const eventMap = new Map(events.map((e) => [e.id, e]));
  return transfers
    .filter((t) => eventMap.has(t.eventId))
    .map((t) => ({ ...t, event: eventMap.get(t.eventId)! }));
}
