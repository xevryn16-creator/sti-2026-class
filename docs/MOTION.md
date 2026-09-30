# MOTION.md
> STI 2026 — Sistem dan Teknologi Informasi
> Motion System, Animation Specifications & Accessibility Rules

---

## 1. MOTION PHILOSOPHY & EDITORIAL PRINCIPLES

1. **Animation Serves the Story:** Every animation must possess an editorial or navigational purpose. Motion is never applied for gratuitous spectacle.
2. **Weighted & Tactile, Not Game-Like:** The physical feeling is that of high-end editorial paper, smooth pagination, and physical photographic depth — not an arcade game or flash SaaS interface.
3. **Parallax as Pure Photographic Depth:** Parallax is strictly reserved for the background photography layer (`.hero-photo`). Text and user interface controls **never** have parallax applied to them.
4. **Restraint is the Brand Signature:** If an interaction feels acceptable without animation, leave it un-animated. Whitespace and confident typography carry the brand voice.
5. **Reduced Motion as an Equal Citizen:** Users with `prefers-reduced-motion: reduce` receive an immediate, dignified, complete interface with zero transitions or movement.

---

## 2. STRICTLY FORBIDDEN ANIMATION PATTERNS

> [!CAUTION]
> The following patterns violate the editorial integrity of the STI 2026 brand and are **strictly banned**:
> - ❌ **Floating Ambient Particles / Canvases:** No starfields, constellations, floating dust motes, or matrix rain.
> - ❌ **Infinite Loop Animations:** No continuously spinning badges, oscillating blobs, or pulsating glows.
> - ❌ **Background Color Cycles:** No animated gradient shifts or flashing neon borders.
> - ❌ **Text Movement on Scroll (Text Parallax):** Text must remain rock-solid and legible at all times.
> - ❌ **Aggressive Scale Transforms:** No hover scale greater than `1.04×`.
> - ❌ **Simultaneous Page Load Chaos:** Staggered entrance is strictly capped at 2–3 elements in the hero.

---

## 3. GLOBAL TIMING & EASING TOKENS

```css
:root {
  /* Durations */
  --motion-instant: 0ms;
  --motion-micro: 140ms;
  --motion-fast: 220ms;
  --motion-medium: 380ms;
  --motion-slow: 600ms;
  --motion-editorial: 800ms;

  /* Easing Curves */
  --ease-editorial-out: cubic-bezier(0.16, 1, 0.3, 1); /* Confident spring-like settle */
  --ease-standard-out: cubic-bezier(0.25, 0, 0, 1);   /* Smooth deceleration */
  --ease-fade-in: cubic-bezier(0.4, 0, 1, 1);
}
```

---

## 4. REDUCED MOTION SPECIFICATION

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 5. COMPLETE ANIMATION SPECIFICATIONS

---

### CATEGORY 1: MICRO-INTERACTIONS (CSS Transitions Only)

#### M-01 — Primary Pill Button Hover
- **Purpose:** Tactile feedback on primary interactive call-to-action.
- **Trigger:** Pointer `:hover` / `:focus-visible`.
- **Target:** `.btn-pill-filled` (Primary action).
- **Property:** `background-color`, `transform`.
- **Duration:** `160ms`.
- **Easing:** `ease-out`.
- **Distance / Amount:** `translateY(-1px)`.
- **Direction:** Upward.
- **Desktop (≥ 1024px):** Background transitions `#000000` → `#1a1a1a`; lifts 1px.
- **Tablet (768px–1023px):** Same as desktop on pointer; disabled on touch tap.
- **Mobile (< 768px):** No translate. Active press scales `0.98×` for 80ms.
- **Reduced Motion:** Color change only, `transform: none`.

#### M-02 — Ghost Nav Link Hover
- **Purpose:** Clear indicator of interactive link without shifting layout.
- **Trigger:** Pointer `:hover`.
- **Target:** `.nav-link`, `.text-link`.
- **Property:** `opacity`, `text-decoration`.
- **Duration:** `120ms`.
- **Easing:** `ease`.
- **Distance / Amount:** None.
- **Direction:** None.
- **Desktop (≥ 1024px):** Underline appears smoothly; opacity shifts `1.0` → `0.70`.
- **Tablet (768px–1023px):** Same.
- **Mobile (< 768px):** Instant tap highlight; no persistent hover state.
- **Reduced Motion:** Instant underline, opacity unchanged.

