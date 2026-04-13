"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, Clock, RefreshCw, WifiOff, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useQueue } from "@/features/booking/model/useQueue";
import { useNavigationBlock } from "@/features/booking/model/useNavigationBlock";
import { VenueMap } from "@/features/booking/ui/VenueMap";
import { QueueLeaveModal } from "./QueueLeaveModal";

const SECTION_LABEL_POS: Record<string, { x: number; y: number }> = {
  "sec-vip":     { x: 447, y: 250 },
  "sec-floor-r": { x: 447, y: 520 },
  "sec-r":       { x: 280, y: 490 },
  "sec-s":       { x: 200, y: 300 },
  "sec-a":       { x: 130, y: 450 },
};

/** Maps individual zone IDs → the group key used in SECTION_LABEL_POS */
const ZONE_TO_GROUP: Record<string, string> = {
  VIP1: "sec-vip", VIP2: "sec-vip", VIP3: "sec-vip",
  S1: "sec-s", S2: "sec-s", S3: "sec-s", S4: "sec-s",
  S5: "sec-s", S6: "sec-s", S7: "sec-s", S8: "sec-s",
  R1: "sec-r", R2: "sec-r", R3: "sec-r", R4: "sec-r", R5: "sec-r", R6: "sec-r", R7: "sec-r",
  A1:  "sec-a", A2:  "sec-a", A3:  "sec-a", A4:  "sec-a", A5:  "sec-a",
  A6:  "sec-a", A7:  "sec-a", A8:  "sec-a", A9:  "sec-a", A10: "sec-a",
  A11: "sec-a", A12: "sec-a", A13: "sec-a", A14: "sec-a", A15: "sec-a",
  A16: "sec-a", A17: "sec-a", A18: "sec-a", A19: "sec-a", A20: "sec-a",
};

const GROUP_NAMES: Record<string, string> = {
  "sec-vip": "VIP석", "sec-floor-r": "플로어R", "sec-r": "R석", "sec-s": "S석", "sec-a": "A석",
};

