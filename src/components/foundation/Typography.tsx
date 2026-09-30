import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant =
  | "display"
  | "heading-lg"
  | "heading"
  | "heading-sm"
  | "subheading"
  | "body"
  | "caption";

export type TypographyColor = "ink" | "graphite" | "ash" | "paper" | "inherit";

interface TypographyProps {
  variant: TypographyVariant;
  as?: ElementType;
  color?: TypographyColor;
  weight?: 400 | 500;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const COLOR_CLASS: Record<TypographyColor, string | undefined> = {
  ink: "c-ink",
  graphite: "c-graphite",
  ash: "c-ash",
  paper: "c-paper",
  inherit: undefined,
};

/**
 * Type renderer enforcing docs/DESIGN.md §3.2. Every visible text node on the
 * site passes through this component (or a utility class it emits).
 */
export default function Typography({
  variant,
  as,
  color = "inherit",
  weight,
  className,
  style,
  children,
}: TypographyProps) {
  const Tag = (as ?? "p") as ElementType;
  return (
    <Tag
      className={cn(
        `t-${variant}`,
        color !== "inherit" && COLOR_CLASS[color],
        className,
      )}
      style={{ ...(weight ? { fontWeight: weight } : {}), ...style }}
    >
      {children}
    </Tag>
  );
}
