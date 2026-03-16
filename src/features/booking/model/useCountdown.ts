"use client";

import { useState, useEffect } from "react";

export function useCountdown(targetIso: string | null): number {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!targetIso) return 0;
    return Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!targetIso) {
      queueMicrotask(() => setSecondsLeft(0));
      return;
    }

    const calc = () =>
      Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000));
    queueMicrotask(() => setSecondsLeft(calc()));

    const id = setInterval(() => {
      const next = calc();
      setSecondsLeft(next);
      if (next <= 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [targetIso]);

  return secondsLeft;
}
