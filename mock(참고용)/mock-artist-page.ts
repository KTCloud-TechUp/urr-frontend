import type { Event, TransferListing, TransferStatus } from '@/types'
import posterGDMAMA from '@/assets/upcoming_gdragon-2026-mama.png'
import posterGDDetox from '@/assets/upcoming_gdragon-detox-world-tour.png'
import posterGDPower from '@/assets/upcoming_gdragon-power-concert-2025.png'
import posterBTSArirang from '@/assets/event_bts-world-tour-arirang.png'
import posterTWS from '@/assets/event_tws-2nd-fanmeeting-2026.png'
import posterSVT from '@/assets/event_seventeen-world-tour.png'
import posterDAY6 from '@/assets/event_day6-10th-anniversary-tour.png'
import posterKwonjina from '@/assets/event_kwonjina-flower-concert.png'
import posterPanic from '@/assets/event_panic-concert.png'
import posterParkHyoshin from '@/assets/event_park-hyoshin-live.png'
import posterSeoulJazz from '@/assets/event_seoul-jazz-festival-2026.png'
import posterAespaSynk from '@/assets/event_aespa-live-synk-parallel.png'
import posterAespaMyworld from '@/assets/event_aespa-world-tour-myworld.png'
import posterAespaHyperline from '@/assets/event_aespa-synk-hyper-line.png'
import posterAespaAexis from '@/assets/event_aespa-synk-aexis-line.png'
import posterAespaMyworldEncore from '@/assets/event_aespa-world-tour-myworld-encore.png'

// --- Extended artist info (agency, debut, genres) ---

export interface ArtistExtendedInfo {
  artistId: string
  debutDate: string
  agency: string
  genres: string[]
  memberCount?: number
}

const artistExtendedInfoMap: Record<string, ArtistExtendedInfo> = {
  gdragon: {
    artistId: 'gdragon',
    debutDate: '2006.08.19',
    agency: 'Galaxy Corporation',
    genres: ['K-POP', 'Hip-Hop', 'R&B'],
  },
  bts: {
    artistId: 'bts',
    debutDate: '2013.06.13',
    agency: 'BIGHIT MUSIC',
    genres: ['K-POP', 'Hip-Hop', 'Pop'],
    memberCount: 7,
  },
  aespa: {
    artistId: 'aespa',
    debutDate: '2020.11.17',
    agency: 'SM Entertainment',
    genres: ['K-POP', 'Hyperpop', 'EDM'],
    memberCount: 4,
  },
  ive: {
    artistId: 'ive',
    debutDate: '2021.12.01',
    agency: 'Starship Entertainment',
    genres: ['K-POP', 'Pop', 'Dance'],
    memberCount: 6,
  },
  blackpink: {
    artistId: 'blackpink',
    debutDate: '2016.08.08',
    agency: 'YG Entertainment',
    genres: ['K-POP', 'Pop', 'EDM'],
    memberCount: 4,
  },
}

export function getArtistExtendedInfo(artistId: string): ArtistExtendedInfo | undefined {
  return artistExtendedInfoMap[artistId]
}

// --- Artist events ---

