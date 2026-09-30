"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxContainerProps {
  children: ReactNode;
  /** Scroll-speed multiplier (L-01: 0.35×). */
  speed?: number;
  className?: string;
}

/**
 * Photographic parallax wrapper (T-303). Reserved strictly for background
 * photography layers — text and UI controls never receive parallax
 * (docs/MOTION.md §1.3). Desktop-only; static under reduced motion.
 * Owns its ref so server components can compose it without becoming client
 * components themselves.
 */
export default function ParallaxContainer({
  children,
  speed = 0.35,
  className,
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useParallax(ref, speed);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
