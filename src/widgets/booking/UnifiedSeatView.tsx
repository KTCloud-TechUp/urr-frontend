"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useSeatTimer } from "@/features/booking/model/useSeatTimer";
import {
  generateSeatsForSection,
  getSectionLayout,
} from "@/shared/lib/mocks/seats";
import { VenueMap, SECTION_BBOXES } from "@/features/booking/ui/VenueMap";
import { SeatOverlay } from "@/features/booking/ui/SeatOverlay";
import { BookingSidePanel } from "./BookingSidePanel";
import { TimerExpiryModal } from "./TimerExpiryModal";
import type { Seat } from "@/shared/types";

function formatCompactDate(isoDate: string): string {
  const d = new Date(isoDate);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function UnifiedSeatView() {
  const {
    bookingState,
    event,
    selectedDateId,
    selectDate,
    sectionsForDate,
    selectedSectionId,
    selectedSeatIds,
    selectedDate,
    userTier,
    maxSeats,
    selectSection,
    toggleSeat,
    transitionTo,
    resetBooking,
    setLeftPanel,
    seatTimerSecondsLeft,
    setSeatTimerSecondsLeft,
  } = useBooking();

  const timer = useSeatTimer(seatTimerSecondsLeft ?? 180);
  const selectedSeatIdsRef = useRef(selectedSeatIds);

  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Auto-collapse left panel on mount
  useEffect(() => {
    setLeftPanel(false);
  }, [setLeftPanel]);

  // Keep ref in sync for lock simulation
  useEffect(() => {
    selectedSeatIdsRef.current = selectedSeatIds;
  }, [selectedSeatIds]);

  const isInSeatMode = bookingState === "seats-individual";

  // Current section data
  const section = useMemo(
    () => sectionsForDate.find((s) => s.id === selectedSectionId) ?? null,
    [sectionsForDate, selectedSectionId],
  );

  const layout = useMemo(() => {
    if (!selectedSectionId) return { rows: 0, seatsPerRow: 0 };
    return getSectionLayout(selectedSectionId);
  }, [selectedSectionId]);

  // Seats
  const initialSeats = useMemo(() => {
    if (!section) return [];
    return generateSeatsForSection(section, userTier);
  }, [section, userTier]);

  const [seats, setSeats] = useState<Seat[]>(initialSeats);

  useEffect(() => {
    setSeats(initialSeats);
  }, [initialSeats]);

  // Start timer when entering seat mode
  useEffect(() => {
    if (isInSeatMode) {
      timer.start();
    }
    return () => timer.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInSeatMode]);

  // Watch for timer expiry
  useEffect(() => {
    if (timer.isExpired && !showExpiryModal) {
      setShowExpiryModal(true);
    }
  }, [timer.isExpired, showExpiryModal]);

  // Lock simulation: every 15-30s, randomly lock 1-3 available seats
  useEffect(() => {
    if (!timer.isRunning) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNextLock() {
      const delay = (Math.random() * 15 + 15) * 1000;
      timeoutId = setTimeout(() => {
        setSeats((prev) => {
          const selectedSet = new Set(selectedSeatIdsRef.current);
          const available = prev
            .map((s, i) => ({ s, i }))
            .filter(
              ({ s }) => s.status === "available" && !selectedSet.has(s.id),
            );
          if (available.length === 0) return prev;
          const lockCount = Math.min(
            available.length,
            Math.floor(Math.random() * 3) + 1,
          );
          const toLock = new Set<number>();
          while (toLock.size < lockCount) {
            toLock.add(
              available[Math.floor(Math.random() * available.length)].i,
            );
          }
          return prev.map((s, i) =>
            toLock.has(i) ? { ...s, status: "locked" as const } : s,
          );
        });
        scheduleNextLock();
      }, delay);
    }

    scheduleNextLock();
    return () => clearTimeout(timeoutId);
  }, [timer.isRunning]);

  // === Handlers ===

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      selectSection(sectionId);
      transitionTo("seats-individual");
    },
    [selectSection, transitionTo],
  );

  const handleBack = useCallback(() => {
    transitionTo("seats-section");
  }, [transitionTo]);

  const handleSeatClick = useCallback(
    (seatId: string) => {
      toggleSeat(seatId);
    },
    [toggleSeat],
  );

  const handlePay = useCallback(() => {
    setSeatTimerSecondsLeft(timer.secondsLeft);
    timer.pause();
    transitionTo("payment");
  }, [timer, transitionTo, setSeatTimerSecondsLeft]);

  const handleReturnToSections = useCallback(() => {
    setShowExpiryModal(false);
    transitionTo("seats-section");
  }, [transitionTo]);

  const handleExitBooking = useCallback(() => {
    setShowExpiryModal(false);
    resetBooking();
  }, [resetBooking]);

  // Compute standalone seat view bbox
  const bbox = selectedSectionId ? SECTION_BBOXES[selectedSectionId] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          {isInSeatMode && (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label="구역 선택으로 돌아가기"
            >
              <ArrowLeft size={18} className="text-muted-foreground" />
            </button>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold">
              {isInSeatMode && section
                ? `${section.name} — 좌석 선택`
                : "구역 선택"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isInSeatMode
                ? `최대 ${maxSeats}석까지 선택 가능`
                : "원하는 구역을 클릭하세요"}
            </p>
          </div>
        </div>
      </div>

      {/* Main: Map/Seats + Side Panel */}
      <div className="flex-1 min-h-0 flex">
        {/* Center area */}
        <div className="flex-1 min-w-0 relative overflow-hidden">
          {/* Date dropdown — floating top-right */}
          <div className="absolute top-3 right-3 z-30 pointer-events-auto">
            <select
              value={selectedDateId ?? ""}
              onChange={(e) => selectDate(e.target.value)}
              className="h-9 px-3 pr-8 rounded-lg border border-border bg-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              style={{ WebkitAppearance: "menulist", appearance: "menulist" }}
            >
              {event?.dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatCompactDate(d.date)}
                </option>
              ))}
            </select>
          </div>

          {/* Section Map view — when NO section selected */}
          {!isInSeatMode && (
            <>
              {/* Stage label at top */}
              <div className="flex justify-center pt-4 pb-2 shrink-0 relative z-10">
                <div className="px-5 py-1.5 rounded-full bg-secondary text-white text-[11px] font-bold tracking-widest">
                  STAGE
                </div>
              </div>

              {/* Map container */}
              <div className="w-full h-[calc(100%-48px)] flex items-center justify-center">
                <div className="w-full h-full p-4">
                  <VenueMap
                    interactive
                    selectedSectionId={selectedSectionId}
                    onSectionClick={handleSectionClick}
                    onSectionHover={setHoveredSection}
                  />
                </div>
              </div>

              {/* Hovered section info tooltip at bottom */}
              {hoveredSection && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-foreground/90 text-white text-xs font-medium backdrop-blur-sm pointer-events-none">
                  {(() => {
                    const sec = sectionsForDate.find(
                      (s) => s.id === hoveredSection,
                    );
                    if (!sec) return hoveredSection;
                    return `${sec.name} — 잔여 ${sec.remainingSeats.toLocaleString()}석`;
                  })()}
                </div>
              )}
            </>
          )}

          {/* Standalone Seat Grid — when section IS selected */}
          {isInSeatMode && selectedSectionId && bbox && seats.length > 0 && (
            <>
              {/* Section name label */}
              <div className="flex justify-center pt-4 pb-2 shrink-0 relative z-10">
                <div className="px-5 py-1.5 rounded-full bg-muted text-foreground text-sm font-semibold">
                  {section?.name ?? "FLOOR"}
                </div>
              </div>

              {/* Seat grid */}
              <div className="w-full h-[calc(100%-96px)] flex items-center justify-center px-6 py-2">
                <svg
                  viewBox={`${bbox.x - 8} ${bbox.y - 8} ${bbox.w + 16} ${bbox.h + 16}`}
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <SeatOverlay
                    seats={seats}
                    rows={layout.rows}
                    seatsPerRow={layout.seatsPerRow}
                    bbox={bbox}
                    selectedSeatIds={selectedSeatIds}
                    onSeatClick={handleSeatClick}
                  />
                </svg>
              </div>
            </>
          )}
        </div>

        {/* Right: Side Panel */}
        <BookingSidePanel
          sectionsForDate={sectionsForDate}
          selectedSectionId={selectedSectionId}
          onSectionClick={handleSectionClick}
          selectedSeatIds={selectedSeatIds}
          maxSeats={maxSeats}
          onRemoveSeat={toggleSeat}
          section={section}
          selectedDate={selectedDate ?? null}
          userTier={userTier}
          timerSeconds={timer.secondsLeft}
          onPay={handlePay}
        />
      </div>

      {/* Timer expiry modal */}
      {showExpiryModal && (
        <TimerExpiryModal
          onReturnToSections={handleReturnToSections}
          onExitBooking={handleExitBooking}
        />
      )}
    </div>
  );
}
