import Container from "@/components/foundation/Container";
import SafeImage from "@/components/foundation/SafeImage";
import ParallaxContainer from "@/components/experience/ParallaxContainer";
import { getClassData } from "@/lib/data";
import type { CSSProperties } from "react";
import type { ClassEntity } from "@/types";

interface HeroSectionProps {
  heroPhoto?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  ctaLabel?: string;
}

const isPlaceholder = (value?: string): boolean =>
  !value || value.startsWith("[");

/**
 * Full-viewport hero (T-301..T-304, docs/CONTENT.md §3 Section 1).
 *
 * Server component — the L-02 entrance is pure CSS (animation-delay via
 * --delay custom property), so no client JS is needed for the text layer.
 * The only client islands are SafeImage (error fallback) and the photo
 * parallax wrapper (L-01, desktop-only).
 *
 * Fallback behavior: while cohort photography is pending, renders an
 * ink-black editorial canvas with display typography — dignified, zero fake
 * imagery (docs/CONTENT.md §1 Fallback).
 */
export default function HeroSection({
  heroPhoto,
  heroSubheadline,
  ctaLabel,
}: HeroSectionProps) {
  const cls: ClassEntity = getClassData();
  const showPhoto = Boolean(heroPhoto) && !isPlaceholder(heroPhoto);
  const showSub = Boolean(heroSubheadline) && !isPlaceholder(heroSubheadline);
  const showCta = Boolean(ctaLabel) && !isPlaceholder(ctaLabel);

  return (
    <section className="hero" aria-label="STI 2026 — Sistem dan Teknologi Informasi">
      {showPhoto ? (
        <ParallaxContainer className="hero__photo-layer" speed={0.35}>
          <SafeImage
            src={heroPhoto ?? ""}
            alt="Suasana kebersamaan angkatan STI 2026"
            fill
            priority
            sizes="100vw"
            className="hero__photo"
          />
        </ParallaxContainer>
      ) : null}

      <div className="hero__canvas" aria-hidden="true" />

      <Container className="hero__content">
        <p
          className="hero__kicker hero-entrance"
          style={{ "--delay": "0ms" } as CSSProperties}
        >
          {cls.programName}
        </p>
        <h1
          className="t-display hero__headline hero-entrance"
          style={{ "--delay": "140ms" } as CSSProperties}
        >
          STI 2026
        </h1>
        {showSub ? (
          <p
            className="hero__subheadline hero-entrance"
            style={{ "--delay": "280ms" } as CSSProperties}
          >
            {heroSubheadline}
          </p>
        ) : null}
        {showCta ? (
          <a
            href="#angkatan"
            className="btn-pill-filled hero__cta hero-entrance"
            style={{ "--delay": "420ms" } as CSSProperties}
          >
            {ctaLabel}
          </a>
        ) : null}
      </Container>

      <div className="hero__scrollcue" aria-hidden="true" />
    </section>
  );
}
