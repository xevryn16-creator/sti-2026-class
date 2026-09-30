# QA.md
> STI 2026 — Sistem dan Teknologi Informasi
> Comprehensive Quality Assurance Suite & Test Protocols

---

## 1. QA METHODOLOGY & PROTOCOLS

- **Environment:** All QA tests must be conducted against an optimized production build (`npm run build && npm run start`), not a development server.
- **Device Coverage:** Real mobile and desktop hardware wherever possible (DevTools emulation used as baseline).
- **Status Indicators:** `[ ]` = Not Tested, `[PASS]` = Verified Compliant, `[FAIL]` = Issue Found (Logged with ID).
- **Priority Classes:**
  - **P0 (Blocker):** Must pass 100% before any staging or production release.
  - **P1 (Critical):** Strong editorial requirement; must pass before final cohort review.
  - **P2 (Quality of Life):** Polish items; failure does not block release if mitigated.

---

## 2. FUNCTIONAL TEST PROTOCOLS

### 2.1 Navigation & Shell

| Test ID | Test Description | Expected Behavior | Priority | Status |
|---------|------------------|-------------------|----------|--------|
| **F-NAV-01** | Desktop Navigation Links | Clicking Beranda, Angkatan, Karya, Kenangan, Acara, Perjalanan navigates to `/`, `/students`, `/projects`, `/memories`, `/events`, `/timeline`. | P0 | `[ ]` |
| **F-NAV-02** | Active Route Highlight | The current active route displays subtle underline or text opacity shift. | P1 | `[ ]` |
| **F-NAV-03** | Wordmark Return Link | Clicking "STI 2026" wordmark returns user to `/`. | P0 | `[ ]` |
| **F-NAV-04** | Sticky Navbar Position | Navbar stays pinned to top (height 72px) with subtle bottom border on scroll. | P0 | `[ ]` |
| **F-NAV-05** | Mobile Hamburger Open | Tapping hamburger icon at `< 1024px` smoothly slides open `NavDrawer`. | P0 | `[ ]` |
| **F-NAV-06** | Mobile Drawer Close Button | Tapping close button (×) slides drawer closed and unlocks background scroll. | P0 | `[ ]` |
| **F-NAV-07** | Mobile Drawer Link Navigation | Tapping any link navigates to target route and automatically closes drawer. | P0 | `[ ]` |
| **F-NAV-08** | Mobile Drawer ESC Key | Pressing `Escape` key closes open drawer immediately. | P1 | `[ ]` |
| **F-NAV-09** | Skip to Main Content | Tapping `Tab` from address bar displays skip link; pressing `Enter` focuses `#main-content`. | P0 | `[ ]` |

---

### 2.2 Student Experience (Directory & Profiles)

| Test ID | Test Description | Expected Behavior | Priority | Status |
|---------|------------------|-------------------|----------|--------|
| **F-STU-01** | Directory Renders All Consented Students | Every student with `consentPublic: true` appears in the grid. | P0 | `[ ]` |
| **F-STU-02** | Zero Unconsented Students Rendered | Any record with `consentPublic: false` or omitted is completely hidden from directory, search, and SSG pages. | P0 | `[ ]` |
| **F-STU-03** | StudentCard URL Navigation | Clicking card navigates directly to `/students/[slug]`. | P0 | `[ ]` |
| **F-STU-04** | Profile SSG Generation | All student profile pages are pre-rendered at build time with zero client fetch lag. | P0 | `[ ]` |
| **F-STU-05** | Invalid Slug 404 Return | Navigating to `/students/non-existent-slug` cleanly renders the 404 page. | P0 | `[ ]` |
| **F-STU-06** | Social Links Open in New Tab | External links (LinkedIn, GitHub) have `target="_blank"` and `rel="noopener noreferrer"`. | P0 | `[ ]` |
| **F-STU-07** | Linked Projects Navigation | Clicking a linked project on a student profile navigates to the corresponding project detail page. | P1 | `[ ]` |

---

### 2.3 Project Showcase & Detail

| Test ID | Test Description | Expected Behavior | Priority | Status |
|---------|------------------|-------------------|----------|--------|
| **F-PRJ-01** | Project Grid Renders Correctly | All projects in `projects.json` render with 16:9 covers, title, team names, and tags. | P0 | `[ ]` |
| **F-PRJ-02** | Project Detail SSG Generation | `/projects/[slug]` pre-renders problem statement, tech stack, and full team roster. | P0 | `[ ]` |
| **F-PRJ-03** | Team Member Cross-Links | Team member names on project page link directly to their respective student profile. | P1 | `[ ]` |
| **F-PRJ-04** | Live Demo / Repo External Link | Link button opens live site/repo in new tab with security attributes. | P0 | `[ ]` |
| **F-PRJ-05** | Invalid Project Slug 404 | Non-existent project route returns 404 page. | P0 | `[ ]` |

