# TASKS.md
> STI 2026 — Sistem dan Teknologi Informasi
> Atomic Implementation Task Catalog

---

## 1. TASK STATUS GOVERNANCE

> [!IMPORTANT]
> - Allowed Status Values: `PLANNED`, `READY`, `IN PROGRESS`, `BLOCKED`, `DONE`.
> - **Absolute Constraint:** Zero implementation tasks may be marked `DONE` during the documentation phase.
> - Only documentation tasks (Phase 0) that have been fully drafted, cross-checked, and verified may be marked `DONE`.

| Status | Definition |
|--------|------------|
| `PLANNED` | Defined and architected; awaiting prior phase completion or approval before commencement. |
| `READY` | All dependencies and assets satisfied; ready to be picked up immediately. |
| `IN PROGRESS` | Actively undergoing implementation. |
| `BLOCKED` | Cannot proceed due to missing real-world content, external input, or unconfirmed stack decision. |
| `DONE` | Completely implemented, type-checked, and verified against acceptance criteria and QA suite. |

---

## 2. PHASE 0 — DOCUMENTATION BLUEPRINT (CURRENT PHASE)

---

**ID:** T-000A  
**TITLE:** Author PRD.md (Product Requirements Document)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Define cohort identity, product goals, non-goals, user journeys, success criteria, and operational constraints.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/PRD.md`  
**DEPENDENCIES:** None  
**IMPLEMENTATION NOTES:** Written with zero fictional demographic data; aligned with the authentic needs of STI 2026.  
**ACCEPTANCE CRITERIA:** Contains product identity, goals, non-goals, 5 user groups, 7-stage user journey, measurable success criteria.  
**TEST REQUIREMENTS:** Consistency audit against all other documentation files.

---

**ID:** T-000B  
**TITLE:** Author & Refine DESIGN.md (Visual Design System)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Establish the definitive visual design system adapted from Beau (Refero Styles) for STI 2026.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/DESIGN.md`  
**DEPENDENCIES:** T-000A  
**IMPLEMENTATION NOTES:** Designated as the sole canonical source of truth for all visual tokens and design rules. Documents what is adopted from Beau, what is explicitly rejected, strict anti-AI-slop rules, tokens, and component specs.  
**ACCEPTANCE CRITERIA:** Complete CSS token block, type scale table, spacing scale, component specifications, and responsive rules.  
**TEST REQUIREMENTS:** Cross-check tokens against ARCHITECTURE.md and MOTION.md.

---

**ID:** T-001  
**TITLE:** Author ARCHITECTURE.md (Technical Architecture)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Document repository reality, proposed tech stack, 4-tier component architecture, asset conventions, and fallbacks.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/ARCHITECTURE.md`  
**DEPENDENCIES:** T-000A, T-000B  
**IMPLEMENTATION NOTES:** Explicitly distinguishes CURRENT repository state from PROPOSED architecture.  
**ACCEPTANCE CRITERIA:** All file paths marked PROPOSED; strict 4-layer unidirectional component hierarchy defined; fallback architecture specified.  
**TEST REQUIREMENTS:** Traceability check against DATA_MODEL.md and TASKS.md.

---

**ID:** T-002  
**TITLE:** Author CONTENT.md (Content Architecture & Privacy)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Define content requirements, schemas, media specifications, fallbacks, and privacy policies for all 10 sections.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/CONTENT.md`  
**DEPENDENCIES:** T-000A, T-000B  
**IMPLEMENTATION NOTES:** Includes Section 10 Closing; bans sensitive PII; defines editorial fallbacks for missing assets.  
**ACCEPTANCE CRITERIA:** All 10 sections specified with purpose, required/optional fields, media constraints, fallbacks, and privacy rules.  
**TEST REQUIREMENTS:** Cross-check every field against DATA_MODEL.md.

---

**ID:** T-003  
**TITLE:** Author DATA_MODEL.md (JSON Schemas & TypeScript Definitions)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Define conceptual data schemas and TypeScript interfaces for all static data entities.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/DATA_MODEL.md`  
**DEPENDENCIES:** T-002  
**IMPLEMENTATION NOTES:** Every field in CONTENT.md has an exact TypeScript interface match.  
**ACCEPTANCE CRITERIA:** 9 entity schemas documented with validation logic and privacy enforcement flags (`consentPublic`).  
**TEST REQUIREMENTS:** 1:1 field parity check against CONTENT.md.

---

**ID:** T-004  
**TITLE:** Author MOTION.md (Motion System & Animation Specs)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Specify timing tokens, easing curves, forbidden patterns, and executable animation rules across Desktop, Tablet, and Mobile.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/MOTION.md`  
**DEPENDENCIES:** T-000B  
**IMPLEMENTATION NOTES:** Every animation specifies trigger, target, duration, easing, distance, direction, tablet behavior, and reduced-motion behavior.  
**ACCEPTANCE CRITERIA:** All animations traceable to UI components with clear UX purpose; reduced motion behavior defined.  
**TEST REQUIREMENTS:** Verification against docs/DESIGN.md editorial restraint principles.

---

