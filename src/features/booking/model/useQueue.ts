"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/shared/types";
import { checkQueue, pollQueue } from "../api/queue";
import type { QueuePhase } from "./useQueueSimulation";

export type QueueError = "entry-failed" | "poll-failed" | null;

export interface UseQueueReturn {
  position: number;
  totalInQueue: number;
  estimatedWait: string;
  probability: number;
  phase: QueuePhase;
  previousPosition: number | null;
  stayInQueue: () => void;
  queueToken: string | null;
  error: QueueError;
  retryEntry: () => void;
}

const POLL_INTERVAL_MS = 3_000;
const MAX_ENTRY_AUTO_RETRIES = 3;   // checkQueue 자동 재시도 횟수
const MAX_REENTRY_ATTEMPTS = 5;     // NOT_WAIT 재진입 최대 횟수
const MAX_POLL_FAILURES = 3;        // 연속 폴링 실패 허용 횟수

/**
 * 실제 대기열 API와 연동하는 훅.
 * - 마운트 시 POST /queue/check/{showId}로 대기열 진입
 * - WAIT 상태이면 GET /queue/{showId}를 3초 간격으로 폴링
 * - ACTIVE가 되면 onActive 콜백 호출 (토큰, 잔여 ms 전달)
 * - NOT_WAIT 응답 시 /check 재호출로 자동 재진입 (최대 5회)
 * - 에러 시 error 상태와 retryEntry 반환
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
  const [error, setError] = useState<QueueError>(null);

  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  const activatedRef = useRef(false);
  const entryAutoRetryCountRef = useRef(0);
  const reentryCountRef = useRef(0);
  const consecutivePollFailuresRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      entryAutoRetryCountRef.current = 0;
      setError(null);
      if (data.status === "ACTIVE") {
        handleActive(null, null);
      } else {
        setPosition(data.rank ?? 0);
        setTotalInQueue(data.total ?? 0);
        setWaitTimeSec(data.waitTime ?? null);
        setPollEnabled(true);
      }
    } catch {
      entryAutoRetryCountRef.current += 1;
      if (entryAutoRetryCountRef.current < MAX_ENTRY_AUTO_RETRIES) {
        // 3초 후 자동 재시도
        retryTimerRef.current = setTimeout(() => void enterQueue(), 3_000);
      } else {
        // 자동 재시도 소진 → 사용자에게 수동 재시도 노출
        setError("entry-failed");
      }
    }
  }

  function retryEntry() {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    entryAutoRetryCountRef.current = 0;
    reentryCountRef.current = 0;
    consecutivePollFailuresRef.current = 0;
    setError(null);
    setPollEnabled(false);
    void enterQueue();
  }

  // 마운트 시 대기열 진입
  useEffect(() => {
    void enterQueue();
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  // 상태 폴링 — retry: false로 설정해 연속 실패 횟수를 직접 관리
  const { data: pollData, error: pollError } = useQuery({
    queryKey: ["queue", "poll", showId],
    queryFn: () => pollQueue(showId),
    enabled: pollEnabled && phase === "waiting" && error === null,
    refetchInterval: pollEnabled && phase === "waiting" && error === null ? POLL_INTERVAL_MS : false,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  // 폴링 에러: 연속 N회 실패 시 poll-failed
  useEffect(() => {
    if (!pollError) return;
    consecutivePollFailuresRef.current += 1;
    if (consecutivePollFailuresRef.current >= MAX_POLL_FAILURES) {
      setError("poll-failed");
      setPollEnabled(false);
    }
  }, [pollError]);

  useEffect(() => {
    if (!pollData) return;
    consecutivePollFailuresRef.current = 0; // 성공 시 연속 실패 카운트 초기화

    if (pollData.status === "ACTIVE") {
      handleActive(pollData.token, pollData.remainMs);
    } else if (pollData.status === "NOT_WAIT") {
      reentryCountRef.current += 1;
      if (reentryCountRef.current >= MAX_REENTRY_ATTEMPTS) {
        // 비정상적으로 반복 이탈 → 에러 처리
        setError("entry-failed");
        return;
      }
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
    error,
    retryEntry,
  };
}
