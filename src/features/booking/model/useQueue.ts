"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Section } from "@/shared/types";
import {
  vwrAssign,
  vwrCheck,
  setEntryTokenCookie,
  checkQueue,
  pollQueue,
} from "../api/queue";
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

const MAX_ENTRY_RETRIES = 3;
const MAX_REENTRY_ATTEMPTS = 5;

/**
 * VWR(Tier1) → Queue(Tier2) 순서로 대기열 처리.
 *
 * 1. VWR assign → 번호표 발급
 * 2. VWR check 폴링 → 순서 표시 → 입장 시 entry-token 발급
 * 3. entry-token 쿠키 저장
 * 4. Queue check → Tier2 진입
 */
export function useQueue(
  eventId: string,
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
  const [error, setError] = useState<QueueError>(null);

  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  const activatedRef = useRef(false);
  const entryRetryRef = useRef(0);
  const reentryCountRef = useRef(0);
  const vwrPollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tier2PollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleActive(token: string | null, remainMs: number | null) {
    if (activatedRef.current) return;
    activatedRef.current = true;
    setQueueToken(token);
    setPhase("promoted");
    onActiveRef.current(token, remainMs);
  }

  // --- Step 1~3: VWR 대기열 ---
  const isLocalDev =
    typeof window !== "undefined" &&
    /^(localhost|127(\.0\.0\.1)?|0\.0\.0\.0)$/.test(window.location.hostname);
  const skipVwr = process.env.NEXT_PUBLIC_SKIP_VWR === "true" || isLocalDev;

  const startVwr = useCallback(async () => {
    // 로컬 개발: VWR Lambda 없으면 Tier2 직접 진입
    if (skipVwr) {
      await enterTier2();
      return;
    }

    try {
      // Step 1: VWR assign
      const assignResult = await vwrAssign(eventId);
      setPosition(assignResult.position);
      setWaitTimeSec(assignResult.estimatedWait);
      setTotalInQueue(assignResult.position);
      entryRetryRef.current = 0;
      setError(null);

      // Step 2: VWR check 폴링
      const pollVwr = async () => {
        try {
          const result = await vwrCheck(eventId, assignResult.requestId);

          if (result.admitted && result.token) {
            // Step 3: entry-token 쿠키 저장 → Tier2 진입
            setEntryTokenCookie(result.token);
            await enterTier2();
          } else {
            // 대기 표시 업데이트
            setPreviousPosition(position);
            setPosition(result.ahead);
            setTotalInQueue(result.totalInQueue);
            setWaitTimeSec(result.estimatedWait ?? null);
            // 적응형 폴링
            const nextPollMs = (result.nextPoll ?? 5) * 1000;
            vwrPollTimerRef.current = setTimeout(pollVwr, nextPollMs);
          }
        } catch {
          // VWR 폴링 실패 → 3초 후 재시도
          vwrPollTimerRef.current = setTimeout(pollVwr, 3000);
        }
      };

      pollVwr();
    } catch {
      entryRetryRef.current += 1;
      if (entryRetryRef.current < MAX_ENTRY_RETRIES) {
        vwrPollTimerRef.current = setTimeout(() => void startVwr(), 3000);
      } else {
        setError("entry-failed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // --- Step 4: Tier2 Queue ---
  async function enterTier2() {
    try {
      const data = await checkQueue(showId);
      if (data.status === "ACTIVE") {
        handleActive(null, null);
      } else {
        setPosition(data.rank ?? 0);
        setTotalInQueue(data.total ?? 0);
        setWaitTimeSec(data.waitTime ?? null);
        // Tier2 폴링
        startTier2Poll();
      }
    } catch {
      // Tier2 진입 실패 → 재시도
      reentryCountRef.current += 1;
      if (reentryCountRef.current < MAX_REENTRY_ATTEMPTS) {
        tier2PollTimerRef.current = setTimeout(() => void enterTier2(), 3000);
      } else {
        setError("entry-failed");
      }
    }
  }

  function startTier2Poll() {
    const poll = async () => {
      try {
        const data = await pollQueue(showId);
        if (data.status === "ACTIVE") {
          handleActive(data.token, data.remainMs);
        } else if (data.status === "NOT_WAIT") {
          reentryCountRef.current += 1;
          if (reentryCountRef.current < MAX_REENTRY_ATTEMPTS) {
            void enterTier2();
          } else {
            setError("entry-failed");
          }
        } else {
          setPreviousPosition(position);
          setPosition(data.rank ?? position);
          setTotalInQueue(data.total ?? totalInQueue);
          setWaitTimeSec(data.waitTime ?? null);
          tier2PollTimerRef.current = setTimeout(poll, 3000);
        }
      } catch {
        setError("poll-failed");
      }
    };
    tier2PollTimerRef.current = setTimeout(poll, 3000);
  }

  function retryEntry() {
    if (vwrPollTimerRef.current) clearTimeout(vwrPollTimerRef.current);
    if (tier2PollTimerRef.current) clearTimeout(tier2PollTimerRef.current);
    entryRetryRef.current = 0;
    reentryCountRef.current = 0;
    activatedRef.current = false;
    setError(null);
    setPhase("waiting");
    void startVwr();
  }

  // 마운트 시 VWR 진입
  useEffect(() => {
    void startVwr();
    return () => {
      if (vwrPollTimerRef.current) clearTimeout(vwrPollTimerRef.current);
      if (tier2PollTimerRef.current) clearTimeout(tier2PollTimerRef.current);
    };
  }, [startVwr]);

  const totalRemaining = sectionsForDate.reduce(
    (sum, s) => sum + s.remainingSeats,
    0,
  );

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