**ID:** T-005  
**TITLE:** Author TASKS.md (Atomic Implementation Catalog)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Provide comprehensive, atomic implementation tasks with dependencies, acceptance criteria, and test requirements.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/TASKS.md`  
**DEPENDENCIES:** T-000A through T-004  
**IMPLEMENTATION NOTES:** Uses strictly valid status values (`PLANNED`, `READY`, `IN PROGRESS`, `BLOCKED`, `DONE`).  
**ACCEPTANCE CRITERIA:** Zero implementation tasks marked DONE; all tasks have complete fields.  
**TEST REQUIREMENTS:** Cross-check 1:1 against ROADMAP.md.

---

**ID:** T-006  
**TITLE:** Author ROADMAP.md (Phased Implementation Plan)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Map implementation tasks into logical phases with dependencies, blockers, and verifiable exit criteria.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/ROADMAP.md`  
**DEPENDENCIES:** T-005  
**IMPLEMENTATION NOTES:** Zero orphaned tasks; clear content blockers identified.  
**ACCEPTANCE CRITERIA:** All 8 implementation phases defined with explicit exit criteria.  
**TEST REQUIREMENTS:** Verification against TASKS.md.

---

**ID:** T-007  
**TITLE:** Author QA.md (Quality Assurance Test Suite)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Create discrete, verifiable test checklists covering Functional, Visual, Motion, Accessibility, Performance, SEO, and Content Integrity.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/QA.md`  
**DEPENDENCIES:** T-000A through T-006  
**IMPLEMENTATION NOTES:** Includes specific tests for fallbacks, error states, and tablet responsive behavior.  
**ACCEPTANCE CRITERIA:** Comprehensive checklist items with IDs, priorities (P0/P1/P2), and pass criteria.  
**TEST REQUIREMENTS:** Traceability check against PRD, DESIGN, ARCHITECTURE, and CONTENT.

---

**ID:** T-008  
**TITLE:** Author LICENSES.md (Third-Party Asset & License Audit)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Audit all planned third-party dependencies, fonts, and assets for license compliance and attribution requirements.  
**SCOPE:** Single documentation file  
**FILES/AREA:** `docs/LICENSES.md`  
**DEPENDENCIES:** T-001  
**IMPLEMENTATION NOTES:** Clearly marks all dependencies as PROPOSED and specifies verification requirements upon installation.  
**ACCEPTANCE CRITERIA:** Licenses, permissions, and attribution guidelines documented for Next.js, React, TypeScript, Geist, GSAP, and icons.  
**TEST REQUIREMENTS:** Legal and compatibility check.

---

## 3. PHASE 1 — FOUNDATION IMPLEMENTATION

---

**ID:** T-101  
**TITLE:** Initialize Next.js 15 Application  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Establish the base TypeScript Next.js App Router codebase.  
**SCOPE:** Project root configuration  
**FILES/AREA:** `package.json`, `tsconfig.json`, `next.config.ts`  
**DEPENDENCIES:** Phase 0 approval, Stack Decision A1  
**IMPLEMENTATION NOTES:** Execute `npx -y create-next-app@latest ./` non-interactively with TypeScript, App Router, no TailwindCSS, manual ESLint.  
**ACCEPTANCE CRITERIA:** `npm run dev` and `npm run build` succeed with clean zero-warning output.  
**TEST REQUIREMENTS:** Automated build check.

---

**ID:** T-102  
**TITLE:** Implement CSS Design Tokens from docs/DESIGN.md  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Define CSS Custom Properties exactly matching the Beau token system in docs/DESIGN.md.  
**SCOPE:** Styling  
**FILES/AREA:** `PROPOSED FILE: src/styles/tokens.css`  
**DEPENDENCIES:** T-101  
**IMPLEMENTATION NOTES:** 1:1 token naming. Includes colors, typography scale, spacing, border radii, shadows, and motion timing.  
**ACCEPTANCE CRITERIA:** All variables resolve in browser; no hardcoded styling values used downstream.  
**TEST REQUIREMENTS:** Visual inspection in browser DevTools.

---

**ID:** T-103  
**TITLE:** Implement CSS Reset & Base Typography  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Normalize browser defaults and apply Geist typography globally.  
**SCOPE:** Styling  
**FILES/AREA:** `PROPOSED FILE: src/styles/reset.css`, `PROPOSED FILE: src/styles/globals.css`  
**DEPENDENCIES:** T-102  
**IMPLEMENTATION NOTES:** Enable `font-feature-settings: "ss01" on, "ss03" on, "ss04" on` on `body`.  
**ACCEPTANCE CRITERIA:** All HTML text inherits Geist; browser default margins/paddings reset.  
**TEST REQUIREMENTS:** Render basic HTML tags; verify typography rendering in inspector.

---

**ID:** T-104  
**TITLE:** Configure Geist Font via next/font  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Load Geist at weights 400 and 500 with zero layout shift (FOUT prevention).  
**SCOPE:** Font configuration  
**FILES/AREA:** `PROPOSED FILE: src/app/layout.tsx`  
**DEPENDENCIES:** T-101  
**IMPLEMENTATION NOTES:** `next/font/google` with subsets `['latin']`, display `swap`, preloading enabled.  
**ACCEPTANCE CRITERIA:** Geist font loads locally without external runtime roundtrips.  
**TEST REQUIREMENTS:** Lighthouse font audit; network tab verification.

---

**ID:** T-105  
**TITLE:** Build Foundation Component: Typography  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Reusable type renderer enforcing docs/DESIGN.md scale tokens.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Typography.tsx`  
**DEPENDENCIES:** T-102, T-103, T-104  
**IMPLEMENTATION NOTES:** Props: `variant` (display|heading-lg|heading|heading-sm|subheading|body|caption), `as` (h1..h6, p, span), `color`.  
**ACCEPTANCE CRITERIA:** Renders exact font size, line-height, and letter-spacing for each variant.  
**TEST REQUIREMENTS:** Unit render test covering all 7 type variants.

