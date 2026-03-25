import type { Ticket, Event, TransferStatus } from '@/types'
import posterGDragon from '@/assets/hero_g-dragon.png'
import posterBTS from '@/assets/event_bts-yet-to-come-in-cinema.png'
import posterAespa from '@/assets/hero_aespa.png'

// ── Transfer Record (user perspective) ──────────────────

export interface MyTransferRecord {
  id: string
  ticketId: string
  eventId: string
  role: 'seller' | 'buyer'
  counterpartyName: string
  price: number
  faceValue: number
  platformFee: number
  section: string
  seatInfo: string
  status: TransferStatus
  createdAt: string
}

// ── Events referenced by tickets ────────────────────────

const ticketEvents: Event[] = [
  {
    id: 'evt-gdragon-2026',
    artistId: 'gdragon',
    title: 'G-Dragon 2026 MAMA DOME TOUR',
    venue: 'KSPO DOME (올림픽체조경기장)',
    dates: [{ id: 'gd-d1', date: '2026-06-01T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 4230 }],
    poster: posterGDragon,
    status: 'open',
  },
  {
    id: 'evt-bts-encore-2026',
    artistId: 'bts',
    title: 'BTS YET TO COME ENCORE IN SEOUL',
    venue: '잠실종합운동장 주경기장',
    dates: [{ id: 'bts-d1', date: '2026-08-01T19:00:00+09:00', bookingWindows: [], totalSeats: 65000, remainingSeats: 12000 }],
    poster: posterBTS,
    status: 'open',
  },
  {
    id: 'evt-aespa-synk-2026',
    artistId: 'aespa',
    title: 'aespa LIVE SYNK : PARALLEL',
    venue: 'KSPO DOME (올림픽체조경기장)',
    dates: [{ id: 'ae-d1', date: '2026-09-20T18:00:00+09:00', bookingWindows: [], totalSeats: 15000, remainingSeats: 4500 }],
    poster: posterAespa,
    status: 'open',
  },
  {
    id: 'evt-gdragon-past-2025',
    artistId: 'gdragon',
    title: 'G-Dragon POWER CONCERT 2025',
    venue: '잠실종합운동장 주경기장',
    dates: [{ id: 'gd-past', date: '2025-12-25T18:00:00+09:00', bookingWindows: [], totalSeats: 50000, remainingSeats: 0 }],
    poster: posterGDragon,
    status: 'closed',
  },
  {
    id: 'evt-bts-past-2025',
    artistId: 'bts',
    title: 'BTS WORLD TOUR: LOVE YOURSELF 2025',
    venue: '고척스카이돔',
    dates: [{ id: 'bts-past', date: '2025-11-10T18:00:00+09:00', bookingWindows: [], totalSeats: 20000, remainingSeats: 0 }],
    poster: posterBTS,
    status: 'closed',
  },
]

// ── User's Tickets ──────────────────────────────────────

const myTickets: (Ticket & { event: Event })[] = [
  // Upcoming
  {
    id: 'my-tk-001',
    eventId: 'evt-gdragon-2026',
    section: 'VIP석',
    row: '3',
    seatNumber: '15',
    price: 165000,
    tierFee: 0,
    qrCode: 'URR-TK-GD2026-001',
    isTransferable: true,
    isUpcoming: true,
    event: ticketEvents[0],
  },
  {
    id: 'my-tk-002',
    eventId: 'evt-bts-encore-2026',
    section: 'R석',
    row: '7',
    seatNumber: '22',
    price: 143000,
    tierFee: 3000,
    qrCode: 'URR-TK-BTS2026-002',
    isTransferable: true,
    isUpcoming: true,
    event: ticketEvents[1],
  },
  {
    id: 'my-tk-003',
    eventId: 'evt-aespa-synk-2026',
    section: 'S석',
    row: '12',
    seatNumber: '8',
    price: 121000,
    tierFee: 5000,
    qrCode: 'URR-TK-AE2026-003',
    isTransferable: false,
    isUpcoming: true,
    event: ticketEvents[2],
  },
  // Past
  {
    id: 'my-tk-004',
    eventId: 'evt-gdragon-past-2025',
    section: 'R석',
    row: '5',
    seatNumber: '10',
    price: 143000,
    tierFee: 0,
    qrCode: 'URR-TK-GD2025-004',
    isTransferable: false,
    isUpcoming: false,
    event: ticketEvents[3],
  },
  {
    id: 'my-tk-005',
    eventId: 'evt-bts-past-2025',
    section: 'A석',
    row: '15',
    seatNumber: '3',
    price: 99000,
    tierFee: 5000,
    qrCode: 'URR-TK-BTS2025-005',
    isTransferable: false,
    isUpcoming: false,
    event: ticketEvents[4],
  },
]

// ── Transfer Records ────────────────────────────────────

const myTransferRecords: (MyTransferRecord & { event: Event })[] = [
  {
    id: 'my-tf-001',
    ticketId: 'my-tk-extra-001',
    eventId: 'evt-gdragon-2026',
    role: 'seller',
    counterpartyName: '',
    price: 180000,
    faceValue: 165000,
    platformFee: 9000,
    section: 'R석',
    seatInfo: 'A구역 5열 20번',
    status: 'listed',
    createdAt: '2026-03-01T10:00:00+09:00',
    event: ticketEvents[0],
  },
  {
    id: 'my-tf-002',
    ticketId: 'my-tk-extra-002',
    eventId: 'evt-bts-past-2025',
    role: 'seller',
    counterpartyName: '이팬심',
    price: 110000,
    faceValue: 99000,
    platformFee: 5500,
    section: 'S석',
    seatInfo: 'B구역 8열 14번',
    status: 'completed',
    createdAt: '2025-10-20T14:30:00+09:00',
    event: ticketEvents[4],
  },
  {
    id: 'my-tf-003',
    ticketId: 'my-tk-extra-003',
    eventId: 'evt-aespa-synk-2026',
    role: 'buyer',
    counterpartyName: '박음악',
    price: 135000,
    faceValue: 121000,
    platformFee: 0,
    section: 'R석',
    seatInfo: 'A구역 4열 19번',
    status: 'completed',
    createdAt: '2026-02-15T09:00:00+09:00',
    event: ticketEvents[2],
  },
]

// ── Export helpers ───────────────────────────────────────

export function getMyTickets(): (Ticket & { event: Event })[] {
  return myTickets
}

export function getMyTransferRecords(): (MyTransferRecord & { event: Event })[] {
  return myTransferRecords
}

export function addMyTicket(ticket: Ticket & { event: Event }): void {
  myTickets.unshift(ticket)
}

export function addMyTransferRecord(record: MyTransferRecord & { event: Event }): void {
  myTransferRecords.unshift(record)
}
