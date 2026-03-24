"use client";

import { useEffect, useRef } from "react";
import type { Seat } from "@/shared/types";

/**
 * seats-individual 상태에서 타인이 좌석을 잠그는 상황을 시뮬레이션합니다.
 * 15~30초마다 1~3개의 available 좌석을 locked로 전환합니다.
 * 내가 선택한 좌석(selectedSeatIds)은 잠금 대상에서 제외됩니다.
 */
export function useSeatLockSimulation(
  isRunning: boolean,
  selectedSeatIds: string[],
  onLockSeats: (updater: (prev: Seat[]) => Seat[]) => void,
) {
  const selectedSeatIdsRef = useRef(selectedSeatIds);

  useEffect(() => {
    selectedSeatIdsRef.current = selectedSeatIds;
  }, [selectedSeatIds]);

  useEffect(() => {
    if (!isRunning) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNextLock() {
      const delay = (Math.random() * 15 + 15) * 1000;
      timeoutId = setTimeout(() => {
        onLockSeats((prev) => {
          const selectedSet = new Set(selectedSeatIdsRef.current);
          const available = prev
            .map((s, i) => ({ s, i }))
            .filter(({ s }) => s.status === "available" && !selectedSet.has(s.id));

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
  }, [isRunning, onLockSeats]);
}