const artistEventsMap: Record<string, Event[]> = {
  gdragon: [
    {
      id: 'evt-gdragon-2026',
      artistId: 'gdragon',
      title: 'G-Dragon 2026 MAMA DOME TOUR',
      venue: 'KSPO DOME (올림픽체조경기장)',
      dates: [
        { id: 'gd-d1', date: '2026-06-01T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 3200 },
        { id: 'gd-d2', date: '2026-06-02T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 5100 },
      ],
      poster: posterGDMAMA,
      status: 'open',
    },
    {
      id: 'evt-gdragon-solo-2026',
      artistId: 'gdragon',
      title: 'G-Dragon DETOX WORLD TOUR',
      venue: '고척스카이돔',
      dates: [
        { id: 'gd-d3', date: '2026-09-20T19:00:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 20000 },
      ],
      poster: posterGDDetox,
      status: 'upcoming',
    },
    {
      id: 'evt-gdragon-past-2025',
      artistId: 'gdragon',
      title: 'G-Dragon POWER CONCERT 2025',
      venue: '잠실종합운동장 주경기장',
      dates: [
        { id: 'gd-d4', date: '2025-12-25T18:00:00+09:00', bookingWindows: [], totalSeats: 50000, remainingSeats: 0 },
      ],
      poster: posterGDPower,
      status: 'closed',
    },
  ],
  bts: [
    {
      id: 'evt-bts-encore-2026',
      artistId: 'bts',
      title: 'BTS WORLD TOUR ARIRANG',
      venue: '잠실종합운동장 주경기장',
      dates: [
        { id: 'bts-d1', date: '2026-08-01T19:00:00+09:00', bookingWindows: [], totalSeats: 65000, remainingSeats: 12000 },
        { id: 'bts-d2', date: '2026-08-02T19:00:00+09:00', bookingWindows: [], totalSeats: 65000, remainingSeats: 18000 },
      ],
      poster: posterBTSArirang,
      status: 'open',
    },
    {
      id: 'evt-bts-fanmeet-2026',
      artistId: 'bts',
      title: '2026 BTS FAN MEETING: MAGIC SHOP',
      venue: 'KSPO DOME (올림픽체조경기장)',
      dates: [
        { id: 'bts-d3', date: '2026-10-15T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 15000 },
      ],
      poster: posterTWS,
      status: 'upcoming',
    },
    {
      id: 'evt-bts-busan-2026',
      artistId: 'bts',
      title: 'BTS YET TO COME IN BUSAN',
      venue: '부산 아시아드 주경기장',
      dates: [
        { id: 'bts-d4', date: '2026-04-20T17:00:00+09:00', bookingWindows: [], totalSeats: 40000, remainingSeats: 0 },
      ],
      poster: posterSVT,
      status: 'soldout',
    },
    {
      id: 'evt-bts-past-2025',
      artistId: 'bts',
      title: 'BTS PERMISSION TO DANCE ON STAGE',
      venue: '고척스카이돔',
      dates: [
        { id: 'bts-d5', date: '2025-11-10T18:00:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 0 },
      ],
      poster: posterDAY6,
      status: 'closed',
    },
  ],
  aespa: [
    {
      id: 'evt-aespa-synk-2026',
      artistId: 'aespa',
      title: 'aespa LIVE SYNK : PARALLEL',
      venue: 'KSPO DOME (올림픽체조경기장)',
      dates: [
        { id: 'ae-d1', date: '2026-09-20T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 4500 },
      ],
      poster: posterAespaSynk,
      status: 'open',
    },
    {
      id: 'evt-aespa-world-2026',
      artistId: 'aespa',
      title: 'aespa WORLD TOUR : MYWORLD',
      venue: '잠실실내체육관',
      dates: [
        { id: 'ae-d2', date: '2026-11-05T19:00:00+09:00', bookingWindows: [], totalSeats: 10000, remainingSeats: 10000 },
      ],
      poster: posterAespaMyworld,
      status: 'upcoming',
    },
    {
      id: 'evt-aespa-aexis-2026',
      artistId: 'aespa',
      title: 'aespa SYNK : AEXIS LINE',
      venue: '인스파이어 아레나',
      dates: [
        { id: 'ae-d4', date: '2026-12-20T18:00:00+09:00', bookingWindows: [], totalSeats: 12000, remainingSeats: 12000 },
      ],
      poster: posterAespaAexis,
      status: 'upcoming',
    },
    {
      id: 'evt-aespa-myworld-encore-2026',
      artistId: 'aespa',
      title: 'aespa WORLD TOUR : MYWORLD ENCORE',
      venue: 'KSPO DOME (올림픽체조경기장)',
      dates: [
        { id: 'ae-d5', date: '2027-01-15T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 15000 },
      ],
      poster: posterAespaMyworldEncore,
      status: 'upcoming',
    },
    {
      id: 'evt-aespa-past-2025',
      artistId: 'aespa',
      title: 'aespa SYNK : HYPER LINE',
      venue: '고척스카이돔',
      dates: [
        { id: 'ae-d3', date: '2025-10-01T18:00:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 0 },
      ],
      poster: posterAespaHyperline,
      status: 'closed',
    },
  ],
  ive: [
    {
      id: 'evt-ive-show-2026',
      artistId: 'ive',
      title: 'IVE THE 1ST WORLD TOUR: SHOW WHAT I HAVE',
      venue: 'KSPO DOME (올림픽체조경기장)',
      dates: [
        { id: 'ive-d1', date: '2026-07-12T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 15000 },
      ],
      poster: posterKwonjina,
      status: 'upcoming',
    },
    {
      id: 'evt-ive-fanmeet-2026',
      artistId: 'ive',
      title: 'IVE 2nd FAN MEETING: I HAVE',
      venue: '잠실실내체육관',
      dates: [
        { id: 'ive-d2', date: '2026-05-18T17:00:00+09:00', bookingWindows: [], totalSeats: 10000, remainingSeats: 2300 },
      ],
      poster: posterPanic,
      status: 'open',
    },
  ],
  blackpink: [
    {
      id: 'evt-blackpink-world-2026',
      artistId: 'blackpink',
      title: 'BLACKPINK BORN PINK WORLD TOUR FINALE',
      venue: '고척스카이돔',
      dates: [
        { id: 'bp-d1', date: '2026-07-15T18:30:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 1800 },
        { id: 'bp-d2', date: '2026-07-16T18:30:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 3200 },
      ],
      poster: posterParkHyoshin,
      status: 'open',
    },
    {
      id: 'evt-blackpink-concert-2026',
      artistId: 'blackpink',
      title: 'BLACKPINK IN YOUR AREA 2026',
      venue: '잠실종합운동장 주경기장',
      dates: [
        { id: 'bp-d3', date: '2026-12-01T18:00:00+09:00', bookingWindows: [], totalSeats: 65000, remainingSeats: 65000 },
      ],
      poster: posterSeoulJazz,
      status: 'upcoming',
    },
    {
      id: 'evt-blackpink-past-2025',
      artistId: 'blackpink',
      title: 'BLACKPINK THE SHOW 2025',
      venue: '고척스카이돔',
      dates: [
        { id: 'bp-d4', date: '2025-09-20T18:00:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 0 },
      ],
      poster: posterSeoulJazz,
      status: 'soldout',
    },
  ],
}

export function getEventsByArtistId(artistId: string): Event[] {
  return artistEventsMap[artistId] ?? []
}

export function categorizeEvents(events: Event[]): { upcoming: Event[]; past: Event[] } {
  const upcoming: Event[] = []
  const past: Event[] = []
  for (const e of events) {
    if (e.status === 'open' || e.status === 'upcoming') {
      upcoming.push(e)
    } else {
      past.push(e)
    }
  }
  return { upcoming, past }
}

// --- Transfer listings ---

const artistTransfersMap: Record<string, TransferListing[]> = {
  gdragon: [
    { id: 'tf-gd-01', ticketId: 'tk-gd-01', eventId: 'evt-gdragon-2026', sellerId: 'u-101', sellerTier: 'lightning', sellerTransactionCount: 12, price: 198000, faceValue: 165000, section: 'VIP석', seatInfo: 'A구역 3열 15번', status: 'listed', createdAt: '2026-02-28T10:00:00+09:00' },
    { id: 'tf-gd-02', ticketId: 'tk-gd-02', eventId: 'evt-gdragon-2026', sellerId: 'u-102', sellerTier: 'thunder', sellerTransactionCount: 5, price: 150000, faceValue: 165000, section: 'R석', seatInfo: 'B구역 7열 22번', status: 'listed', createdAt: '2026-02-27T15:30:00+09:00' },
    { id: 'tf-gd-03', ticketId: 'tk-gd-03', eventId: 'evt-gdragon-2026', sellerId: 'u-103', sellerTier: 'cloud', sellerTransactionCount: 3, price: 130000, faceValue: 132000, section: 'S석', seatInfo: 'C구역 12열 8번', status: 'listed', createdAt: '2026-02-26T09:20:00+09:00' },
    { id: 'tf-gd-04', ticketId: 'tk-gd-04', eventId: 'evt-gdragon-2026', sellerId: 'u-104', sellerTier: 'lightning', sellerTransactionCount: 28, price: 220000, faceValue: 165000, section: 'VIP석', seatInfo: 'A구역 1열 5번', status: 'listed', createdAt: '2026-02-25T18:45:00+09:00' },
    { id: 'tf-gd-05', ticketId: 'tk-gd-05', eventId: 'evt-gdragon-solo-2026', sellerId: 'u-105', sellerTier: 'thunder', sellerTransactionCount: 8, price: 99000, faceValue: 110000, section: 'A석', seatInfo: 'D구역 5열 30번', status: 'listed', createdAt: '2026-02-24T12:00:00+09:00' },
    { id: 'tf-gd-06', ticketId: 'tk-gd-06', eventId: 'evt-gdragon-solo-2026', sellerId: 'u-106', sellerTier: 'mist', sellerTransactionCount: 1, price: 88000, faceValue: 88000, section: 'B석', seatInfo: 'E구역 10열 18번', status: 'listed', createdAt: '2026-02-23T20:10:00+09:00' },
  ],
  bts: [
    { id: 'tf-bts-01', ticketId: 'tk-bts-01', eventId: 'evt-bts-encore-2026', sellerId: 'u-201', sellerTier: 'lightning', sellerTransactionCount: 15, price: 250000, faceValue: 198000, section: 'VIP석', seatInfo: 'A구역 2열 10번', status: 'listed', createdAt: '2026-03-01T08:00:00+09:00' },
    { id: 'tf-bts-02', ticketId: 'tk-bts-02', eventId: 'evt-bts-encore-2026', sellerId: 'u-202', sellerTier: 'thunder', sellerTransactionCount: 7, price: 180000, faceValue: 165000, section: 'R석', seatInfo: 'B구역 5열 17번', status: 'listed', createdAt: '2026-03-01T09:30:00+09:00' },
    { id: 'tf-bts-03', ticketId: 'tk-bts-03', eventId: 'evt-bts-encore-2026', sellerId: 'u-203', sellerTier: 'cloud', sellerTransactionCount: 2, price: 140000, faceValue: 132000, section: 'S석', seatInfo: 'C구역 8열 25번', status: 'listed', createdAt: '2026-02-28T14:20:00+09:00' },
    { id: 'tf-bts-04', ticketId: 'tk-bts-04', eventId: 'evt-bts-busan-2026', sellerId: 'u-204', sellerTier: 'thunder', sellerTransactionCount: 10, price: 160000, faceValue: 165000, section: 'R석', seatInfo: 'A구역 6열 12번', status: 'listed', createdAt: '2026-02-27T16:00:00+09:00' },
    { id: 'tf-bts-05', ticketId: 'tk-bts-05', eventId: 'evt-bts-encore-2026', sellerId: 'u-205', sellerTier: 'mist', sellerTransactionCount: 0, price: 110000, faceValue: 110000, section: 'A석', seatInfo: 'D구역 15열 3번', status: 'listed', createdAt: '2026-02-26T11:45:00+09:00' },
    { id: 'tf-bts-06', ticketId: 'tk-bts-06', eventId: 'evt-bts-encore-2026', sellerId: 'u-206', sellerTier: 'lightning', sellerTransactionCount: 22, price: 280000, faceValue: 198000, section: 'VIP석', seatInfo: 'A구역 1열 8번', status: 'listed', createdAt: '2026-02-25T07:30:00+09:00' },
    { id: 'tf-bts-07', ticketId: 'tk-bts-07', eventId: 'evt-bts-busan-2026', sellerId: 'u-207', sellerTier: 'cloud', sellerTransactionCount: 4, price: 88000, faceValue: 88000, section: 'B석', seatInfo: 'E구역 20열 11번', status: 'listed', createdAt: '2026-02-24T19:00:00+09:00' },
  ],
  aespa: [
    { id: 'tf-ae-01', ticketId: 'tk-ae-01', eventId: 'evt-aespa-synk-2026', sellerId: 'u-301', sellerTier: 'thunder', sellerTransactionCount: 6, price: 165000, faceValue: 154000, section: 'R석', seatInfo: 'A구역 4열 19번', status: 'listed', createdAt: '2026-02-28T12:00:00+09:00' },
    { id: 'tf-ae-02', ticketId: 'tk-ae-02', eventId: 'evt-aespa-synk-2026', sellerId: 'u-302', sellerTier: 'cloud', sellerTransactionCount: 2, price: 120000, faceValue: 121000, section: 'S석', seatInfo: 'B구역 9열 5번', status: 'listed', createdAt: '2026-02-27T10:15:00+09:00' },
    { id: 'tf-ae-03', ticketId: 'tk-ae-03', eventId: 'evt-aespa-synk-2026', sellerId: 'u-303', sellerTier: 'lightning', sellerTransactionCount: 18, price: 200000, faceValue: 176000, section: 'VIP석', seatInfo: 'A구역 1열 12번', status: 'listed', createdAt: '2026-02-26T08:30:00+09:00' },
    { id: 'tf-ae-04', ticketId: 'tk-ae-04', eventId: 'evt-aespa-synk-2026', sellerId: 'u-304', sellerTier: 'mist', sellerTransactionCount: 1, price: 95000, faceValue: 99000, section: 'A석', seatInfo: 'C구역 7열 22번', status: 'listed', createdAt: '2026-02-25T15:40:00+09:00' },
    { id: 'tf-ae-05', ticketId: 'tk-ae-05', eventId: 'evt-aespa-world-2026', sellerId: 'u-305', sellerTier: 'thunder', sellerTransactionCount: 9, price: 143000, faceValue: 143000, section: 'R석', seatInfo: 'B구역 3열 15번', status: 'listed', createdAt: '2026-02-24T13:20:00+09:00' },
    { id: 'tf-ae-06', ticketId: 'tk-ae-06', eventId: 'evt-aespa-aexis-2026', sellerId: 'u-306', sellerTier: 'cloud', sellerTransactionCount: 4, price: 132000, faceValue: 132000, section: 'S석', seatInfo: 'B구역 6열 10번', status: 'listed', createdAt: '2026-02-23T11:00:00+09:00' },
    { id: 'tf-ae-07', ticketId: 'tk-ae-07', eventId: 'evt-aespa-aexis-2026', sellerId: 'u-307', sellerTier: 'lightning', sellerTransactionCount: 20, price: 185000, faceValue: 176000, section: 'VIP석', seatInfo: 'A구역 2열 8번', status: 'listed', createdAt: '2026-02-22T16:30:00+09:00' },
  ],
  ive: [
    { id: 'tf-ive-01', ticketId: 'tk-ive-01', eventId: 'evt-ive-fanmeet-2026', sellerId: 'u-401', sellerTier: 'cloud', sellerTransactionCount: 3, price: 88000, faceValue: 88000, section: 'R석', seatInfo: 'A구역 6열 8번', status: 'listed', createdAt: '2026-02-28T09:00:00+09:00' },
    { id: 'tf-ive-02', ticketId: 'tk-ive-02', eventId: 'evt-ive-fanmeet-2026', sellerId: 'u-402', sellerTier: 'thunder', sellerTransactionCount: 11, price: 110000, faceValue: 88000, section: 'VIP석', seatInfo: 'A구역 1열 3번', status: 'listed', createdAt: '2026-02-27T17:30:00+09:00' },
    { id: 'tf-ive-03', ticketId: 'tk-ive-03', eventId: 'evt-ive-show-2026', sellerId: 'u-403', sellerTier: 'mist', sellerTransactionCount: 0, price: 75000, faceValue: 77000, section: 'S석', seatInfo: 'B구역 11열 20번', status: 'listed', createdAt: '2026-02-26T14:10:00+09:00' },
    { id: 'tf-ive-04', ticketId: 'tk-ive-04', eventId: 'evt-ive-show-2026', sellerId: 'u-404', sellerTier: 'lightning', sellerTransactionCount: 14, price: 155000, faceValue: 143000, section: 'VIP석', seatInfo: 'A구역 2열 15번', status: 'listed', createdAt: '2026-02-25T11:00:00+09:00' },
    { id: 'tf-ive-05', ticketId: 'tk-ive-05', eventId: 'evt-ive-fanmeet-2026', sellerId: 'u-405', sellerTier: 'cloud', sellerTransactionCount: 5, price: 80000, faceValue: 77000, section: 'A석', seatInfo: 'C구역 8열 12번', status: 'listed', createdAt: '2026-02-24T08:45:00+09:00' },
  ],
  blackpink: [
    { id: 'tf-bp-01', ticketId: 'tk-bp-01', eventId: 'evt-blackpink-world-2026', sellerId: 'u-501', sellerTier: 'lightning', sellerTransactionCount: 20, price: 240000, faceValue: 198000, section: 'VIP석', seatInfo: 'A구역 1열 7번', status: 'listed', createdAt: '2026-03-01T10:00:00+09:00' },
    { id: 'tf-bp-02', ticketId: 'tk-bp-02', eventId: 'evt-blackpink-world-2026', sellerId: 'u-502', sellerTier: 'thunder', sellerTransactionCount: 8, price: 180000, faceValue: 165000, section: 'R석', seatInfo: 'B구역 4열 18번', status: 'listed', createdAt: '2026-02-28T13:45:00+09:00' },
    { id: 'tf-bp-03', ticketId: 'tk-bp-03', eventId: 'evt-blackpink-world-2026', sellerId: 'u-503', sellerTier: 'cloud', sellerTransactionCount: 3, price: 132000, faceValue: 132000, section: 'S석', seatInfo: 'C구역 10열 25번', status: 'listed', createdAt: '2026-02-27T09:20:00+09:00' },
    { id: 'tf-bp-04', ticketId: 'tk-bp-04', eventId: 'evt-blackpink-world-2026', sellerId: 'u-504', sellerTier: 'thunder', sellerTransactionCount: 13, price: 99000, faceValue: 99000, section: 'A석', seatInfo: 'D구역 14열 6번', status: 'listed', createdAt: '2026-02-26T16:30:00+09:00' },
    { id: 'tf-bp-05', ticketId: 'tk-bp-05', eventId: 'evt-blackpink-concert-2026', sellerId: 'u-505', sellerTier: 'mist', sellerTransactionCount: 1, price: 165000, faceValue: 154000, section: 'R석', seatInfo: 'A구역 8열 11번', status: 'listed', createdAt: '2026-02-25T20:00:00+09:00' },
    { id: 'tf-bp-06', ticketId: 'tk-bp-06', eventId: 'evt-blackpink-world-2026', sellerId: 'u-506', sellerTier: 'lightning', sellerTransactionCount: 30, price: 260000, faceValue: 198000, section: 'VIP석', seatInfo: 'A구역 2열 3번', status: 'listed', createdAt: '2026-02-24T07:00:00+09:00' },
  ],
}

// --- Mock seller profiles ---

export interface SellerProfile {
  id: string
  name: string
  avatar: string
  bio: string
}

const sellerProfiles: Record<string, SellerProfile> = {
  'u-101': { id: 'u-101', name: '콘서트매니아', avatar: '', bio: '공연을 사랑하는 다이아몬드 거래자' },
  'u-102': { id: 'u-102', name: '뮤직러버22', avatar: '', bio: '음악이 있는 곳에 항상 함께' },
  'u-103': { id: 'u-103', name: '티켓마스터', avatar: '', bio: '공연 관람 3년차' },
  'u-104': { id: 'u-104', name: '라이브킹', avatar: '', bio: '공연 관람 전문가' },
  'u-105': { id: 'u-105', name: '팬클럽회장', avatar: '', bio: '다양한 아티스트의 팬' },
  'u-106': { id: 'u-106', name: '뉴비팬', avatar: '', bio: '첫 거래 도전!' },
  'u-201': { id: 'u-201', name: '아미포에버', avatar: '', bio: 'BTS 영원히 사랑해' },
  'u-202': { id: 'u-202', name: '보라해ARMY', avatar: '', bio: '보라해 💜' },
  'u-203': { id: 'u-203', name: '방탄소년팬', avatar: '', bio: '아미 2년차' },
  'u-204': { id: 'u-204', name: '콘서트홀릭', avatar: '', bio: '매주 공연 관람' },
  'u-205': { id: 'u-205', name: '첫거래유저', avatar: '', bio: '양도 초보입니다' },
  'u-206': { id: 'u-206', name: 'VIP관람러', avatar: '', bio: 'VIP석 전문 거래자' },
  'u-207': { id: 'u-207', name: '부산아미', avatar: '', bio: '부산 거주 아미' },
  'u-301': { id: 'u-301', name: '마이윈터', avatar: '', bio: 'aespa 팬' },
  'u-302': { id: 'u-302', name: '에스파팬', avatar: '', bio: 'MY 최애' },
  'u-303': { id: 'u-303', name: '카리나러브', avatar: '', bio: '다이아 거래자' },
  'u-304': { id: 'u-304', name: '닝닝팬', avatar: '', bio: '신규 팬' },
  'u-305': { id: 'u-305', name: '지젤팬', avatar: '', bio: '골드 거래자' },
  'u-401': { id: 'u-401', name: '아이브팬', avatar: '', bio: 'IVE 응원' },
  'u-402': { id: 'u-402', name: '원영이최고', avatar: '', bio: '장원영 팬' },
  'u-403': { id: 'u-403', name: '가을사랑해', avatar: '', bio: '신규 유저' },
  'u-404': { id: 'u-404', name: '다이브팬', avatar: '', bio: '다이아 거래자' },
  'u-405': { id: 'u-405', name: '유진이팬', avatar: '', bio: 'DIVE 2년차' },
  'u-501': { id: 'u-501', name: '블링크포에버', avatar: '', bio: 'BLINK 영원히' },
  'u-502': { id: 'u-502', name: '로제팬', avatar: '', bio: '로제 최애' },
  'u-503': { id: 'u-503', name: '지수사랑', avatar: '', bio: '지수 팬' },
  'u-504': { id: 'u-504', name: '리사팬클럽', avatar: '', bio: '리사 골드팬' },
  'u-505': { id: 'u-505', name: '제니팬', avatar: '', bio: '신규 블링크' },
  'u-506': { id: 'u-506', name: '블핑VIP', avatar: '', bio: '최고 신뢰 거래자' },
}

export function getSellerProfile(sellerId: string): SellerProfile {
  return sellerProfiles[sellerId] ?? { id: sellerId, name: '익명 판매자', avatar: '', bio: '' }
}

export function getTransfersByArtistId(artistId: string): TransferListing[] {
  return artistTransfersMap[artistId] ?? []
}

export function updateTransferListingStatus(artistId: string, listingId: string, status: TransferStatus): void {
  const listings = artistTransfersMap[artistId]
  if (!listings) return
  const listing = listings.find((l) => l.id === listingId)
  if (listing) listing.status = status
}

export function addTransferListing(artistId: string, listing: TransferListing): void {
  if (!artistTransfersMap[artistId]) {
    artistTransfersMap[artistId] = []
  }
  artistTransfersMap[artistId].unshift(listing)
}

export function getTransferListingById(
  artistId: string,
  listingId: string,
): (TransferListing & { event: Event }) | undefined {
  return getTransferListingsWithEvent(artistId).find((l) => l.id === listingId)
}

/** Returns transfer listings enriched with their associated event data */
export function getTransferListingsWithEvent(artistId: string): (TransferListing & { event: Event })[] {
  const transfers = getTransfersByArtistId(artistId)
  const events = getEventsByArtistId(artistId)
  const eventMap = new Map(events.map((e) => [e.id, e]))

  return transfers
    .filter((t) => eventMap.has(t.eventId))
    .map((t) => ({ ...t, event: eventMap.get(t.eventId)! }))
}
