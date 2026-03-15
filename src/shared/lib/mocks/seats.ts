import type { Section, Seat, SeatStatus, TierLevel } from "@/shared/types";

const SECTION_LAYOUT: Record<string, { rows: number; seatsPerRow: number }> = {
  "sec-vip": { rows: 40, seatsPerRow: 50 },
  "sec-floor-r": { rows: 36, seatsPerRow: 50 },
  "sec-r": { rows: 50, seatsPerRow: 70 },
  "sec-s": { rows: 50, seatsPerRow: 90 },
  "sec-a": { rows: 40, seatsPerRow: 75 },
};

export const MAX_SEATS_PER_TIER: Record<TierLevel, number> = {
  lightning: 4,
  thunder: 4,
  cloud: 2,
  mist: 2,
};

const TIER_EXTRA_TAKEN_RATIO: Record<TierLevel, number> = {
  lightning: 0,
  thunder: 0.05,
  cloud: 0.12,
  mist: 0.18,
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash;
}

function rowLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index);
  return String.fromCharCode(65 + Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26));
}

export function getSectionLayout(sectionId: string) {
  return SECTION_LAYOUT[sectionId] ?? { rows: 10, seatsPerRow: 20 };
}

export function generateSeatsForSection(section: Section, userTier: TierLevel): Seat[] {
  const layout = SECTION_LAYOUT[section.id];
  if (!layout) return [];

  const { rows, seatsPerRow } = layout;
  const totalSeats = rows * seatsPerRow;
  const rand = seededRandom(hashString(section.id));

  const baseTaken = section.totalSeats - section.remainingSeats;
  const extraTaken = Math.round(section.totalSeats * TIER_EXTRA_TAKEN_RATIO[userTier]);
  const totalTaken = Math.min(totalSeats, baseTaken + extraTaken);

  const indices = Array.from({ length: totalSeats }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const takenSet = new Set(indices.slice(0, totalTaken));

  const seats: Seat[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < seatsPerRow; c++) {
      const flatIndex = r * seatsPerRow + c;
      const status: SeatStatus = takenSet.has(flatIndex) ? "taken" : "available";
      seats.push({
        id: `${section.id}-${rowLabel(r)}-${c + 1}`,
        sectionId: section.id,
        row: rowLabel(r),
        number: String(c + 1),
        status,
      });
    }
  }

  return seats;
}

export function generateAllSeats(sections: Section[], userTier: TierLevel): Seat[] {
  return sections.flatMap((section) => generateSeatsForSection(section, userTier));
}
