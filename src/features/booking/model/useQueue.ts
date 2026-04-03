"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/shared/types";
import { checkQueue, pollQueue } from "../api/queue";
import type { QueuePhase } from "./useQueueSimulation";

export interface UseQueueReturn {
  position: number;
  totalInQueue: number;
  estimatedWait: string;
  probability: number;
  phase: QueuePhase;
  previousPosition: number | null;
  stayInQueue: () => void;
  queueToken: string | null;
}

const POLL_INTERVAL_MS = 3_000;

/**
 * 실제 대기열 API와 연동하는 훅.
 * - 마운트 시 POST /queue/check/{showId}로 대기열 진입
 * - WAIT 상태이면 GET /queue/{showId}를 3초 간격으로 폴링
 * - ACTIVE가 되면 onActive 콜백 호출 (토큰, 잔여 ms 전달)
 * - NOT_WAIT 응답 시 /check 재호출로 자동 재진입
 */
export function useQueue(
  showId: string,
  sectionsForDate: Section[],
  onActive: (token: string | null, remainMs: number | null) => void,
): UseQueueReturn {
  const [phase, setPhase] = useState<QueuePhase>("waiting");
  const [position, setPosition] = useState(0);
  const [totalInQueue, setTotalInQueue] = useState(0);
  const [waitTimeSec, setWaitTimeSec] = useState<number | null>(null);
  const [previousPosition, setPreviousPosition] = useState<number | null>(null);
  const [queueToken, setQueueToken] = useState<string | null>(null);
  const [pollEnabled, setPollEnabled] = useState(false);

  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  const activatedRef = useRef(false);

  function handleActive(token: string | null, remainMs: number | null) {
    if (activatedRef.current) return;
    activatedRef.current = true;
    setQueueToken(token);
    setPhase("promoted");
    onActiveRef.current(token, remainMs);
  }

  async function enterQueue() {
    try {
      const data = await checkQueue(showId);
      if (data.status === "ACTIVE") {
        handleActive(null, null);
      } else {
        setPosition(data.rank ?? 0);
        setTotalInQueue(data.total ?? 0);
        setWaitTimeSec(data.waitTime ?? null);
        setPollEnabled(true);
      }
    } catch {
      // 오류 시 폴링은 활성화해 재시도 기회 부여
      setPollEnabled(true);
    }
  }

  // 마운트 시 대기열 진입
  useEffect(() => {
    void enterQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  // 상태 폴링
  const { data: pollData } = useQuery({
    queryKey: ["queue", "poll", showId],
    queryFn: () => pollQueue(showId),
    enabled: pollEnabled && phase === "waiting",
    refetchInterval: pollEnabled && phase === "waiting" ? POLL_INTERVAL_MS : false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!pollData) return;

    if (pollData.status === "ACTIVE") {
      handleActive(pollData.token, pollData.remainMs);
    } else if (pollData.status === "NOT_WAIT") {
      // 대기열에서 빠진 경우 재진입
      setPollEnabled(false);
      void enterQueue();
    } else {
      // WAIT
      setPreviousPosition(position);
      setPosition(pollData.rank ?? position);
      setTotalInQueue(pollData.total ?? totalInQueue);
      setWaitTimeSec(pollData.waitTime ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollData]);

  const totalRemaining = sectionsForDate.reduce((sum, s) => sum + s.remainingSeats, 0);

  const probability =
    totalRemaining > 0 && position > 0
      ? Math.min(100, Math.round((totalRemaining / position) * 100))
      : 0;

  const estimatedWait =
    waitTimeSec !== null
      ? `약 ${Math.max(1, Math.ceil(waitTimeSec / 60))}분`
      : position > 0
        ? `약 ${Math.max(1, Math.ceil(position / 60))}분`
        : "계산 중";

  return {
    position,
    totalInQueue,
    estimatedWait,
    probability,
    phase,
    previousPosition,
    stayInQueue: () => {},
    queueToken,
  };
}
