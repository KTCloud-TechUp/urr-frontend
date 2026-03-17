"use client";

import { useState, useEffect } from "react";

export function useCountdown(targetIso: string | null): number {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!targetIso) return 0;
    return Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!targetIso) {
      const t = setTimeout(() => setSecondsLeft(0), 0);
      return () => clearTimeout(t);
    }

    const calc = () =>
      Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000));

    const t = setTimeout(() => setSecondsLeft(calc()), 0);
    const id = setInterval(() => {
      const next = calc();
      setSecondsLeft(next);
      if (next <= 0) clearInterval(id);
    }, 1000);

    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, [targetIso]);

  return secondsLeft;
}
