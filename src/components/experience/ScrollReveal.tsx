"use client";

import { useEffect } from "react";

/**
 * ScrollReveal (T-701, docs/MOTION.md R-01..R-03).
 *
 * One client wrapper per page observes EVERY `[data-reveal]` descendant in the
 * document — server-rendered headings, cards, and timeline entries included —
 * so no extra client components are needed per card.
 *
 * Hidden-state strategy:
 *  - An inline bootstrap script (root layout) sets `data-reveal-ready="true"`
 *    on `<html>` BEFORE first paint, but ONLY when scripting is enabled AND
 *    full motion is allowed. No-JS and reduced-motion users therefore never
 *    see hidden content.
 *  - This component then verifies visibility of any element already in the
 *    initial viewport, attaches one IntersectionObserver for the rest, and
 *    reveals on entry.
 *  - Stagger (R-02) is applied per sibling group via `--reveal-delay`.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.revealReady !== "true") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"),
    );
    if (elements.length === 0) return;

    /* Elements already inside the initial viewport (mostly the hero) reveal
       immediately without animation to avoid a double entrance. */
    const viewport = window.innerHeight;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport * 0.85) {
        el.classList.add("is-revealed");
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of elements) {
      if (!el.classList.contains("is-revealed")) {
        /* Stagger within a shared parent grid (R-02: 60/40/30ms per column). */
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(
            parent.querySelectorAll<HTMLElement>(":scope > [data-reveal]"),
          );
          const index = siblings.indexOf(el);
          if (index > 0) {
            el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 60}ms`);
          }
        }
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
