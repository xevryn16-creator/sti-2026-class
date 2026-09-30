import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionSurface =
  | "paper-white"
  | "warm-parchment"
  | "ink-black"
  | "broadcast-gradient";

interface SectionProps {
  surface?: SectionSurface;
  as?: ElementType;
  id?: string;
  className?: string;
  children?: ReactNode;
}

const SURFACE_CLASS: Record<SectionSurface, string> = {
  "paper-white": "section--paper-white",
  "warm-parchment": "section--warm-parchment",
  "ink-black": "section--ink-black",
  "broadcast-gradient": "section--broadcast",
};

/**
 * Vertical rhythm block enforcing the 72px section gap (docs/DESIGN.md §3.3)
 * with the four documented surface colors.
 */
export default function Section({
  surface = "paper-white",
  as = "section",
  id,
  className,
  children,
}: SectionProps) {
  const Tag = as;
  return (
    <Tag id={id} className={cn("section", SURFACE_CLASS[surface], className)}>
      {children}
    </Tag>
  );
}
