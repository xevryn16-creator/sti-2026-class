"use client";

import { useEffect, useRef } from "react";

/**
 * Intersection Observer hook for one-shot scroll triggers (docs/MOTION.md,
 * Category 2). Calls `onEnter` the first time the element enters the viewport,
 * then disconnects — zero repeat animation on upward scroll (T-701).
 */
export function useInView<T extends HTMLElement>(
  onEnter: () => void,
  options?: IntersectionObserverInit,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onEnter);
  callbackRef.current = onEnter;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      callbackRef.current();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbackRef.current();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