#### M-03 — Student Directory Card Hover
- **Purpose:** Highlights student card as an interactive, navigable entity.
- **Trigger:** Pointer `:hover`.
- **Target:** `.student-card`.
- **Property:** `transform`, `box-shadow`.
- **Duration:** `240ms`.
- **Easing:** `cubic-bezier(0.25, 0, 0, 1)`.
- **Distance / Amount:** `translateY(-4px)`.
- **Direction:** Upward.
- **Desktop (≥ 1024px):** Card elevates -4px; shadow blooms to `rgba(0,0,0,0.08) 0px 8px 24px 0px`.
- **Tablet (768px–1023px):** Reduced elevation (`translateY(-2px)`).
- **Mobile (< 768px):** Disabled entirely. Touch tap triggers immediate navigation.
- **Reduced Motion:** No translate; border color shifts from `#e5e5e5` to `#000000`.

#### M-04 — Project Showcase Card Hover
- **Purpose:** Draws visual attention to student project engineering work.
- **Trigger:** Pointer `:hover`.
- **Target:** `.project-card`, `.project-card-image`.
- **Property:** `transform` (card), `transform` (image scale).
- **Duration:** `300ms`.
- **Easing:** `cubic-bezier(0.25, 0, 0, 1)`.
- **Distance / Amount:** Card: `translateY(-4px)`; Image: `scale(1.03)`.
- **Direction:** Upward and radial zoom.
- **Desktop (≥ 1024px):** Card lifts -4px; cover image zooms to 1.03× within 6px clipped bounds.
- **Tablet (768px–1023px):** Card lifts -2px; image zoom 1.02×.
- **Mobile (< 768px):** Disabled.
- **Reduced Motion:** No zoom, no translation.

#### M-05 — Memory & Campus Photo Hover
- **Purpose:** Informs user that photo can be expanded into full-screen lightbox.
- **Trigger:** Pointer `:hover`.
- **Target:** `.memory-card img`.
- **Property:** `transform`, `filter`.
- **Duration:** `360ms`.
- **Easing:** `cubic-bezier(0.25, 0, 0, 1)`.
- **Distance / Amount:** `scale(1.04)`.
- **Direction:** Center zoom.
- **Desktop (≥ 1024px):** Image gently zooms 1.04×; brightness shifts to 0.96.
- **Tablet (768px–1023px):** Disabled.
- **Mobile (< 768px):** Disabled.
- **Reduced Motion:** No zoom.

---

### CATEGORY 2: SCROLL-DRIVEN ENTRANCES (Intersection Observer)

#### R-01 — Section Heading Reveal
- **Purpose:** Guides reader focus to new editorial sections as they scroll.
- **Trigger:** Section header enters 20% into viewport.
- **Target:** `.section-heading-stack`.
- **Property:** `opacity`, `transform`.
- **Duration:** `600ms`.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like ease-out).
- **Distance / Amount:** `translateY(24px)`.
- **Direction:** Upward.
- **Desktop (≥ 1024px):** `translateY(24px) → translateY(0)`, `opacity 0 → 1`.
- **Tablet (768px–1023px):** `translateY(18px) → translateY(0)`.
- **Mobile (< 768px):** `translateY(14px) → translateY(0)`, duration `450ms`.
- **Reduced Motion:** Immediate visibility (`opacity: 1`), zero translation.

#### R-02 — Card Grid Stagger Reveal
- **Purpose:** Prevents jarring sudden layout appearance, presenting cohort items progressively.
- **Trigger:** Grid container enters 15% into viewport.
- **Target:** `.student-card`, `.project-card`, `.event-card`.
- **Property:** `opacity`, `transform`.
- **Duration:** `480ms` per card.
- **Easing:** `cubic-bezier(0.25, 0, 0, 1)`.
- **Distance / Amount:** `translateY(20px)`.
- **Direction:** Upward.
- **Desktop (≥ 1024px):** Stagger delay `60ms` per column item (max 4 in a row).
- **Tablet (768px–1023px):** Stagger delay `40ms` (2-column layout).
- **Mobile (< 768px):** Stagger delay `30ms` (1 or 2 columns), `translateY(12px)`.
- **Reduced Motion:** All cards visible immediately on render, no stagger.

