import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientFrameProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * 3px Broadcast Gradient outer ring wrapping featured content (T-111,
 * docs/DESIGN.md §4.4). One of only three sanctioned gradient uses
 * (V-TOK-02).
 */
export default function GradientFrame({ children, className, ariaLabel }: GradientFrameProps) {
  return (
    <div className={cn("gradient-frame", className)} aria-label={ariaLabel}>
      <div className="gradient-frame__inner">{children}</div>
    </div>
  );
}