---

### 2.4 Gallery & Accessible Lightbox

| Test ID | Test Description | Expected Behavior | Priority | Status |
|---------|------------------|-------------------|----------|--------|
| **F-GAL-01** | Lightbox Open on Thumbnail Click | Clicking/pressing Enter on any gallery image opens full-screen modal overlay. | P0 | `[ ]` |
| **F-GAL-02** | Lightbox Focus Trapping | When open, Tab key only cycles within lightbox controls (Next, Prev, Close). | P0 | `[ ]` |
| **F-GAL-03** | Lightbox Arrow Navigation | Pressing `ArrowRight` and `ArrowLeft` navigates to next/previous photo seamlessly. | P0 | `[ ]` |
| **F-GAL-04** | Lightbox Touch Swipe | Swiping left/right on mobile navigates between photos. | P1 | `[ ]` |
| **F-GAL-05** | Lightbox Close on Escape | Pressing `Escape` closes lightbox immediately. | P0 | `[ ]` |
| **F-GAL-06** | Focus Restoration to Trigger | Upon closing, focus returns precisely to the thumbnail button that opened the modal. | P0 | `[ ]` |
| **F-GAL-07** | Background Scroll Lock | Background document cannot scroll while lightbox is open. | P0 | `[ ]` |

---

## 3. EDITORIAL FALLBACK & ERROR STATE AUDIT

| Test ID | Condition Tested | Expected Fallback Behavior | Priority | Status |
|---------|------------------|----------------------------|----------|--------|
| **FB-01** | Student Has No Portrait Photo | Displays elegant warm parchment monogram card with student's uppercase initials in Geist 500. Zero cartoon or generic avatar. | P0 | `[ ]` |
| **FB-02** | Student Has No Personal Bio | Bio block is cleanly omitted; interest badges and quotes expand naturally with zero awkward gaps. | P1 | `[ ]` |
| **FB-03** | Student Has No Social Links | Social links block is hidden cleanly without broken icons. | P1 | `[ ]` |
| **FB-04** | Project Has No Cover Image | Displays typographic card with project title, team badges, and a Warm Parchment backdrop with Broadcast Gradient hairline. | P1 | `[ ]` |
| **FB-05** | Event Has No Poster Photo | Displays typographic card with date, title, and category badge. | P1 | `[ ]` |
| **FB-06** | Broken Image Load (HTTP 404) | Image component catches error and renders graceful fallback placeholder. | P0 | `[ ]` |
| **FB-07** | 404 Not Found Page | Renders Warm Parchment canvas, Geist 56px "404", editorial message, and pill button returning to `/`. | P0 | `[ ]` |

---

## 4. VISUAL & DESIGN TOKEN COMPLIANCE

| Test ID | Design System Rule | Verification Method | Priority | Status |
|---------|--------------------|---------------------|----------|--------|
| **V-TOK-01** | Zero Unapproved Colors | Inspect DOM; confirm only Paper White (`#fff`), Warm Parchment (`#f6f4f1`), Ink Black (`#000`), Soft Graphite (`#666`), Mid Ash (`#999`), Pale Mist (`#b3b3b3`), and Broadcast Gradient are used. | P0 | `[ ]` |
| **V-TOK-02** | Broadcast Gradient Rationing | Confirm gradient is only applied to: (1) spotlight badges, (2) featured project frames, (3) at most one section band. No text gradients. | P0 | `[ ]` |
| **V-TOK-03** | Typography Weights 400 & 500 Only | Confirm no CSS rule specifies font-weight 600, 700, 800, or 900. | P0 | `[ ]` |
| **V-TOK-04** | Geist OpenType Features | Verify `"ss01" on, "ss03" on, "ss04" on` is active on all Geist text. | P1 | `[ ]` |
| **V-TOK-05** | Strict 6px Card & Image Radius | All cards and images have `border-radius: 6px`. Zero 12px or 16px cards. | P0 | `[ ]` |
| **V-TOK-06** | Strict 200px Pill Radius | All buttons, badges, and pills have `border-radius: 200px`. | P0 | `[ ]` |
| **V-TOK-07** | Subtle Atmospheric Shadow Only | Only `rgba(0, 0, 0, 0.06) 0px 2px 6px` is used. Zero heavy multi-tier shadows. | P0 | `[ ]` |
| **V-TOK-08** | Anti-AI-Slop Audit | Verify zero floating particles, zero rotating blobs, zero glowing cyber borders, zero frosted glassmorphism overlays. | P0 | `[ ]` |

---

## 5. RESPONSIVE BEHAVIOR AUDIT

