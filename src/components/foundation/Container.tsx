import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

/** Centered 1200px max-width layout container (docs/DESIGN.md §3.3). */
export default function Container({ as = "div", className, children }: ContainerProps) {
  const Tag = as;
  return <Tag className={cn("container", className)}>{children}</Tag>;
}
