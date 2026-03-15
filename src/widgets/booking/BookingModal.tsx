"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useQueueSimulation } from "@/features/booking/model/useQueueSimulation";
import { useNavigationBlock } from "@/features/booking/model/useNavigationBlock";
import { VenueMap } from "@/features/booking/ui/VenueMap";
import { QueueLeaveModal } from "./QueueLeaveModal";

const SECTION_LABEL_POS: Record<string, { x: number; y: number }> = {
  "sec-vip": { x: 447, y: 250 },
  "sec-floor-r": { x: 447, y: 520 },
  "sec-r": { x: 280, y: 490 },
  "sec-s": { x: 200, y: 300 },
  "sec-a": { x: 130, y: 450 },
};

function QueueContent() {
  const { sectionsForDate, transitionTo, resetBooking } = useBooking();
  const { position, totalInQueue, estimatedWait, probability, phase, previousPosition, stayInQueue } =
    useQueueSimulation(sectionsForDate);
  const { showPrompt, cancelLeave, confirmLeave } = useNavigationBlock(phase === "waiting");

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
      setIsRolling(true);
      const timeout = setTimeout(() => setIsRolling(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [previousPosition, position]);

  useEffect(() => {
    if (phase !== "promoted") return;
    transitionTo("seats-section");
  }, [phase, transitionTo]);

  const handleLeaveQueue = useCallback(() => {
    confirmLeave();
    resetBooking();
  }, [confirmLeave, resetBooking]);

  const probColor =
    probability >= 60 ? "text-green-600" : probability >= 20 ? "text-amber-500" : "text-red-500";

  const progressPercent = Math.max(0, 100 - (position / totalInQueue) * 100);

  const sectionPercentages = sectionsForDate.map((sec) => {
    const drained = Math.min(sec.remainingSeats, drainOffset * Math.ceil(sec.totalSeats / 200));
    const remaining = Math.max(0, sec.remainingSeats - drained);
    const pct = sec.totalSeats > 0 ? Math.round((remaining / sec.totalSeats) * 100) : 0;
    return { id: sec.id, name: sec.name, pct, remaining };
  });

  const percentageOverlay = (
    <g style={{ pointerEvents: "none" }} className="select-none">
      <rect x="0" y="0" width="895" height="698" fill="white" fillOpacity={0.55} />
      <defs>
        <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>
      {sectionPercentages.map(({ id, pct }) => {
        const pos = SECTION_LABEL_POS[id];
        if (!pos) return null;
        const color = pct === 0 ? "#9CA3AF" : pct > 30 ? "#16A34A" : pct > 10 ? "#EA580C" : "#DC2626";
        return (
          <g key={id} filter="url(#badge-shadow)">
            <rect x={pos.x - 32} y={pos.y - 16} width={64} height={32} rx={16} fill="white" />
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
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">대기열</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={cn("text-4xl font-bold text-primary tabular-nums", isRolling && "animate-pulse")}>
            #{position}
          </span>
          <span className="text-sm text-muted-foreground">/ {totalInQueue.toLocaleString()}명</span>
        </div>
      </div>

      <div className="px-6 py-3 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            예상 대기: {estimatedWait}
          </span>
          <span className="text-muted-foreground">
            성공 확률: <span className={cn("font-bold tabular-nums", probColor)}>{probability}%</span>
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="px-6 flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex justify-center mb-2 shrink-0">
          <div className="px-4 py-1 rounded-full bg-secondary text-white text-[10px] font-bold tracking-widest">
            STAGE
          </div>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <VenueMap miniature seatOverlay={percentageOverlay} className="w-full h-full max-h-[380px]" />
        </div>
        <div className="py-3 space-y-1.5 shrink-0">
          {sectionPercentages.map(({ id, name, pct, remaining }) => (
            <div key={id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      pct === 0 ? "#9CA3AF" : pct > 30 ? "#22C55E" : pct > 10 ? "#F97316" : "#EF4444",
                  }}
                />
                <span className="font-medium">{name}</span>
              </div>
              <span className={cn("tabular-nums", pct === 0 ? "text-muted-foreground" : "text-foreground font-semibold")}>
                {pct === 0 ? "매진" : `${remaining.toLocaleString()}석 (${pct}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5 pt-2 border-t border-border">
        {phase === "sold-out" ? (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              현재 잔여 좌석이 없습니다. 취소표가 나올 수 있으니 대기를 유지해보세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="sm" onClick={handleLeaveQueue}>나가기</Button>
              <Button size="sm" onClick={stayInQueue}>대기 유지</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => { if (phase === "waiting") handleLeaveQueue(); }}
          >
            대기열 나가기
          </Button>
        )}
      </div>

      {showPrompt && <QueueLeaveModal onStay={cancelLeave} onLeave={handleLeaveQueue} />}
    </>
  );
}

export function BookingModal() {
  const { resetBooking } = useBooking();

  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col",
          "max-w-[680px] max-h-[85vh]",
        )}>
          <button
            onClick={resetBooking}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="닫기"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
          <QueueContent />
        </div>
      </div>
    </div>
  );
}
