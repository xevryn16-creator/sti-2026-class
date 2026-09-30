import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  variant?: "default" | "spotlight";
  className?: string;
}

/**
 * Pill badge (200px radius) per docs/DESIGN.md §4.2.
 * `default` — Warm Parchment fill, Ink text. `spotlight` — Broadcast
 * Gradient fill, white text; reserved for key achievements and featured tags.
 */
export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("badge", `badge--${variant}`, className)}>{children}</span>
  );
}
