import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "filled" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

const isExternalHref = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");

/**
 * Pill button (200px radius) per docs/DESIGN.md §4.1 with the M-01 hover.
 * Filled: Ink Black surface, Paper White text. Ghost: transparent, underlined
 * on hover.
 */
export default function Button({
  variant = "filled",
  href,
  external,
  className,
  children,
}: ButtonProps) {
  const classes = cn(
    variant === "filled" ? "btn-pill-filled" : "btn-pill-ghost",
    className,
  );
  const externalUrl = external ?? isExternalHref(href);

  if (externalUrl) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