---

**ID:** T-106  
**TITLE:** Build Foundation Component: Container  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Centered 1200px max-width layout container with responsive horizontal padding.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Container.tsx`  
**DEPENDENCIES:** T-102  
**IMPLEMENTATION NOTES:** Enforces responsive paddings (96px desktop down to 20px mobile).  
**ACCEPTANCE CRITERIA:** Container centers horizontally; never overflows viewport width.  
**TEST REQUIREMENTS:** Responsive viewport resizing test (375px to 1920px).

---

**ID:** T-107  
**TITLE:** Build Foundation Component: Section  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Vertical rhythm block enforcing 72px section gap and surface color switching.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Section.tsx`  
**DEPENDENCIES:** T-102, T-106  
**IMPLEMENTATION NOTES:** Props: `surface` ('paper-white' | 'warm-parchment' | 'ink-black' | 'broadcast-gradient').  
**ACCEPTANCE CRITERIA:** Maintains 72px vertical spacing between sections; surface background applies cleanly.  
**TEST REQUIREMENTS:** Stack multiple sections; verify padding and background contrast.

---

**ID:** T-108  
**TITLE:** Build Foundation Component: Button  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Pill-shaped interactive button (200px radius) with filled and ghost variants.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Button.tsx`  
**DEPENDENCIES:** T-102, T-105  
**IMPLEMENTATION NOTES:** Fully accessible with `:focus-visible` ring. M-01 hover micro-animation.  
**ACCEPTANCE CRITERIA:** Filled button has black background, white text, 200px radius; ghost has transparent background.  
**TEST REQUIREMENTS:** Keyboard Tab focus test; hover transition test.

---

**ID:** T-109  
**TITLE:** Build Foundation Component: Image  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Safe `next/image` wrapper enforcing 6px border-radius, object-fit, and editorial fallbacks.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Image.tsx`  
**DEPENDENCIES:** T-101, T-102  
**IMPLEMENTATION NOTES:** Includes broken-image fallback state; applies `--radius-images`.  
**ACCEPTANCE CRITERIA:** All images clipped to 6px; layout shift prevented; fallback triggers on missing src.  
**TEST REQUIREMENTS:** Test with valid and invalid image URLs.

---

**ID:** T-110  
**TITLE:** Build Foundation Component: Badge  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** 200px radius pill badge for categories, technology tags, and roles.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/Badge.tsx`  
**DEPENDENCIES:** T-102, T-105  
**IMPLEMENTATION NOTES:** Variants: `default` (Warm Parchment fill), `spotlight` (Broadcast Gradient fill).  
**ACCEPTANCE CRITERIA:** Renders text in Geist 500 14px with 200px border radius.  
**TEST REQUIREMENTS:** Visual verification against docs/DESIGN.md Section 4.2.

---

**ID:** T-111  
**TITLE:** Build Foundation Component: GradientFrame  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** 3px Broadcast Gradient outer ring wrapping featured content.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/foundation/GradientFrame.tsx`  
**DEPENDENCIES:** T-102  
**IMPLEMENTATION NOTES:** 6px outer radius, 3px gradient border ring, inner container clipped to 4px.  
**ACCEPTANCE CRITERIA:** Gradient ring rendered cleanly without blurring inner content.  
**TEST REQUIREMENTS:** Visual rendering test with enclosed project screenshot.

---

**ID:** T-112  
**TITLE:** Build Data Access Layer & Integrity Validator (src/lib/data.ts)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Centralized, type-safe data access layer that reads static JSON, enforces schemas, filters by consent, and handles fallbacks.  
**SCOPE:** Utility / Data Layer  
**FILES/AREA:** `PROPOSED FILE: src/lib/data.ts`  
**DEPENDENCIES:** T-101, T-003  
**IMPLEMENTATION NOTES:**  
- Typed accessors for all entities (`getClassData()`, `getStudents()`, `getStudentBySlug()`, `getProjects()`, `getEvents()`, `getMemories()`, `getCampusPhotos()`, `getAchievements()`, `getTimeline()`).
- Validates JSON shape against `DATA_MODEL.md` TypeScript interfaces.
- **Strict Consent Filtering:** Automatically filters out any student or achievement record where `consentPublic !== true`.
- Zero leakage of prohibited PII (phone, address, NIM, grades).
- Provides fallback values when optional fields are missing (e.g. missing bio, missing project link).
**ACCEPTANCE CRITERIA:** All data helper functions return strictly typed data; unconsented records are never returned; build does not fail on empty arrays.  
**TEST REQUIREMENTS:** Unit tests covering getter functions, consent filtering, and empty data handling.

---

## 4. PHASE 2 — LAYOUT, SHELL & NAVIGATION

---

**ID:** T-201  
**TITLE:** Build Root Application Layout  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Assemble root HTML structure, metadata defaults, skip link, SiteHeader, and SiteFooter.  
**SCOPE:** Layout  
**FILES/AREA:** `PROPOSED FILE: src/app/layout.tsx`  
**DEPENDENCIES:** T-104, T-202, T-204  
**IMPLEMENTATION NOTES:** Includes `<html lang="id">` and accessible `#main-content` target.  
**ACCEPTANCE CRITERIA:** All routes inherit header, footer, and font; skip link bypasses navigation.  
**TEST REQUIREMENTS:** Keyboard Tab from address bar lands on skip link.

