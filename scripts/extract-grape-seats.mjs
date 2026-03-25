/**
 * KSPO-DOME-grape.svg 에서 구역별 좌석 위치 데이터 추출
 * 실행: node scripts/extract-grape-seats.mjs
 * 출력: src/shared/lib/grapeSeats.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svgPath = join(__dirname, "../public/venue/KSPO-DOME-grape.svg");
const outPath = join(__dirname, "../src/shared/lib/grapeSeats.ts");

const GRAPE_SCALE_X = 6181 / 895;
const GRAPE_SCALE_Y = 4820 / 698;

// 895×698 기준 구역 bbox
const SECTION_BBOXES = {
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

// grape 좌표계로 변환 (패딩 10% 추가해 경계 좌석 누락 방지)
const GRAPE_BBOXES = {};
for (const [id, b] of Object.entries(SECTION_BBOXES)) {
  const padX = b.w * 0.1 * GRAPE_SCALE_X;
  const padY = b.h * 0.1 * GRAPE_SCALE_Y;
  GRAPE_BBOXES[id] = {
    x: b.x * GRAPE_SCALE_X - padX,
    y: b.y * GRAPE_SCALE_Y - padY,
    w: b.w * GRAPE_SCALE_X + 2 * padX,
    h: b.h * GRAPE_SCALE_Y + 2 * padY,
  };
}

function findZone(x, y) {
  for (const [id, b] of Object.entries(GRAPE_BBOXES)) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      return id;
    }
  }
  return null;
}

// SVG 파싱
const content = readFileSync(svgPath, "utf8");
const lines = content.split("\n");

// rect 파싱 — 세 가지 형식:
// 1. <rect x y ... transform="rotate(a x y)" fill="#E1DCD6"/>
// 2. <rect x y ... fill="#E1DCD6"/>  (transform 없음)
// 3. <rect width height ... transform="matrix(-1 0 0 1 tx ty)" fill="#E1DCD6"/>  (수평 반전)
const rectWithRotate =
  /^<rect x="([\d.]+)" y="([\d.]+)" [^/]*transform="rotate\((-?[\d.]+)[^"]*\)" fill="#E1DCD6"\/>/;
const rectNoRotate =
  /^<rect x="([\d.]+)" y="([\d.]+)" [^/]*fill="#E1DCD6"\/>/;
// matrix(-1 0 0 1 tx ty): 수평 반전
const rectMatrixFlip =
  /^<rect [^/]*transform="matrix\(-1 0 0 1 ([\d.]+) ([\d.]+)\)" fill="#E1DCD6"\/>/;
// matrix(a b c d tx ty): 일반 회전 행렬
const rectMatrixFull =
  /^<rect [^/]*transform="matrix\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)\)" fill="#E1DCD6"\/>/;

const RECT_W = 7.9999;

const seatsByZone = {};
let unassigned = 0;

for (let i = 1; i < lines.length; i++) {
  const trimmed = lines[i].trim();

  let rx, ry, angle;
  const mRot = trimmed.match(rectWithRotate);
  if (mRot) {
    rx = parseFloat(mRot[1]);
    ry = parseFloat(mRot[2]);
    angle = parseFloat(mRot[3]);
  } else {
    const mFlat = trimmed.match(rectNoRotate);
    if (mFlat) {
      rx = parseFloat(mFlat[1]);
      ry = parseFloat(mFlat[2]);
      angle = 0;
    } else {
      const mFlip = trimmed.match(rectMatrixFlip);
      if (mFlip) {
        // matrix(-1 0 0 1 tx ty): 수평 반전 — pivot = (tx-RECT_W, ty)
        rx = parseFloat(mFlip[1]) - RECT_W;
        ry = parseFloat(mFlip[2]);
        angle = 0;
      } else {
        const mFull = trimmed.match(rectMatrixFull);
        if (!mFull) continue;
        // matrix(a b c d tx ty): 일반 2D 변환
        const a = parseFloat(mFull[1]);
        const b = parseFloat(mFull[2]);
        rx = parseFloat(mFull[5]);
        ry = parseFloat(mFull[6]);
        // 회전각도: atan2(b, a) → degrees
        angle = Math.atan2(b, a) * (180 / Math.PI);
      }
    }
  }

  // 바로 앞 라인이 seat path인지 확인
  if (!lines[i - 1].includes('fill="#E1DCD6"')) continue;

  const zone = findZone(rx, ry);
  if (zone) {
    if (!seatsByZone[zone]) seatsByZone[zone] = [];
    seatsByZone[zone].push([
      parseFloat(rx.toFixed(3)),
      parseFloat(ry.toFixed(3)),
      parseFloat(angle.toFixed(2)),
    ]);
  } else {
    unassigned++;
  }
}

// 통계 출력
const counts = {};
let total = 0;
for (const [zone, seats] of Object.entries(seatsByZone)) {
  counts[zone] = seats.length;
  total += seats.length;
}
console.log("구역별 좌석 수:", JSON.stringify(counts, null, 2));
console.log(`총 ${total}석 추출, 미배정 ${unassigned}석`);

// TypeScript 파일 생성
const entries = Object.entries(seatsByZone)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([zone, seats]) => {
    const arr = seats.map((s) => `[${s[0]},${s[1]},${s[2]}]`).join(",");
    return `  "${zone}":[${arr}]`;
  })
  .join(",\n");

const ts = `// Auto-generated by scripts/extract-grape-seats.mjs
// KSPO-DOME-grape.svg (6181×4820) 기준 구역별 좌석 위치
// 형식: [pivotX, pivotY, angle] — pivot은 등받이 rect의 좌상단 좌표, angle은 회전각(도)
export const GRAPE_SEATS: Record<string, [number, number, number][]> = {
${entries}
};

export const GRAPE_SCALE_X = ${GRAPE_SCALE_X.toFixed(6)};
export const GRAPE_SCALE_Y = ${GRAPE_SCALE_Y.toFixed(6)};
`;

writeFileSync(outPath, ts, "utf8");
console.log(`\n완료: ${outPath}`);
