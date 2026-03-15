"use client";

import { useState, useEffect, useCallback } from "react";

export function useNavigationBlock(shouldBlock: boolean) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!shouldBlock) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);

  const requestLeave = useCallback(() => {
    if (shouldBlock) {
      setShowPrompt(true);
    }
  }, [shouldBlock]);

  const cancelLeave = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const confirmLeave = useCallback(() => {
    setShowPrompt(false);
  }, []);

  return { showPrompt, requestLeave, cancelLeave, confirmLeave };
}