---

**ID:** T-202  
**TITLE:** Build SiteHeader Component  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Sticky 72px navigation header with wordmark, links, and mobile menu button.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/layout/SiteHeader.tsx`  
**DEPENDENCIES:** T-105, T-108  
**IMPLEMENTATION NOTES:** Sticky position with subtle bottom border. Desktop shows full links; `< 1024px` shows hamburger.  
**ACCEPTANCE CRITERIA:** Remains sticky on scroll; collapses to hamburger at `< 1024px`.  
**TEST REQUIREMENTS:** Scroll test; breakpoint resize test.

---

**ID:** T-203  
**TITLE:** Build NavDrawer Mobile Navigation  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Off-canvas mobile navigation drawer with accessible focus trap.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/layout/NavDrawer.tsx`  
**DEPENDENCIES:** T-202  
**IMPLEMENTATION NOTES:** Slides in from right (L-04). Traps focus; closes on ESC or overlay click; locks background scroll.  
**ACCEPTANCE CRITERIA:** Fully accessible dialog (`role="dialog"`, `aria-modal="true"`); closes on ESC.  
**TEST REQUIREMENTS:** Keyboard navigation test; scroll-lock verification.

---

**ID:** T-204  
**TITLE:** Build SiteFooter Component  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Editorial footer presenting cohort program attribution, copyright, and verified links.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/layout/SiteFooter.tsx`  
**DEPENDENCIES:** T-105, T-106  
**IMPLEMENTATION NOTES:** Warm Parchment background; clean typographic hierarchy.  
**ACCEPTANCE CRITERIA:** Displays copyright "© 2026 STI 2026"; links are functional.  
**TEST REQUIREMENTS:** Link integrity and contrast test.

---

**ID:** T-205  
**TITLE:** Build Editorial 404 Not Found Page (src/app/not-found.tsx)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Deliver a cohesive, dignified 404 error experience aligned with Beau visual standards.  
**SCOPE:** Page  
**FILES/AREA:** `PROPOSED FILE: src/app/not-found.tsx`  
**DEPENDENCIES:** T-105, T-106, T-107, T-108  
**IMPLEMENTATION NOTES:**  
- Warm Parchment canvas (`#f6f4f1`).
- Display typography: Geist 500 56px "404", Subheading Geist 500 20px "Halaman Tidak Ditemukan".
- Editorial copy: "Halaman yang Anda tuju tidak ditemukan atau telah diarsipkan ke tempat lain."
- Navigation: Single filled pill button returning user to Beranda (`/`).
- Traceable to `ARCHITECTURE.md` Section 8.2 and `QA.md` test `FB-07`.
**ACCEPTANCE CRITERIA:** Navigating to any invalid route renders the custom 404 page; return button navigates to `/`; no generic browser error screen; fully responsive and accessible.  
**TEST REQUIREMENTS:** Navigate to `/students/unknown-slug` and verify custom 404 display and return CTA.

---

## 5. PHASE 3 — HERO SECTION IMPLEMENTATION

---

**ID:** T-301  
**TITLE:** Build HeroSection Component Architecture  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Full-viewport hero assembling photographic background, display typography, and primary CTA.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/layout/HeroSection.tsx`  
**DEPENDENCIES:** T-105, T-106, T-107, T-108, T-109  
**IMPLEMENTATION NOTES:** Height set to `100svh`. Text overlay positioned with high editorial legibility.  
**ACCEPTANCE CRITERIA:** Fills viewport; typography scales gracefully down to mobile.  
**TEST REQUIREMENTS:** Responsive visual audit across breakpoints.

---

**ID:** T-302  
**TITLE:** Integrate Production Hero Photography  
**PRIORITY:** P0  
**STATUS:** BLOCKED — [CONTENT NEEDED] (Hero photo from class)  
**PURPOSE:** Place authentic, high-resolution hero photo from cohort archives.  
**SCOPE:** Asset integration  
**FILES/AREA:** `public/images/hero/hero-master.jpg`  
**DEPENDENCIES:** T-301, Hero photo submission  
**IMPLEMENTATION NOTES:** Min 1920×1080px WebP/AVIF. Preloaded with `priority` attribute.  
**ACCEPTANCE CRITERIA:** Hero image achieves LCP < 2.5s on mobile networks.  
**TEST REQUIREMENTS:** Lighthouse LCP audit.

---

**ID:** T-303  
**TITLE:** Implement Desktop Hero Parallax (L-01)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Photography parallax scrolling at 0.35× speed on desktop.  
**SCOPE:** Experience wrapper  
**FILES/AREA:** `PROPOSED FILE: src/components/experience/ParallaxContainer.tsx`, `PROPOSED FILE: src/hooks/useParallax.ts`  
**DEPENDENCIES:** T-301, T-302  
**IMPLEMENTATION NOTES:** rAF-throttled. Disabled at `< 1024px` and when `prefers-reduced-motion: reduce`.  
**ACCEPTANCE CRITERIA:** Photo moves smoothly behind text on desktop; static on tablet/mobile; static with reduced motion.  
**TEST REQUIREMENTS:** Scroll performance test (60fps); reduced motion toggle test.

---

**ID:** T-304  
**TITLE:** Implement Hero Text Entrance Animation (L-02)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Single-mount entrance animation for hero headline, subhead, and CTA.  
**SCOPE:** Animation  
**FILES/AREA:** `PROPOSED FILE: src/components/layout/HeroSection.tsx`  
**DEPENDENCIES:** T-301  
**IMPLEMENTATION NOTES:** Staggered spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`). Suppressed with reduced motion.  
**ACCEPTANCE CRITERIA:** Elements animate exactly once on initial load; immediate visibility if reduced motion enabled.  
**TEST REQUIREMENTS:** Page refresh visual check; reduced motion verification.

