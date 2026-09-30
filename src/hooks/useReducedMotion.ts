"use client";

import { useEffect, useState } from "react";

/**
 * Detects the `prefers-reduced-motion` media query (docs/MOTION.md §1.5).
 * Reacts live if the user changes the OS setting mid-session.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
