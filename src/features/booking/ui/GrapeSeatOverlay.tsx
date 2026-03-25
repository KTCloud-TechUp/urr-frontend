"use client";

import { memo, useMemo } from "react";
import { GRAPE_SEATS, GRAPE_SCALE_X, GRAPE_SCALE_Y } from "@/shared/lib/grapeSeats";
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

// Scale the 16-unit icon to be visibly sized when zoomed into a section
const ICON_SCALE = 1.2 / GRAPE_SCALE_X;

interface GrapeSeatOverlayProps {
  sectionId: string;
  seats: Seat[];
  selectedSeatIds: string[];
  onSeatClick: (seatId: string) => void;
}

function GrapeSeatOverlayInner({
  sectionId,
  seats,
  selectedSeatIds,
  onSeatClick,
}: GrapeSeatOverlayProps) {
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);
  const positions = GRAPE_SEATS[sectionId];
  if (!positions) return null;

  return (
    <g>
      {seats.map((seat, i) => {
        const pos = positions[i];
        if (!pos) return null;
        const [px, py, angle] = pos;
        const vx = px / GRAPE_SCALE_X;
        const vy = py / GRAPE_SCALE_Y;

        const isSelected = selectedSet.has(seat.id);
        const color = isSelected
          ? COLORS.selected
          : seat.status === "available"
            ? COLORS.enabled
            : COLORS.disabled;
        const clickable = seat.status === "available" || isSelected;

        return (
          <g
            key={seat.id}
            transform={`translate(${vx} ${vy}) rotate(${angle}) scale(${ICON_SCALE}) translate(-4 0)`}
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

export const GrapeSeatOverlay = memo(GrapeSeatOverlayInner);
