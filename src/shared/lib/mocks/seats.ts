import type { Section, Seat, SeatStatus, TierLevel } from "@/shared/types";

// URR KSPO DOME STYLE V2 venue template 기준
// seatmap_json의 sections[] 에서 tier+zoneNo별 rowEnd-rowStart+1, colEnd-colStart+1 값
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
  LIGHTNING: 4,
  THUNDER: 4,
  CLOUD: 2,
  MIST: 2,
};

const TIER_EXTRA_TAKEN_RATIO: Record<TierLevel, number> = {
  LIGHTNING: 0,
  THUNDER: 0.05,
  CLOUD: 0.12,
  MIST: 0.18,
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

// sectionId (e.g. "VIP1", "R3", "A10") → { tier, zoneNo }
// 백엔드 seatId 형식: {tier}-{zoneNo}-{row}-{number} (예: VIP-1-3-1)
function parseSectionId(sectionId: string): { tier: string; zoneNo: number } {
  const match = sectionId.match(/^([A-Z]+)(\d+)$/);
  if (match) return { tier: match[1], zoneNo: Number(match[2]) };
  return { tier: sectionId, zoneNo: 1 };
}

export function getSectionLayout(sectionId: string) {
  return SECTION_LAYOUT[sectionId] ?? { rows: 10, seatsPerRow: 20 };
}

export function generateSeatsForSection(section: Section, userTier: TierLevel): Seat[] {
  const layout = getSectionLayout(section.id);
  const { rows, seatsPerRow } = layout;
  const totalSeats = rows * seatsPerRow;
  const rand = seededRandom(hashString(section.id));
  const { tier, zoneNo } = parseSectionId(section.id);

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
      const row = String(r + 1);
      const number = String(c + 1);
      seats.push({
        // 백엔드 ShowService seatId 형식: {tier}-{zoneNo}-{row}-{number}
        id: `${tier}-${zoneNo}-${row}-${number}`,
        sectionId: section.id,
        row,
        number,
        status,
      });
    }
  }

  return seats;
}

export function generateAllSeats(sections: Section[], userTier: TierLevel): Seat[] {
  return sections.flatMap((section) => generateSeatsForSection(section, userTier));
}
