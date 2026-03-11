import type { Section, Seat, SeatStatus, TierLevel } from '@/types'

// --- Grid layout per section ---
const SECTION_LAYOUT: Record<string, { rows: number; seatsPerRow: number }> = {
  'sec-vip': { rows: 40, seatsPerRow: 50 },
  'sec-floor-r': { rows: 36, seatsPerRow: 50 },
  'sec-r': { rows: 50, seatsPerRow: 70 },
  'sec-s': { rows: 50, seatsPerRow: 90 },
  'sec-a': { rows: 40, seatsPerRow: 75 },
}

// --- Max bookable seats per tier ---
export const MAX_SEATS_PER_TIER: Record<TierLevel, number> = {
  lightning: 4,
  thunder: 4,
  cloud: 2,
  mist: 2,
}

// --- Tier-based additional taken seats (cumulative from higher tiers) ---
const TIER_EXTRA_TAKEN_RATIO: Record<TierLevel, number> = {
  lightning: 0,
  thunder: 0.05,    // 5% additional seats taken by lightning
  cloud: 0.12,  // 12% cumulative (lightning + thunder)
  mist: 0.18,  // 18% cumulative (lightning + thunder + cloud)
}

// Simple seeded pseudo-random for deterministic seat generation
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff
  }
  return hash
}

// Convert row index to label: 0→A, 25→Z, 26→AA, 27→AB, ...
function rowLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index)
  return String.fromCharCode(65 + Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26))
}

export function getSectionLayout(sectionId: string) {
  return SECTION_LAYOUT[sectionId] ?? { rows: 10, seatsPerRow: 20 }
}

/**
 * Generate individual seats for a section, taking user tier into account.
 * Higher tier = fewer seats already taken.
 */
export function generateSeatsForSection(section: Section, userTier: TierLevel): Seat[] {
  const layout = SECTION_LAYOUT[section.id]
  if (!layout) return []

  const { rows, seatsPerRow } = layout
  const totalSeats = rows * seatsPerRow
  const rand = seededRandom(hashString(section.id))

  // Base taken count from section data
  const baseTaken = section.totalSeats - section.remainingSeats
  // Additional taken from higher tiers
  const extraTaken = Math.round(section.totalSeats * TIER_EXTRA_TAKEN_RATIO[userTier])
  const totalTaken = Math.min(totalSeats, baseTaken + extraTaken)

  // Generate shuffled indices for taken seats
  const indices = Array.from({ length: totalSeats }, (_, i) => i)
  // Fisher-Yates shuffle with seeded random
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const takenSet = new Set(indices.slice(0, totalTaken))

  const seats: Seat[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < seatsPerRow; c++) {
      const flatIndex = r * seatsPerRow + c
      const status: SeatStatus = takenSet.has(flatIndex) ? 'taken' : 'available'
      seats.push({
        id: `${section.id}-${rowLabel(r)}-${c + 1}`,
        sectionId: section.id,
        row: rowLabel(r),
        number: String(c + 1),
        status,
      })
    }
  }

  return seats
}

/**
 * Generate all seats across all sections for the queue modal visualization.
 */
export function generateAllSeats(sections: Section[], userTier: TierLevel): Seat[] {
  return sections.flatMap((section) => generateSeatsForSection(section, userTier))
}
