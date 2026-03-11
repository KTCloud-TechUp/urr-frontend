import { getArtistById } from './mock-artists'
import { homePopularArtists } from './mock-home'
import { getEventsByArtistId } from './mock-artist-page'
import type { Artist, Event } from '@/types'

export type SearchableEvent = Event & { artistName: string }

export const trendingSearchTerms: string[] = [
  'G-Dragon',
  'BTS',
  'MAMA DOME TOUR',
  'aespa',
  'BLACKPINK',
  '잠실',
  'NewJeans',
  'DETOX',
  'IVE',
  'SEVENTEEN',
]

export function getAllArtists(): Artist[] {
  return homePopularArtists
}

export function getAllEvents(): SearchableEvent[] {
  const coreArtistIds = ['gdragon', 'bts', 'aespa', 'ive', 'blackpink']
  return coreArtistIds.flatMap((id) => {
    const artist = getArtistById(id)
    return getEventsByArtistId(id).map((event) => ({
      ...event,
      artistName: artist?.name ?? id,
    }))
  })
}