#### R-03 — Timeline Milestone Reveal
- **Purpose:** Creates the feeling of journey progression along the chronological line.
- **Trigger:** Timeline entry reaches 30% of viewport.
- **Target:** `.timeline-entry`.
- **Property:** `opacity`, `transform`.
- **Duration:** `500ms`.
- **Easing:** `cubic-bezier(0.25, 0, 0, 1)`.
- **Distance / Amount:** Desktop: `translateX(±16px)`; Mobile: `translateY(16px)`.
- **Direction:** Left entries enter from left, right entries from right.
- **Desktop (≥ 1024px):** Alternating horizontal translation to zero.
- **Tablet (768px–1023px):** Same if alternating; if collapsed to single column, vertical `translateY(16px)`.
- **Mobile (< 768px):** Pure vertical entry `translateY(14px)` on left-aligned track.
- **Reduced Motion:** All entries statically visible.

---

### CATEGORY 3: LARGE SCALE & SYSTEM ANIMATIONS

#### L-01 — Hero Photography Parallax
- **Purpose:** Generates photographic depth and editorial grandeur in the opening scene.
- **Trigger:** Window scroll event (rAF-throttled).
- **Target:** `.hero-photo` (contained within `.hero-container`).
- **Property:** `transform: translateY(px)`.
- **Duration:** Continuous (mapped to scroll offset).
- **Easing:** Linear (direct position mapping).
- **Distance / Amount:** Photo moves at `0.35×` of scroll speed (max translateY `+30%`).
- **Direction:** Downward as user scrolls down.
- **Desktop (≥ 1024px):** Enabled. Photo container is sized to 130% height to allow travel.
- **Tablet (768px–1023px):** **Disabled entirely** — photo is static to preserve GPU battery.
- **Mobile (< 768px):** **Disabled entirely** — photo is static.
- **Reduced Motion:** **Disabled entirely** — photo is static at `translateY(0)`.

#### L-02 — Hero Text Load Entrance
- **Purpose:** Dignified first-load arrival of cohort name and identity.
- **Trigger:** Page mount (executes exactly once).
- **Target:** `.hero-headline`, `.hero-subheadline`, `.hero-cta`.
- **Property:** `opacity`, `transform`.
- **Duration:** Headline `700ms`, Subheadline `600ms`, CTA `500ms`.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Distance / Amount:** `translateY(32px)`.
- **Direction:** Upward.
- **Desktop (≥ 1024px):** Delays: Headline 0ms, Subhead 140ms, CTA 280ms.
- **Tablet (768px–1023px):** Distance `translateY(24px)`.
- **Mobile (< 768px):** Distance `translateY(16px)`.
- **Reduced Motion:** All elements render at full opacity instantly.

#### L-03 — Accessible Lightbox Open & Close
- **Purpose:** Full-screen immersion for memory photography with accessible modal behavior.
- **Trigger:** User click/Enter on photo thumbnail (Open) / Click overlay/ESC (Close).
- **Target:** `.lightbox-overlay`, `.lightbox-image`.
- **Property:** `opacity`, `transform`.
- **Duration:** Open: `280ms`; Close: `200ms`.
- **Easing:** Open: `cubic-bezier(0.25, 0, 0, 1)`; Close: `ease-in`.
- **Distance / Amount:** Image scale `0.96 → 1.0`.
- **Direction:** Radial outward.
- **Desktop (≥ 1024px):** Background fades in (`rgba(0,0,0,0.85)`); photo zooms to center.
- **Tablet (768px–1023px):** Same.
- **Mobile (< 768px):** Scale `0.98 → 1.0`, background opacity `0.95`.
- **Reduced Motion:** Instant appearance/disappearance; zero scale transform.

#### L-04 — Mobile Navigation Drawer (`NavDrawer`)
- **Purpose:** Smooth, accessible off-canvas menu for tablet and mobile viewports.
- **Trigger:** Hamburger menu tap (Open) / Close button or ESC (Close).
- **Target:** `.nav-drawer`.
- **Property:** `transform`, `opacity`.
- **Duration:** Open: `260ms`; Close: `200ms`.
- **Easing:** Open: `cubic-bezier(0.25, 0, 0, 1)`; Close: `ease-in`.
- **Distance / Amount:** `translateX(100%) → translateX(0)`.
- **Direction:** Slides in from right edge.
- **Desktop (≥ 1024px):** Not applicable (full horizontal navbar displayed).
- **Tablet (768px–1023px):** Drawer width `360px`, slides in from right.
- **Mobile (< 768px):** Drawer width `100vw` (full screen).
- **Reduced Motion:** Instant toggle, no slide. Focus trapped immediately.
