"use client";

import { useEffect, useRef } from "react";

/**
 * rAF-throttled scroll offset calculator for the hero photograph (L-01,
 * T-303). Writes the transform directly to the DOM node — never through
 * React state — so scrolling stays off the React render path.
 * Desktop-only (≥ 1024px); disabled entirely under reduced motion.
 */
export function useParallax(
  targetRef: React.RefObject<HTMLElement | null>,
  speed = 0.35,
): void {
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    let active = false;

    const apply = (): void => {
      frame = 0;
      if (!active) return;
      const rect = element.parentElement?.getBoundingClientRect();
      if (!rect) return;
      /* Map scroll progress of the hero container to translateY, capped at
         +30% of viewport height (docs/MOTION.md L-01). */
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      const offset = Math.min(progress * rect.height * speedRef.current, window.innerHeight * 0.3);
      element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = (): void => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const evaluate = (): void => {
      active = mqDesktop.matches && !mqReduce.matches;
      if (active) {
        element.style.transform = "translate3d(0, 0, 0)";
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
      } else {
        element.style.transform = "";
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };

    evaluate();
    mqReduce.addEventListener("change", evaluate);
    mqDesktop.addEventListener("change", evaluate);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqReduce.removeEventListener("change", evaluate);
      mqDesktop.removeEventListener("change", evaluate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef]);
}
