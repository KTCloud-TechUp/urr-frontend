import type { Section, Seat, SeatStatus, TierLevel } from "@/shared/types";
import { GRAPE_SEATS } from "@/shared/lib/grapeSeats";

const SECTION_LAYOUT: Record<string, { rows: number; seatsPerRow: number }> = {
  VIP1: { rows: 23, seatsPerRow: 29 }, VIP2: { rows: 23, seatsPerRow: 29 }, VIP3: { rows: 23, seatsPerRow: 29 },
  S1: { rows: 25, seatsPerRow: 22 }, S2: { rows: 25, seatsPerRow: 22 }, S3: { rows: 25, seatsPerRow: 22 }, S4: { rows: 25, seatsPerRow: 22 },
  S5: { rows: 25, seatsPerRow: 22 }, S6: { rows: 25, seatsPerRow: 22 }, S7: { rows: 25, seatsPerRow: 22 }, S8: { rows: 25, seatsPerRow: 22 },
  R1: { rows: 27, seatsPerRow: 28 }, R2: { rows: 27, seatsPerRow: 28 }, R3: { rows: 27, seatsPerRow: 28 }, R4: { rows: 27, seatsPerRow: 28 },
  R5: { rows: 27, seatsPerRow: 28 }, R6: { rows: 27, seatsPerRow: 28 }, R7: { rows: 27, seatsPerRow: 28 },
  A1:  { rows: 10, seatsPerRow: 15 }, A2:  { rows: 10, seatsPerRow: 15 }, A3:  { rows: 10, seatsPerRow: 15 }, A4:  { rows: 10, seatsPerRow: 15 },
  A5:  { rows: 10, seatsPerRow: 15 }, A6:  { rows: 10, seatsPerRow: 15 }, A7:  { rows: 10, seatsPerRow: 15 }, A8:  { rows: 10, seatsPerRow: 15 },
  A9:  { rows: 10, seatsPerRow: 15 }, A10: { rows: 10, seatsPerRow: 15 }, A11: { rows: 10, seatsPerRow: 15 }, A12: { rows: 10, seatsPerRow: 15 },
  A13: { rows: 10, seatsPerRow: 15 }, A14: { rows: 10, seatsPerRow: 15 }, A15: { rows: 10, seatsPerRow: 15 }, A16: { rows: 10, seatsPerRow: 15 },
  A17: { rows: 10, seatsPerRow: 15 }, A18: { rows: 10, seatsPerRow: 15 }, A19: { rows: 10, seatsPerRow: 15 }, A20: { rows: 10, seatsPerRow: 15 },
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
  const layout = getSectionLayout(section.id);
  const { rows, seatsPerRow } = layout;
  const totalSeats = GRAPE_SEATS[section.id]?.length ?? rows * seatsPerRow;
  const rand = seededRandom(hashString(section.id));

  // Use ratio from mock data so availability is correct regardless of totalSeats vs grape count mismatch
  const remainingRatio = section.totalSeats > 0 ? section.remainingSeats / section.totalSeats : 0;
  const grapeRemaining = Math.round(totalSeats * remainingRatio);
  const extraTaken = Math.round(totalSeats * TIER_EXTRA_TAKEN_RATIO[userTier]);
  const totalTaken = Math.min(totalSeats, (totalSeats - grapeRemaining) + extraTaken);

  const indices = Array.from({ length: totalSeats }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const takenSet = new Set(indices.slice(0, totalTaken));

  const seats: Seat[] = [];
  for (let flatIndex = 0; flatIndex < totalSeats; flatIndex++) {
    const r = Math.floor(flatIndex / seatsPerRow);
    const c = flatIndex % seatsPerRow;
    const status: SeatStatus = takenSet.has(flatIndex) ? "taken" : "available";
    seats.push({
      id: `${section.id}-${rowLabel(r)}-${c + 1}`,
      sectionId: section.id,
      row: rowLabel(r),
      number: String(c + 1),
      status,
    });
  }

  return seats;
}

export function generateAllSeats(sections: Section[], userTier: TierLevel): Seat[] {
  return sections.flatMap((section) => generateSeatsForSection(section, userTier));
}