---

## 6. PHASE 4 — STUDENT EXPERIENCE (DIRECTORY & PROFILES)

---

**ID:** T-401  
**TITLE:** Compile Static Student Data (`students.json`)  
**PRIORITY:** P0  
**STATUS:** BLOCKED — [CONTENT NEEDED] (Student submissions & consent forms)  
**PURPOSE:** Create the type-safe static data store for all cohort students.  
**SCOPE:** Data file  
**FILES/AREA:** `PROPOSED FILE: src/data/students.json`  
**DEPENDENCIES:** T-003, T-112, Cohort data collection  
**IMPLEMENTATION NOTES:** All entries require `consentPublic: boolean`. Strict exclusion of prohibited PII.  
**ACCEPTANCE CRITERIA:** Valid JSON matching `StudentEntity` interface; zero unconsented records set to true.  
**TEST REQUIREMENTS:** Build-time schema validation script via `src/lib/data.ts`.

---

**ID:** T-402  
**TITLE:** Build StudentCard Component  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Directory card with photo, name, nickname, interest tags, and M-03 hover elevation.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/content/StudentCard.tsx`  
**DEPENDENCIES:** T-105, T-109, T-110  
**IMPLEMENTATION NOTES:** Portrait aspect ratio; monogram fallback if photo is unavailable.  
**ACCEPTANCE CRITERIA:** Renders student data; navigates to `/students/[slug]`; accessible keyboard focus.  
**TEST REQUIREMENTS:** Screen reader test; keyboard Tab+Enter navigation.

---

**ID:** T-403  
**TITLE:** Build StudentGrid Component with Stagger Reveal  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Responsive multi-column grid (4/3/2/1 col) with scroll stagger reveal (R-02).  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/content/StudentGrid.tsx`  
**DEPENDENCIES:** T-402  
**IMPLEMENTATION NOTES:** 4 cols (≥ 1280px), 3 cols (1024px), 2 cols (768px), 2 cols compact (430px), 1 col (375px).  
**ACCEPTANCE CRITERIA:** Correct column counts at all breakpoints; zero horizontal layout shift.  
**TEST REQUIREMENTS:** Multi-device responsive test.

---

**ID:** T-404  
**TITLE:** Build Individual StudentProfile Page (SSG)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Dedicated full-page biographical view linking student projects, quote, and social profiles.  
**SCOPE:** Page & Component  
**FILES/AREA:** `PROPOSED FILE: src/app/students/[slug]/page.tsx`, `PROPOSED FILE: src/components/content/StudentProfile.tsx`  
**DEPENDENCIES:** T-112, T-401, T-402  
**IMPLEMENTATION NOTES:** Uses `generateStaticParams()` to pre-render every consented student profile at build time.  
**ACCEPTANCE CRITERIA:** All student fields render; social links open securely in new tab; invalid slug returns 404.  
**TEST REQUIREMENTS:** SSG build verification; 404 error state check.

---

**ID:** T-405  
**TITLE:** Build Student Directory Page (`/students`)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Full cohort directory page with category filter tags.  
**SCOPE:** Page  
**FILES/AREA:** `PROPOSED FILE: src/app/students/page.tsx`  
**DEPENDENCIES:** T-112, T-401, T-403  
**IMPLEMENTATION NOTES:** Section heading stack followed by `StudentGrid`.  
**ACCEPTANCE CRITERIA:** Displays all consented students; search/filter narrows list cleanly.  
**TEST REQUIREMENTS:** Filter functionality test; empty filter state test.

---

## 7. PHASE 5 — PROJECTS & CAMPUS LIFE SHOWCASE

---

**ID:** T-501  
**TITLE:** Compile Static Project Data (`projects.json`)  
**PRIORITY:** P1  
**STATUS:** BLOCKED — [CONTENT NEEDED] (Student project submissions)  
**PURPOSE:** Static data store for capstones, hackathon projects, and software builds.  
**SCOPE:** Data file  
**FILES/AREA:** `PROPOSED FILE: src/data/projects.json`  
**DEPENDENCIES:** T-003, T-112, Project data submission  
**IMPLEMENTATION NOTES:** Schema matches `ProjectEntity`. Team members link to `students.json` slugs.  
**ACCEPTANCE CRITERIA:** Valid JSON; team member slugs cross-reference existing students.  
**TEST REQUIREMENTS:** Build integrity check via `src/lib/data.ts`.

---

