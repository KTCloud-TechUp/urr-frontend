/** KSPO DOME SVG 좌표계 (viewBox 895×698) 기준 구역 바운딩박스 */
export type SectionBBox = { x: number; y: number; w: number; h: number };

export const SECTION_BBOXES: Record<string, SectionBBox> = {
  "sec-vip":     { x: 240, y: 130, w: 420, h: 290 },
  "sec-floor-r": { x: 330, y: 480, w: 240, h: 110 },
  "sec-r":       { x: 200, y: 420, w: 500, h: 150 },
  "sec-s":       { x: 120, y: 115, w: 660, h: 335 },
  "sec-a":       { x:   0, y:  75, w: 895, h: 625 },
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
