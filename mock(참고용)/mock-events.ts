import type { Event, Section } from '@/types'
import posterGDragon from '@/assets/Hero_G-dragon.png'

export const mockEvent: Event = {
  id: 'evt-gdragon-2026',
  artistId: 'gdragon',
  title: 'G-Dragon 2026 MAMA DOME TOUR',
  venue: 'KSPO DOME (올림픽체조경기장)',
  dates: [
    {
      id: 'date-0601',
      date: '2026-06-01T18:00:00+09:00',
      bookingWindows: [
        { tier: 'lightning', opensAt: '2026-02-20T12:00:00+09:00', fee: 0 },
        { tier: 'thunder', opensAt: '2026-02-20T13:00:00+09:00', fee: 3000 },
        { tier: 'cloud', opensAt: '2026-02-22T12:00:00+09:00', fee: 5000 },
        { tier: 'mist', opensAt: '2026-02-22T13:00:00+09:00', fee: 8000 },
      ],
      totalSeats: 15000,
      remainingSeats: 4230,
    },
    {
      id: 'date-0602',
      date: '2026-06-02T18:00:00+09:00',
      bookingWindows: [
        { tier: 'lightning', opensAt: '2026-02-20T12:00:00+09:00', fee: 0 },
        { tier: 'thunder', opensAt: '2026-02-20T13:00:00+09:00', fee: 3000 },
        { tier: 'cloud', opensAt: '2026-02-22T12:00:00+09:00', fee: 5000 },
        { tier: 'mist', opensAt: '2026-02-22T13:00:00+09:00', fee: 8000 },
      ],
      totalSeats: 15000,
      remainingSeats: 8912,
    },
    {
      id: 'date-0603',
      date: '2026-06-03T17:00:00+09:00',
      bookingWindows: [
        { tier: 'lightning', opensAt: '2026-02-20T12:00:00+09:00', fee: 0 },
        { tier: 'thunder', opensAt: '2026-02-20T13:00:00+09:00', fee: 3000 },
        { tier: 'cloud', opensAt: '2026-02-22T12:00:00+09:00', fee: 5000 },
        { tier: 'mist', opensAt: '2026-02-22T13:00:00+09:00', fee: 8000 },
      ],
      totalSeats: 15000,
      remainingSeats: 14200,
    },
  ],
  poster: posterGDragon,
  status: 'open',
}

const defaultSections: Section[] = [
  { id: 'sec-vip', name: 'VIP', price: 165000, totalSeats: 2000, remainingSeats: 891 },
  { id: 'sec-floor-r', name: '플로어R석', price: 154000, totalSeats: 1800, remainingSeats: 720 },
  { id: 'sec-r', name: 'R석', price: 143000, totalSeats: 3500, remainingSeats: 1560 },
  { id: 'sec-s', name: 'S석', price: 121000, totalSeats: 4500, remainingSeats: 2340 },
  { id: 'sec-a', name: 'A석', price: 99000, totalSeats: 3000, remainingSeats: 1102 },
]

export const sectionsByDate: Record<string, Section[]> = {
  'date-0601': [
    { id: 'sec-vip', name: 'VIP', price: 165000, totalSeats: 2000, remainingSeats: 42 },
    { id: 'sec-floor-r', name: '플로어R석', price: 154000, totalSeats: 1800, remainingSeats: 95 },
    { id: 'sec-r', name: 'R석', price: 143000, totalSeats: 3500, remainingSeats: 291 },
    { id: 'sec-s', name: 'S석', price: 121000, totalSeats: 4500, remainingSeats: 1060 },
    { id: 'sec-a', name: 'A석', price: 99000, totalSeats: 3000, remainingSeats: 802 },
  ],
  'date-0602': defaultSections,
  'date-0603': [
    { id: 'sec-vip', name: 'VIP', price: 165000, totalSeats: 2000, remainingSeats: 1800 },
    { id: 'sec-floor-r', name: '플로어R석', price: 154000, totalSeats: 1800, remainingSeats: 1650 },
    { id: 'sec-r', name: 'R석', price: 143000, totalSeats: 3500, remainingSeats: 3200 },
    { id: 'sec-s', name: 'S석', price: 121000, totalSeats: 4500, remainingSeats: 4100 },
    { id: 'sec-a', name: 'A석', price: 99000, totalSeats: 3000, remainingSeats: 2800 },
  ],
}

export function getEventById(id: string): Event | undefined {
  if (id === mockEvent.id) return mockEvent
  return undefined
}

export function getSectionsForDate(dateId: string): Section[] {
  return sectionsByDate[dateId] ?? defaultSections
}
