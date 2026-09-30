"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MemoryPhoto } from "@/types";
import { cn } from "@/lib/utils";

interface GalleryLightboxProps {
  photos: MemoryPhoto[];
  /** Index of the photo to open, or `null` when closed. */
  startIndex: number | null;
  onClose: () => void;
  /** Registry of thumbnail buttons for focus restoration (F-GAL-06). */
  triggerRefs?: React.RefObject<Map<number, HTMLButtonElement>>;
}

/**
 * Full-screen accessible photo viewer (T-506B, docs/MOTION.md L-03).
 * Guarantees (QA F-GAL-01..07, A-K05..A-K09):
 *  - role="dialog" + aria-modal, labelled "Penampil Foto Kenangan"
 *  - Tab/Shift+Tab trapped within controls; ESC closes
 *  - ArrowLeft/ArrowRight navigate; touch swipe navigates on mobile
 *  - background scroll locked; focus restored to the triggering thumbnail
 *  - reduced motion: instant open/close with zero zoom
 */
export default function GalleryLightbox({
  photos,
  startIndex,
  onClose,
  triggerRefs,
}: GalleryLightboxProps) {
  const open = startIndex !== null;
  const [index, setIndex] = useState(startIndex ?? 0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  /* Keep internal index in sync when (re)opened from a thumbnail. */
  useEffect(() => {
    if (startIndex !== null) setIndex(startIndex);
  }, [startIndex]);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );

  /* Global keys, scroll lock, initial focus, focus restoration. */
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "Tab") {
        /* Strict trap among the three controls. */
        const focusables = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          ) ?? [],
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
      /* Prefer restoring to the exact thumbnail that opened the viewer. */
      if (startIndex !== null) {
        triggerRefs?.current.get(startIndex)?.focus();
      }
    };
  }, [open, onClose, next, prev, startIndex, triggerRefs]);

  if (!open || photos.length === 0) return null;

  const photo = photos[index];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Penampil Foto Kenangan"
      ref={dialogRef}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX ?? null;
        touchStartX.current = null;
        if (start === null || end === null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return; /* ignore taps */
        if (delta < 0) next();
        else prev();
      }}
    >
      <button
        type="button"
        className="lightbox__overlay"
        aria-label="Tutup penampil foto"
        onClick={onClose}
      />
      <div className="lightbox__stage">
        <figure className="lightbox__figure" data-photo-index={index}>
          {photo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} className="lightbox__image" />
              {photo.caption ? <figcaption className="lightbox__caption">{photo.caption}</figcaption> : null}
            </>
          ) : null}
        </figure>
        <p className="lightbox__counter t-caption">
          {index + 1} / {photos.length}
        </p>
      </div>
      <div className="lightbox__controls">
        <button type="button" className="lightbox__button" onClick={prev} aria-label="Foto sebelumnya">
          <ChevronLeft size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="lightbox__button lightbox__button--close"
          onClick={onClose}
          aria-label="Tutup penampil foto"
          ref={closeRef}
        >
          <X size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="button" className="lightbox__button" onClick={next} aria-label="Foto berikutnya">
          <ChevronRight size={24} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