function QueueContent({ onQueuePassed }: { onQueuePassed?: (token: string | null) => void }) {
  const { eventId, selectedDateId, sectionsForDate, transitionTo, resetBooking, setQueueToken } = useBooking();

  const showId = selectedDateId ?? eventId;

  const {
    position,
    totalInQueue,
    estimatedWait,
    probability,
    phase,
    previousPosition,
    stayInQueue,
    error: queueError,
    retryEntry,
  } = useQueue(eventId, showId, sectionsForDate, (token, _remainMs) => {
    setQueueToken(token);
    if (onQueuePassed) {
      onQueuePassed(token);
    } else {
      transitionTo("seats-section");
    }
  });
  const { showPrompt, cancelLeave, confirmLeave } = useNavigationBlock(
    phase === "waiting",
  );

  const [drainOffset, setDrainOffset] = useState(0);

  useEffect(() => {
    if (phase !== "waiting") return;
    const interval = setInterval(() => {
      setDrainOffset((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 10_000);
    return () => clearInterval(interval);
  }, [phase]);

  const [isRolling, setIsRolling] = useState(false);
  useEffect(() => {
    if (previousPosition !== null && previousPosition !== position) {
      const t1 = setTimeout(() => setIsRolling(true), 0);
      const t2 = setTimeout(() => setIsRolling(false), 500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [previousPosition, position]);

  const handleLeaveQueue = useCallback(() => {
    confirmLeave();
    resetBooking();
  }, [confirmLeave, resetBooking]);

  const probColor =
    probability >= 60
      ? "text-green-600"
      : probability >= 20
        ? "text-amber-500"
        : "text-red-500";

  const progressPercent = Math.max(0, 100 - (position / totalInQueue) * 100);

  // Aggregate individual zones (VIP1-3, S1-8, R1-7, A1-20) into 5 display groups
  const groupAcc = new Map<string, { remaining: number; total: number }>();
  for (const sec of sectionsForDate) {
    const groupId = ZONE_TO_GROUP[sec.id] ?? sec.id;
    const prev = groupAcc.get(groupId) ?? { remaining: 0, total: 0 };
    const drained = Math.min(sec.remainingSeats, drainOffset * Math.ceil(sec.totalSeats / 200));
    groupAcc.set(groupId, {
      remaining: prev.remaining + Math.max(0, sec.remainingSeats - drained),
      total: prev.total + sec.totalSeats,
    });
  }
  const sectionPercentages = Array.from(groupAcc.entries()).map(([id, { remaining, total }]) => ({
    id,
    name: GROUP_NAMES[id] ?? id,
    pct: total > 0 ? Math.round((remaining / total) * 100) : 0,
    remaining,
  }));

  const percentageOverlay = (
    <g style={{ pointerEvents: "none" }} className="select-none">
      <rect
        x="0"
        y="0"
        width="895"
        height="698"
        fill="white"
        fillOpacity={0.55}
      />
      <defs>
        <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.12"
          />
        </filter>
      </defs>
      {sectionPercentages.map(({ id, pct }) => {
        const pos = SECTION_LABEL_POS[id];
        if (!pos) return null;
        const color =
          pct === 0
            ? "#9CA3AF"
            : pct > 30
              ? "#16A34A"
              : pct > 10
                ? "#EA580C"
                : "#DC2626";
        return (
          <g key={id} filter="url(#badge-shadow)">
            <rect
              x={pos.x - 32}
              y={pos.y - 16}
              width={64}
              height={32}
              rx={16}
              fill="white"
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize="17"
              fontWeight="800"
            >
              {pct === 0 ? "매진" : `${pct}%`}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <>
      <div className="px-6 pt-6 pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          대기열
        </p>

        {queueError === "entry-failed" ? (
          <div className="mt-3 flex flex-col items-center gap-3 py-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">대기열 진입에 실패했습니다</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              네트워크 연결을 확인하고 다시 시도해 주세요.
            </p>
            <button
              onClick={retryEntry}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={14} />
              다시 시도
            </button>
          </div>
        ) : (
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={cn(
                "text-4xl font-bold text-primary tabular-nums",
                isRolling && "animate-pulse",
              )}
            >
              #{position}
            </span>
            <span className="text-sm text-muted-foreground">
              / {totalInQueue.toLocaleString()}명
            </span>
          </div>
        )}
      </div>

      <div className="px-6 py-3 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            예상 대기: {estimatedWait}
          </span>
          <span className="text-muted-foreground">
            성공 확률:{" "}
            <span className={cn("font-bold tabular-nums", probColor)}>
              {probability}%
            </span>
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {queueError === "poll-failed" && (
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <span className="flex items-center gap-1.5 text-amber-700 text-xs font-medium">
              <WifiOff size={13} />
              연결이 불안정합니다. 순서 업데이트가 중단됐어요.
            </span>
            <button
              onClick={retryEntry}
              className="shrink-0 flex items-center gap-1 text-xs text-amber-700 font-semibold hover:text-amber-900 transition-colors"
            >
              <RefreshCw size={12} />
              재연결
            </button>
          </div>
        )}
      </div>

      <div className="px-6 flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex justify-center mb-2 shrink-0">
          <div className="px-4 py-1 rounded-full bg-secondary text-white text-[10px] font-bold tracking-widest">
            STAGE
          </div>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <VenueMap
            miniature
            seatOverlay={percentageOverlay}
            className="w-full h-full max-h-95"
          />
        </div>
        <div className="py-3 space-y-1.5 shrink-0">
          {sectionPercentages.map(({ id, name, pct, remaining }) => (
            <div key={id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      pct === 0
                        ? "#9CA3AF"
                        : pct > 30
                          ? "#22C55E"
                          : pct > 10
                            ? "#F97316"
                            : "#EF4444",
                  }}
                />
                <span className="font-medium">{name}</span>
              </div>
              <span
                className={cn(
                  "tabular-nums",
                  pct === 0
                    ? "text-muted-foreground"
                    : "text-foreground font-semibold",
                )}
              >
                {pct === 0
                  ? "매진"
                  : `${remaining.toLocaleString()}석 (${pct}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5 pt-2 border-t border-border">
        {phase === "sold-out" ? (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              현재 잔여 좌석이 없습니다. 취소표가 나올 수 있으니 대기를
              유지해보세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="sm" onClick={handleLeaveQueue}>
                나가기
              </Button>
              <Button size="sm" onClick={stayInQueue}>
                대기 유지
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => {
              if (phase === "waiting") handleLeaveQueue();
            }}
          >
            대기열 나가기
          </Button>
        )}
      </div>

      {showPrompt && (
        <QueueLeaveModal onStay={cancelLeave} onLeave={handleLeaveQueue} />
      )}
    </>
  );
}

interface BookingModalProps {
  onQueuePassed?: (token: string | null) => void;
  onClose?: () => void;
}

export function BookingModal({ onQueuePassed, onClose }: BookingModalProps = {}) {
  const { resetBooking } = useBooking();

  const handleClose = () => {
    resetBooking();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col",
            "max-w-170 max-h-[85vh]",
          )}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="닫기"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
          <QueueContent onQueuePassed={onQueuePassed} />
        </div>
      </div>
    </div>
  );
}