**ID:** T-502  
**TITLE:** Build ProjectCard Component  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Showcase card with 16:9 cover, title, team member names, tech badges, and M-04 hover.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/content/ProjectCard.tsx`  
**DEPENDENCIES:** T-105, T-109, T-110, T-111  
**IMPLEMENTATION NOTES:** Featured projects receive `GradientFrame` wrapper.  
**ACCEPTANCE CRITERIA:** Cover image scales on hover; links navigate to `/projects/[slug]`.  
**TEST REQUIREMENTS:** Visual and interaction test.

---

**ID:** T-503  
**TITLE:** Build Individual ProjectDetail Page (SSG)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Dedicated case-study page with full description, tech stack, team list, and live links.  
**SCOPE:** Page & Component  
**FILES/AREA:** `PROPOSED FILE: src/app/projects/[slug]/page.tsx`, `PROPOSED FILE: src/components/content/ProjectDetail.tsx`  
**DEPENDENCIES:** T-112, T-501, T-502  
**IMPLEMENTATION NOTES:** Static generation via `generateStaticParams()`. Team member names link back to student profiles.  
**ACCEPTANCE CRITERIA:** Pre-renders all projects; team links work; external demo links open safely.  
**TEST REQUIREMENTS:** Static build verification; link security audit (`rel="noopener noreferrer"`).

---

**ID:** T-504  
**TITLE:** Build Project Showcase Index Page (`/projects`)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Comprehensive project catalog with category filters.  
**SCOPE:** Page  
**FILES/AREA:** `PROPOSED FILE: src/app/projects/page.tsx`  
**DEPENDENCIES:** T-112, T-501, T-502  
**IMPLEMENTATION NOTES:** 3-column desktop grid collapsing to 1-column mobile.  
**ACCEPTANCE CRITERIA:** Renders all projects; responsive grid adapts cleanly.  
**TEST REQUIREMENTS:** Breakpoint visual audit.

---

**ID:** T-505  
**TITLE:** Compile Campus Life & Memory Data (`campus.json`, `memories.json`)  
**PRIORITY:** P2  
**STATUS:** BLOCKED — [CONTENT NEEDED] (Cohort photo archives)  
**PURPOSE:** Static data stores for candid moments and curated photo stories.  
**SCOPE:** Data files  
**FILES/AREA:** `PROPOSED FILE: src/data/campus.json`, `PROPOSED FILE: src/data/memories.json`  
**DEPENDENCIES:** T-003, T-112, Photo archive submissions  
**IMPLEMENTATION NOTES:** All photos include accessible `alt` descriptions.  
**ACCEPTANCE CRITERIA:** Valid JSON; referenced images exist in `/public/images/campus/`.  
**TEST REQUIREMENTS:** File existence validator.

---

**ID:** T-506A  
**TITLE:** Build MemoryCard & GalleryGrid Components  
**PRIORITY:** P2  
**STATUS:** DONE  
**PURPOSE:** Visual presentation cards and responsive grid for campus life candid photos and curated photo stories.  
**SCOPE:** Components  
**FILES/AREA:** `PROPOSED FILE: src/components/content/MemoryCard.tsx`, `PROPOSED FILE: src/components/content/GalleryGrid.tsx`  
**DEPENDENCIES:** T-105, T-109, T-112, T-505  
**IMPLEMENTATION NOTES:**  
- `MemoryCard`: Displays 4:3 or 3:2 photograph with 6px border-radius, subtle caption in Geist 400 14px, and date metadata. Hover scales image 1.04× (M-05).
- `GalleryGrid`: Responsive masonry or balanced column layout (3 cols desktop, 2 cols tablet, 1 col mobile). Passes photo index on click/Enter to trigger lightbox.
**ACCEPTANCE CRITERIA:** Cards render photos crisply; grid responds without layout breaks; click/Enter triggers open event with photo ID/index.  
**TEST REQUIREMENTS:** Responsive column test; keyboard focus test on card triggers.

---

**ID:** T-506B  
**TITLE:** Build GalleryLightbox Component (Modal Interaction & Touch Swipe)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Accessible, full-screen modal photo viewer with keyboard navigation, gesture controls, and focus management (L-03, L-04).  
**SCOPE:** Experience wrapper  
**FILES/AREA:** `PROPOSED FILE: src/components/experience/GalleryLightbox.tsx`  
**DEPENDENCIES:** T-109, T-506A  
**IMPLEMENTATION NOTES:**  
- **Accessible Dialog:** Rendered as `role="dialog"`, `aria-modal="true"`, with `aria-label="Penampil Foto Kenangan"`.
- **Focus Trap:** When open, Tab and Shift+Tab strictly cycle within active modal controls (Prev, Next, Close).
- **ESC Key Close:** Pressing `Escape` key immediately closes the lightbox.
- **Keyboard Arrow Navigation:** Pressing `ArrowRight` navigates to next photo; `ArrowLeft` navigates to previous photo.
- **Focus Restoration:** Upon modal close, keyboard focus returns precisely to the thumbnail button that triggered the modal.
- **Document Scroll Lock:** Sets `document.body.style.overflow = 'hidden'` while modal is active; restores cleanly on close/unmount.
- **Mobile Touch Swipe:** Detects horizontal touch delta; left swipe advances to next photo, right swipe returns to previous.
- **Reduced Motion Consideration:** Instant image transition with zero scale/fade zoom when `prefers-reduced-motion: reduce`.
**ACCEPTANCE CRITERIA:** Fulfills all 8 interaction requirements above; passes QA tests `F-GAL-01` through `F-GAL-07` and `A-K05` through `A-K09`.  
**TEST REQUIREMENTS:** Full keyboard accessibility test; touch swipe emulation test; screen reader announcement test.

---

## 8. PHASE 6 — EVENTS, ACHIEVEMENTS, TIMELINE & HOMEPAGE ASSEMBLY

---

**ID:** T-601  
**TITLE:** Compile Events, Achievements & Timeline Data  
**PRIORITY:** P2  
**STATUS:** BLOCKED — [CONTENT NEEDED] (Historical class records)  
**PURPOSE:** Static data compilation for events (`events.json`), achievements (`achievements.json`), and timeline milestones (`timeline.json`).  
**SCOPE:** Data files  
**FILES/AREA:** `PROPOSED FILE: src/data/events.json`, `PROPOSED FILE: src/data/achievements.json`, `PROPOSED FILE: src/data/timeline.json`  
**DEPENDENCIES:** T-003, T-112, Cohort historical archives  
**IMPLEMENTATION NOTES:**  
- **Workflow Rationale for Atomic Scope:** All three files represent the historical narrative of the cohort (2022–2026), authored and verified in a single collaborative session by the historical archive committee. Keeping them unified prevents task fragmentation while maintaining clear schema separation.
- All achievements must have verified consent.
**ACCEPTANCE CRITERIA:** Valid JSON matching respective entity schemas; zero unconsented achievements.  
**TEST REQUIREMENTS:** Schema validation test via `src/lib/data.ts`.

---

**ID:** T-602  
**TITLE:** Build EventCard & EventList Components  
**PRIORITY:** P2  
**STATUS:** DONE  
**PURPOSE:** Chronological event archive display.  
**SCOPE:** Components  
**FILES/AREA:** `PROPOSED FILE: src/components/content/EventCard.tsx`, `PROPOSED FILE: src/components/content/EventList.tsx`  
**DEPENDENCIES:** T-105, T-109, T-112, T-601  
**IMPLEMENTATION NOTES:** Graceful fallback when poster image is missing.  
**ACCEPTANCE CRITERIA:** Events render chronologically; dates formatted consistently in Indonesian.  
**TEST REQUIREMENTS:** Date formatting check; visual test.

---

**ID:** T-603  
**TITLE:** Build AchievementCard & AchievementList Components  
**PRIORITY:** P2  
**STATUS:** DONE  
**PURPOSE:** Highlight verified competitions, honors, and hackathon wins.  
**SCOPE:** Components  
**FILES/AREA:** `PROPOSED FILE: src/components/content/AchievementCard.tsx`, `PROPOSED FILE: src/components/content/AchievementList.tsx`  
**DEPENDENCIES:** T-105, T-110, T-112, T-601  
**IMPLEMENTATION NOTES:** Recipient names link to student profiles.  
**ACCEPTANCE CRITERIA:** Only consented achievements render; student profile links work.  
**TEST REQUIREMENTS:** Privacy verification check.

---

**ID:** T-604  
**TITLE:** Build TimelineView & TimelineEntry Components  
**PRIORITY:** P2  
**STATUS:** DONE  
**PURPOSE:** Chronological 4-year journey display (alternating desktop, single-column mobile).  
**SCOPE:** Components  
**FILES/AREA:** `PROPOSED FILE: src/components/content/TimelineView.tsx`, `PROPOSED FILE: src/components/content/TimelineEntry.tsx`  
**DEPENDENCIES:** T-105, T-112, T-601  
**IMPLEMENTATION NOTES:** Alternating layout on desktop (≥ 768px); left-aligned single column on mobile (< 768px).  
**ACCEPTANCE CRITERIA:** Milestones display chronologically; responsive layout switches seamlessly.  
**TEST REQUIREMENTS:** Viewport resizing test.

---

**ID:** T-605  
**TITLE:** Build ClosingSection Component (Class Legacy)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Emotional valedictory section honoring the cohort's journey and future aspirations.  
**SCOPE:** Component  
**FILES/AREA:** `PROPOSED FILE: src/components/content/ClosingSection.tsx`  
**DEPENDENCIES:** T-105, T-106, T-107, T-112  
**IMPLEMENTATION NOTES:** Section 10 Closing from CONTENT.md. Confident editorial typography.  
**ACCEPTANCE CRITERIA:** Valedictory statement, sign-off, and closing photography render with high visual impact.  
**TEST REQUIREMENTS:** Visual editorial review.

---

**ID:** T-606  
**TITLE:** Assemble Complete Homepage (src/app/page.tsx)  
**PRIORITY:** P0  
**STATUS:** DONE  
**PURPOSE:** Assemble the definitive, cohesive landing page bringing together the complete cohort narrative defined in PRD Section 4.2.  
**SCOPE:** Page  
**FILES/AREA:** `PROPOSED FILE: src/app/page.tsx`  
**DEPENDENCIES:** T-112, T-301, T-403, T-502, T-605  
**IMPLEMENTATION NOTES:**  
- **Strict Narrative Section Order (PRD Compliant):**
  1. `HeroSection` (T-301..T-304)
  2. `ClassIdentity & Macro Stats` (Data from `class.json` via `src/lib/data.ts`)
  3. `Featured Students Preview` (Curated subset via `StudentCard` / `StudentGrid`)
  4. `Featured Projects Preview` (Curated subset via `ProjectCard` with `GradientFrame`)
  5. `ClosingSection` (T-605 Valedictory & Legacy)
- Consumes typed data via `src/lib/data.ts`.
- Zero placeholder or fake data.
- Responsive across all 5 breakpoint ranges.
- Integrates entrance and scroll reveals per `MOTION.md`.
- No duplicated component logic; reuses Foundation and Content layers cleanly.
**ACCEPTANCE CRITERIA:** Homepage renders all 5 sections in strict PRD order; pre-renders statically with zero client-side fetch waterfalls; meets visual design standards of `docs/DESIGN.md`.  
**TEST REQUIREMENTS:** Full page visual walkthrough; responsive audit from 375px to 1920px; Lighthouse run.

---

## 9. PHASE 7 — MOTION POLISH & ACCESSIBILITY AUDIT

---

**ID:** T-701  
**TITLE:** Implement ScrollReveal Component (R-01, R-02, R-03)  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Intersection Observer client wrapper applying subtle upward fade on scroll.  
**SCOPE:** Experience wrapper  
**FILES/AREA:** `PROPOSED FILE: src/components/experience/ScrollReveal.tsx`, `PROPOSED FILE: src/hooks/useInView.ts`  
**DEPENDENCIES:** T-102, T-004  
**IMPLEMENTATION NOTES:** Immediately bypassed if `prefers-reduced-motion` is detected. Elements already in viewport do not animate.  
**ACCEPTANCE CRITERIA:** Smooth entrance; zero repeat animation on upward scroll; zero motion with reduced motion.  
**TEST REQUIREMENTS:** Reduced motion OS toggle test.

---

**ID:** T-702  
**TITLE:** Execute Comprehensive Accessibility Audit & Remediations  
**PRIORITY:** P0  
**STATUS:** IN PROGRESS — automated audits passed; manual screen-reader & cross-browser walkthrough pending
**PURPOSE:** Guarantee 100% WCAG 2.1 AA compliance across all routes and components.  
**SCOPE:** Entire codebase  
**FILES/AREA:** All components and pages  
**DEPENDENCIES:** Phases 1–6  
**IMPLEMENTATION NOTES:** Audit focus visibility, color contrast, semantic landmarks (`<main>`, `<nav>`, `<footer>`), alt texts, and touch target sizes (≥ 44×44px).  
**ACCEPTANCE CRITERIA:** Zero axe-core violations; 100% keyboard navigable; Lighthouse Accessibility score ≥ 95.  
**TEST REQUIREMENTS:** axe DevTools scan; NVDA/VoiceOver screen reader walkthrough.

---

**ID:** T-703  
**TITLE:** Performance & Core Web Vitals Optimization  
**PRIORITY:** P0  
**STATUS:** IN PROGRESS — static output verified; Lighthouse run on production deployment pending
**PURPOSE:** Ensure site delivers instantaneous static performance on real-world mobile devices.  
**SCOPE:** Entire codebase  
**FILES/AREA:** `next.config.ts`, image assets, bundles  
**DEPENDENCIES:** Phases 1–6  
**IMPLEMENTATION NOTES:** Image compression verification, font preload check, code-splitting client wrappers.  
**ACCEPTANCE CRITERIA:** Mobile Lighthouse Performance ≥ 90; LCP < 2.5s; CLS < 0.05; INP < 150ms.  
**TEST REQUIREMENTS:** Production build Lighthouse run on throttled 4G network.

---

**ID:** T-704  
**TITLE:** SEO, Social Open Graph & Metadata Implementation  
**PRIORITY:** P1  
**STATUS:** DONE  
**PURPOSE:** Implement unique `<title>`, `<meta name="description">`, Open Graph cards, sitemap, and robots.txt.  
**SCOPE:** Metadata & Discovery Subsystem  
**FILES/AREA:** `PROPOSED FILE: src/app/sitemap.ts`, `PROPOSED FILE: src/app/robots.ts`, all `page.tsx`  
**DEPENDENCIES:** Phases 1–6  
**IMPLEMENTATION NOTES:**  
- **Cohesion Rationale for Single Task:** In Next.js App Router, `sitemap.ts` (15 lines), `robots.ts` (10 lines), and `generateMetadata()` form an interconnected, lightweight discovery subsystem. Splitting them into micro-tasks would add overhead without architectural benefit.
- Generates dynamic Open Graph metadata for individual student and project pages.
**ACCEPTANCE CRITERIA:** Every page has a distinct title and description; Open Graph preview renders correctly at 1200×630px; valid sitemap.xml and robots.txt generated at build time.  
**TEST REQUIREMENTS:** Social share preview debugger test; XML sitemap validator.

---

## 10. PHASE 8 — FINAL QUALITY ASSURANCE & RELEASE SIGN-OFF

---

**ID:** T-801  
**TITLE:** Full QA Checklist Verification against QA.md  
**PRIORITY:** P0  
**STATUS:** IN PROGRESS — P0 automated checks executed; full manual matrix pending
**PURPOSE:** Execute and sign off on all test items in `docs/QA.md`.  
**SCOPE:** Entire application  
**FILES/AREA:** `docs/QA.md`  
**DEPENDENCIES:** Phases 1–7  
**IMPLEMENTATION NOTES:** Test across Chrome, Edge, Firefox, and Safari on iOS/Android.  
**ACCEPTANCE CRITERIA:** 100% of P0 and P1 checklist items marked passed in `QA.md`.  
**TEST REQUIREMENTS:** Cross-browser, multi-device manual test suite execution.

---

**ID:** T-802  
**TITLE:** Final Cohort Data & Consent Verification  
**PRIORITY:** P0  
**STATUS:** BLOCKED — Awaiting Final Cohort Committee Sign-Off  
**PURPOSE:** Verify that 100% of published student records have documented consent and zero prohibited PII.  
**SCOPE:** Static data files  
**FILES/AREA:** `src/data/*.json`  
**DEPENDENCIES:** T-401, T-601  
**IMPLEMENTATION NOTES:** Final manual inspection of every JSON record against consent forms.  
**ACCEPTANCE CRITERIA:** Formal written sign-off from STI 2026 class committee; zero data leaks.  
**TEST REQUIREMENTS:** Dual-auditor data verification.
