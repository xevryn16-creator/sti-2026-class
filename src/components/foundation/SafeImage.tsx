"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Render with intrinsic fill behavior inside a positioned parent. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Extra class applied to the wrapping element when fallback is active. */
  fallbackClassName?: string;
  fallbackMessage?: string;
}

/**
 * next/image wrapper (T-109) enforcing 6px image radius and graceful
 * editorial fallback (FB-06): a broken or missing photo renders a discreet
 * archive message instead of a broken-image glyph.
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  className,
  fallbackClassName,
  fallbackMessage = "Foto dalam proses digitalisasi arsip.",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("image-fallback", fallbackClassName)} role="img" aria-label={alt}>
        <span className="image-fallback__text">{fallbackMessage}</span>
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true, sizes: sizes ?? "100vw" }
    : { width: width ?? 1200, height: height ?? 800, sizes };

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("safe-image", className)}
      onError={() => setFailed(true)}
      priority={priority}
      {...imageProps}
    />
  );
}
