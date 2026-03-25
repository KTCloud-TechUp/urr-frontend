/** KSPO DOME SVG 좌표계 (viewBox 895×698) 기준 구역 바운딩박스 */
export type SectionBBox = { x: number; y: number; w: number; h: number };

export const SECTION_BBOXES: Record<string, SectionBBox> = {
  "sec-vip":     { x: 240, y: 130, w: 420, h: 290 },
  "sec-floor-r": { x: 330, y: 480, w: 240, h: 110 },
  "sec-r":       { x: 200, y: 420, w: 500, h: 150 },
  "sec-s":       { x: 120, y: 115, w: 660, h: 335 },
  "sec-a":       { x:   0, y:  75, w: 895, h: 625 },
  // Individual zones
  VIP1: { x: 230, y: 167, w: 175, h: 185 },
  VIP2: { x: 346, y: 320, w: 199, h: 100 },
  VIP3: { x: 486, y: 167, w: 172, h: 187 },
  S1:   { x: 132, y: 119, w:  80, h:  78 },
  S2:   { x: 125, y: 192, w:  70, h:  69 },
  S3:   { x: 125, y: 266, w:  76, h:  72 },
  S4:   { x: 140, y: 326, w:  84, h:  85 },
  S5:   { x: 665, y: 327, w:  84, h:  82 },
  S6:   { x: 689, y: 266, w:  76, h:  72 },
  S7:   { x: 694, y: 192, w:  72, h:  70 },
  S8:   { x: 678, y: 118, w:  82, h:  79 },
  R1:   { x: 206, y: 418, w:  90, h:  90 },
  R2:   { x: 265, y: 459, w:  83, h:  87 },
  R3:   { x: 333, y: 487, w:  75, h:  81 },
  R4:   { x: 410, y: 499, w:  69, h:  70 },
  R5:   { x: 482, y: 486, w:  74, h:  80 },
  R6:   { x: 541, y: 458, w:  83, h:  88 },
  R7:   { x: 595, y: 419, w:  88, h:  87 },
  A1:   { x:   9, y:  76, w: 124, h:  99 },
  A2:   { x:   0, y: 162, w: 116, h:  82 },
  A3:   { x:   0, y: 249, w: 115, h:  81 },
  A4:   { x:   9, y: 316, w: 124, h:  99 },
  A5:   { x:  36, y: 381, w: 125, h: 110 },
  A6:   { x:  78, y: 441, w: 125, h: 121 },
  A7:   { x: 132, y: 491, w: 122, h: 128 },
  A8:   { x: 201, y: 533, w: 112, h: 128 },
  A9:   { x: 279, y: 565, w:  98, h: 124 },
  A10:  { x: 363, y: 582, w:  80, h: 115 },
  A11:  { x: 449, y: 581, w:  81, h: 117 },
  A12:  { x: 516, y: 563, w:  98, h: 126 },
  A13:  { x: 581, y: 534, w: 110, h: 127 },
  A14:  { x: 638, y: 491, w: 120, h: 128 },
  A15:  { x: 689, y: 439, w: 126, h: 122 },
  A16:  { x: 730, y: 380, w: 128, h: 111 },
  A17:  { x: 761, y: 317, w: 123, h:  97 },
  A18:  { x: 779, y: 248, w: 115, h:  82 },
  A19:  { x: 777, y: 161, w: 116, h:  83 },
  A20:  { x: 759, y:  76, w: 124, h: 100 },
};

/** KSPO DOME SVG 원본 크기 */
export const VENUE_VIEWBOX = { w: 895, h: 698 } as const;

/** KSPODOME-grape.svg 크기 및 원본 대비 스케일 */
export const GRAPE_VIEWBOX = { w: 6181, h: 4820 } as const;
export const GRAPE_SCALE = GRAPE_VIEWBOX.w / VENUE_VIEWBOX.w; // ≈ 6.907

/** grape SVG 좌표계 기준 구역 바운딩박스 */
export const GRAPE_SECTION_BBOXES: Record<string, SectionBBox> = Object.fromEntries(
  Object.entries(SECTION_BBOXES).map(([id, b]) => [
    id,
    {
      x: b.x * GRAPE_SCALE,
      y: b.y * GRAPE_SCALE,
      w: b.w * GRAPE_SCALE,
      h: b.h * GRAPE_SCALE,
    },
  ]),
);