### 5.1 Desktop (1440px & 1920px Wide)
- [ ] Content centered with max-width 1200px.
- [ ] 4-column student directory grid with 24px gaps.
- [ ] 3-column project showcase grid.
- [ ] Hero parallax active at 0.35× scroll speed.
- [ ] Full horizontal navbar visible.

### 5.2 Tablet Landscape (1024px)
- [ ] 3-column student directory grid.
- [ ] 2-column project showcase grid.
- [ ] Hero parallax active or gracefully locked.
- [ ] Horizontal navbar remains visible or transitions to hamburger cleanly.

### 5.3 Tablet Portrait (768px)
- [ ] 2-column student directory grid.
- [ ] 2-column project showcase grid.
- [ ] Timeline collapses to left-aligned single column.
- [ ] Hamburger menu icon displays; triggers 360px side drawer.
- [ ] Parallax is completely disabled (photo static).

### 5.4 Mobile Large (430px) & Small (375px — iPhone SE)
- [ ] 1-column layout for student cards on 375px; 2-column compact on 430px.
- [ ] 1-column layout for project cards.
- [ ] Full-screen (100vw) mobile drawer.
- [ ] Display headline scales down (56px → 40px → 33px) without horizontal clipping.
- [ ] Zero horizontal scrollbar on any page (`overflow-x: hidden` verified).
- [ ] Touch targets are at least 44×44px on all buttons, links, and hamburger.

---

## 6. MOTION & ACCESSIBILITY AUDIT

### 6.1 prefers-reduced-motion Verification
- [ ] Enable OS reduced motion setting.
- [ ] Verify hero photography parallax is completely disabled (static).
- [ ] Verify scroll reveals render elements at `opacity: 1` instantly with zero translate.
- [ ] Verify button and card hover effects remove translation (color change only).
- [ ] Verify Lightbox opens instantly with zero scale zoom.
- [ ] Verify NavDrawer appears instantly with zero slide transition.

### 6.2 WCAG 2.1 AA Compliance Checklist
- [ ] Text contrast on Paper White: Ink Black (21:1, AAA), Soft Graphite (5.74:1, AA).
- [ ] Text contrast on Warm Parchment: Ink Black (19.8:1, AAA).
- [ ] Text contrast on Ink Black surfaces: White text (21:1, AAA).
- [ ] Focus indicators visible with at least 3:1 contrast against background.
- [ ] Exactly one `<h1>` per page.
- [ ] Proper semantic landmarks: `<header>`, `<nav>`, `<main id="main-content">`, `<footer>`, `<article>`.
- [ ] All images have descriptive `alt` text; decorative images have `alt=""`.
- [ ] Lightbox has `role="dialog"`, `aria-modal="true"`, and `aria-label`.
- [ ] NavDrawer has `role="dialog"`, `aria-modal="true"`.

---

## 7. PERFORMANCE & CORE WEB VITALS

- [ ] **Lighthouse Mobile Performance:** Score ≥ 90 on simulated 4G mobile.
- [ ] **Lighthouse Mobile Accessibility:** Score ≥ 95.
- [ ] **Lighthouse Mobile Best Practices:** Score ≥ 90.
- [ ] **Lighthouse Mobile SEO:** Score ≥ 90.
- [ ] **LCP (Largest Contentful Paint):** < 2.5s on mobile (Hero photo priority verified).
- [ ] **CLS (Cumulative Layout Shift):** < 0.05 across all viewports.
- [ ] **INP (Interaction to Next Paint):** < 150ms during drawer and lightbox interactions.
- [ ] **Image Optimization:** All images served in WebP or AVIF format. Zero raw PNG/JPEG > 200KB.

---

## 8. SEO & SOCIAL SHARE AUDIT

- [ ] Every page has unique `<title>` matching template: `%s | STI 2026`.
- [ ] Every page has unique, compelling `<meta name="description">` (140–160 chars).
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) verified on all routes.
- [ ] Social share card image is 1200×630px.
- [ ] `robots.txt` generated and permits public crawling.
- [ ] `sitemap.xml` generated automatically and covers all SSG routes.
- [ ] `<html lang="id">` declared on root layout.

---

## 9. PRIVACY & DATA INTEGRITY AUDIT

- [ ] **100% Consent Verification:** Zero students appear on site without signed/verified consent (`consentPublic: true`).
- [ ] **Zero NIM Leak:** No student identification numbers appear anywhere in HTML source or data files.
- [ ] **Zero Phone / Address Leak:** No phone numbers, residential addresses, or private messaging IDs present.
- [ ] **Zero Academic Leak:** No GPAs, course marks, or academic transcripts rendered.
- [ ] **External Links Security:** All external student links are verified live and safe.
- [ ] **Removal Mechanism Operational:** Verified procedure for taking down or editing any student record upon request.
