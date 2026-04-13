"use client";

import { memo, useMemo } from "react";
import type { Seat } from "@/shared/types";

const CHAIR_BODY =
  "M14.023 3.998C15.115 3.998 16 4.884 16 5.976V14.022C16 15.114 15.115 15.999 14.023 15.999H1.976C0.885 15.999 0 15.114 0 14.022V5.976C0 4.884 0.885 3.998 1.976 3.998H3.2V6.822C3.2 7.914 4.085 8.799 5.177 8.799H10.823C11.915 8.799 12.8 7.914 12.8 6.822V3.998H14.023Z";
const CHAIR_BACK_X = 4;
const CHAIR_BACK_Y = 0;
const CHAIR_BACK_W = 7.9999;
const CHAIR_BACK_H = 8.00049;
const CHAIR_BACK_RX = 1.97664;

const COLORS = {
  enabled: "#FF5E32",
  selected: "#1F2792",
  disabled: "#C4BDB5",
};

interface SeatOverlayProps {
  seats: Seat[];
  rows: number;
  seatsPerRow: number;
  /** 실제 행 이름 배열 (예: ["1","2","3"] 또는 ["A","B","C"]) */
  rowLabels?: string[];
  bbox: { x: number; y: number; w: number; h: number };
  selectedSeatIds: string[];
  onSeatClick: (seatId: string) => void;
}

// 백엔드 row는 1-based 숫자 문자열 ("1", "2", ...)
function rowLabel(index: number): string {
  return String(index + 1);
}

function SeatOverlayInner({
  seats,
  rows,
  seatsPerRow,
  rowLabels,
  bbox,
  selectedSeatIds,
  onSeatClick,
}: SeatOverlayProps) {
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  const labelMargin = bbox.w * 0.05;
  const seatAreaX = bbox.x + labelMargin;
  const seatAreaW = bbox.w - labelMargin;
  const cellW = seatAreaW / seatsPerRow;
  const cellH = bbox.h / rows;
  const iconScale = (Math.min(cellW, cellH) * 0.82) / 16;

  // row 레이블 → 행 인덱스 맵 (O(1) 조회)
  const rowIndexMap = useMemo(() => {
    const labels = rowLabels ?? Array.from({ length: rows }, (_, r) => rowLabel(r));
    return new Map(labels.map((label, i) => [label, i]));
  }, [rowLabels, rows]);

  function getColor(seat: Seat): string {
    if (selectedSet.has(seat.id)) return COLORS.selected;
    if (seat.status === "available") return COLORS.enabled;
    return COLORS.disabled;
  }

  function isClickable(seat: Seat): boolean {
    return seat.status === "available" || selectedSet.has(seat.id);
  }

  return (
    <g>
      <rect
        x={bbox.x - 2}
        y={bbox.y - 2}
        width={bbox.w + 4}
        height={bbox.h + 4}
        fill="white"
        fillOpacity={0.93}
        rx={3}
      />

      {Array.from({ length: rows }, (_, r) => (
        <text
          key={`rl-${r}`}
          x={bbox.x + labelMargin * 0.45}
          y={bbox.y + r * cellH + cellH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#9CA3AF"
          fontSize={Math.min(cellH * 0.5, 4)}
          fontFamily="monospace"
          style={{ pointerEvents: "none" }}
        >
          {rowLabels ? (rowLabels[r] ?? rowLabel(r)) : rowLabel(r)}
        </text>
      ))}

      {seats.map((seat) => {
        // seat.row / seat.number 기반으로 실제 위치 계산
        // (인덱스 기반은 행별 좌석 수가 고르지 않을 때 위치 어긋남)
        const rowIdx = rowIndexMap.get(seat.row) ?? 0;
        const col = Math.max(0, Number(seat.number) - 1);
        const cx = seatAreaX + col * cellW + cellW / 2;
        const cy = bbox.y + rowIdx * cellH + cellH / 2;
        const x = cx - iconScale * 8;
        const y = cy - iconScale * 8;
        const color = getColor(seat);
        const clickable = isClickable(seat);

        return (
          <g
            key={seat.id}
            transform={`translate(${x}, ${y}) scale(${iconScale})`}
            onClick={clickable ? () => onSeatClick(seat.id) : undefined}
            style={{ cursor: clickable ? "pointer" : "default" }}
          >
            <rect
              x={CHAIR_BACK_X}
              y={CHAIR_BACK_Y}
              width={CHAIR_BACK_W}
              height={CHAIR_BACK_H}
              rx={CHAIR_BACK_RX}
              fill={color}
            />
            <path d={CHAIR_BODY} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

export const SeatOverlay = memo(SeatOverlayInner);
