"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "@/features/booking/model/BookingContext";
import { useSeatTimer } from "@/features/booking/model/useSeatTimer";
import { useSeatLockSimulation } from "@/features/booking/model/useSeatLockSimulation";
import { VenueMap, SECTION_BBOXES } from "@/features/booking/ui/VenueMap";
import { SeatOverlay } from "@/features/booking/ui/SeatOverlay";
import { getSeatsAvailability } from "@/features/booking/api/getSeatsAvailability";
import { BookingSidePanel } from "./BookingSidePanel";
import { TimerExpiryModal } from "./TimerExpiryModal";
import { formatEventDateTime } from "@/shared/lib/format";
import type { Seat, SeatStatus } from "@/shared/types";


export function UnifiedSeatView() {
  const {
    eventId,
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

  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Auto-collapse left panel on mount
  useEffect(() => {
    setLeftPanel(false);
  }, [setLeftPanel]);

  const isInSeatMode = bookingState === "seats-individual";

  // Current section data
  const section = useMemo(
    () => sectionsForDate.find((s) => s.id === selectedSectionId) ?? null,
    [sectionsForDate, selectedSectionId],
  );

  const showId = selectedDateId ? Number(selectedDateId) : null;

  // selectedSectionId ("A1", "S3", "VIP1" 등) → tier + zoneNo 분리
  const sectionTierCode = useMemo(() => {
    if (!selectedSectionId) return null;
    if (selectedSectionId.startsWith("VIP")) return "VIP";
    if (selectedSectionId.startsWith("S")) return "S";
    if (selectedSectionId.startsWith("R")) return "R";
    if (selectedSectionId.startsWith("A")) return "A";
    return selectedSectionId;
  }, [selectedSectionId]);

  const sectionZoneNo = useMemo(() => {
    if (!selectedSectionId) return null;
    const match = selectedSectionId.match(/(\d+)$/);
    return match ? Number(match[1]) : null;
  }, [selectedSectionId]);

  // Fetch real seat availability for the selected section
  const { data: seatsData } = useQuery({
    queryKey: ["seats-availability", eventId, showId, sectionTierCode, sectionZoneNo],
    queryFn: () => getSeatsAvailability(showId!, sectionTierCode!, sectionZoneNo!),
    enabled: isInSeatMode && showId !== null && sectionTierCode !== null && sectionZoneNo !== null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // API가 tier+zoneNo로 필터링된 좌석 목록을 반환하므로 클라이언트 필터링 불필요
  // row 오름차순 → number 오름차순으로 정렬해 SeatOverlay의 index 기반 배치와 일치시킴
  const apiSeats: Seat[] = useMemo(() => {
    if (!seatsData?.length) return [];
    // 행이 숫자("1","2"…) 또는 알파벳("A","B"…) 모두 처리
    const rowToIndex = (r: string): number => {
      const n = Number(r);
      if (!isNaN(n) && r.trim() !== "") return n - 1;
      const s = r.toUpperCase();
      if (s.length === 1) return s.charCodeAt(0) - 65;
      return (s.charCodeAt(0) - 64) * 26 + (s.charCodeAt(1) - 65);
    };
    return [...seatsData]
      .sort((a, b) => {
        const rd = rowToIndex(a.row) - rowToIndex(b.row);
        return rd !== 0 ? rd : Number(a.number) - Number(b.number);
      })
      .map((s) => ({
        id: s.seatId,
        sectionId: s.section,
        row: s.row,
        number: s.number,
        status: (s.status === "AVAILABLE" && s.sellable ? "available" : "taken") as SeatStatus,
      }));
  }, [seatsData]);

  const layout = useMemo(() => {
    if (apiSeats.length === 0) return { rows: 0, seatsPerRow: 0, rowLabels: [] as string[] };
    // row 고유값(순서 유지) → 실제 행 레이블, max(number) → 열 수
    const rowLabels = [...new Set(apiSeats.map((s) => s.row))];
    const seatsPerRow = Math.max(...apiSeats.map((s) => Number(s.number)));
    return { rows: rowLabels.length, seatsPerRow, rowLabels };
  }, [apiSeats]);

  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setSeats(apiSeats);
  }, [apiSeats]);

  // Start timer when entering seat mode, or restart when switching sections
  useEffect(() => {
    if (isInSeatMode) {
      timer.reset();
      timer.start();
    }
    return () => timer.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInSeatMode, selectedSectionId]);

  // Watch for timer expiry
  useEffect(() => {
    if (timer.isExpired && !showExpiryModal) {
      setShowExpiryModal(true);
    }
  }, [timer.isExpired, showExpiryModal]);

  // Lock simulation: 15~30초마다 타인이 좌석을 잠그는 상황 시뮬레이션
  useSeatLockSimulation(timer.isRunning, selectedSeatIds, setSeats);

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
                  {formatEventDateTime(d.date)}
                </option>
              ))}
            </select>
          </div>

          {/* Unified venue map — zooms into selected section */}
          <div className="w-full h-full p-4">
            <VenueMap
              interactive={!isInSeatMode}
              selectedSectionId={selectedSectionId}
              dimNonSelected={isInSeatMode}
              zoomedSectionId={isInSeatMode ? selectedSectionId : null}
              seatOverlay={
                isInSeatMode && selectedSectionId && bbox && seats.length > 0 ? (
                  <SeatOverlay
                    seats={seats}
                    rows={layout.rows}
                    seatsPerRow={layout.seatsPerRow}
                    rowLabels={layout.rowLabels}
                    bbox={bbox}
                    selectedSeatIds={selectedSeatIds}
                    onSeatClick={handleSeatClick}
                  />
                ) : undefined
              }
              onSectionClick={handleSectionClick}
              onSectionHover={!isInSeatMode ? setHoveredSection : undefined}
            />
          </div>

          {/* Hovered section info tooltip at bottom */}
          {!isInSeatMode && hoveredSection && (
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
