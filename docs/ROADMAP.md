# ROADMAP.md
> STI 2026 — Sistem dan Teknologi Informasi
> Phased Implementation Roadmap & Dependency Map

---

## 1. ROADMAP OVERVIEW & CURRENT PHASE

```text
PHASE 0 ─── Documentation Blueprint               [CURRENT — AUDIT COMPLETE]
PHASE 1 ─── Design System & Foundation Layer      [DONE]
PHASE 2 ─── Layout, Shell & Navigation            [DONE]
PHASE 3 ─── Editorial Hero Section               [COMPLETE EXCEPT PHOTO ASSET]
PHASE 4 ─── Student Experience (Directory & SSG)  [COMPLETE EXCEPT DATA]
PHASE 5 ─── Projects & Campus Life Showcase       [COMPLETE EXCEPT DATA]
PHASE 6 ─── Events, Timeline, Legacy & Homepage   [COMPLETE EXCEPT DATA]
PHASE 7 ─── Motion Polish, A11y, Performance, SEO [IN PROGRESS]
PHASE 8 ─── Final QA Suite & Release Sign-off     [IN PROGRESS — P0 AUTOMATED CHECKS PASSED]
```

> [!IMPORTANT]
> - **Implementation is underway.** Phase 1–6 code is complete; Phase 7 audits are in progress.
> - Stack confirmed per authorization brief: Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS, Lucide React icons, native CSS + IntersectionObserver motion (no GSAP).
> - Content-dependent tasks (T-302, T-401, T-501, T-505, T-601, T-802) remain blocked on authentic cohort submissions.

---

## 2. PHASE SPECIFICATIONS

---

### PHASE 0 — DOCUMENTATION BLUEPRINT (CURRENT PHASE)

#### Goal
Create an unambiguous, actionable, and 100% consistent implementation specification that allows any developer or AI agent to build the website without guessing key decisions.

#### Task Inventory
| Task ID | Task Title | Status |
|---------|------------|--------|
| **T-000A** | Author PRD.md (Product Requirements Document) | **DONE** |
| **T-000B** | Author & Refine DESIGN.md (Visual Design System from Beau) | **DONE** |
| **T-001** | Author ARCHITECTURE.md (Technical Architecture & Conventions) | **DONE** |
| **T-002** | Author CONTENT.md (Content Specifications & Privacy Policy) | **DONE** |
| **T-003** | Author DATA_MODEL.md (JSON Schemas & TypeScript Definitions) | **DONE** |
| **T-004** | Author MOTION.md (Motion System & Timing Specifications) | **DONE** |
| **T-005** | Author TASKS.md (Atomic Implementation Catalog) | **DONE** |
| **T-006** | Author ROADMAP.md (Phased Implementation Plan) | **DONE** |
| **T-007** | Author QA.md (Comprehensive Quality Assurance Test Suite) | **DONE** |
| **T-008** | Author LICENSES.md (Third-Party Asset & License Audit) | **DONE** |

#### Exit Criteria
- [x] All 10 documentation files authored and cross-referenced.
- [x] Zero contradictions across PRD, DESIGN, ARCHITECTURE, CONTENT, and DATA_MODEL.
- [x] All proposed elements marked `PROPOSED — PENDING APPROVAL`.
- [x] Anti-AI-slop rules, content fallbacks, and privacy policies formally codified.
- [x] `docs/DESIGN.md` established as sole canonical visual source of truth.
- [ ] User gives formal approval to proceed to Phase 1.

---

### PHASE 1 — FOUNDATION & DESIGN SYSTEM PRIMITIVES

#### Goal
Construct the atomic design system in code: tokens, typography, layout wrappers, UI primitives, and the type-safe data access layer. Zero page content or business logic.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-101** | Initialize Next.js 15 Application | P0 | DONE |
| **T-102** | Implement CSS Design Tokens from docs/DESIGN.md | P0 | DONE |
| **T-103** | Implement CSS Reset & Base Typography | P0 | DONE |
| **T-104** | Configure Geist Font via next/font | P0 | DONE |
| **T-105** | Build Foundation Component: Typography | P0 | DONE |
| **T-106** | Build Foundation Component: Container | P0 | DONE |
| **T-107** | Build Foundation Component: Section | P0 | DONE |
| **T-108** | Build Foundation Component: Button | P0 | DONE |
| **T-109** | Build Foundation Component: Image | P0 | DONE |
| **T-110** | Build Foundation Component: Badge | P0 | DONE |
| **T-111** | Build Foundation Component: GradientFrame | P0 | DONE |
| **T-112** | Build Data Access Layer & Integrity Validator (src/lib/data.ts) | P0 | DONE |

#### Dependencies
- User confirmation of Stack Decision A1 (Next.js 15, React 19).
- Icon library selection (A2).

#### Exit Criteria
- All 7 foundation components render cleanly in isolation.
- CSS tokens match `docs/DESIGN.md` 1:1.
- `src/lib/data.ts` compiles cleanly and passes type checks.
- `npm run build` succeeds with zero errors.

---

### PHASE 2 — LAYOUT, SHELL & NAVIGATION

#### Goal
Implement the outer shell of the website — root layout, sticky navigation bar, mobile drawer, footer, and the editorial 404 page. Make the site completely navigable.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-201** | Build Root Application Layout | P0 | DONE |
| **T-202** | Build SiteHeader Component | P0 | DONE |
| **T-203** | Build NavDrawer Mobile Navigation | P1 | DONE |
| **T-204** | Build SiteFooter Component | P1 | DONE |
| **T-205** | Build Editorial 404 Not Found Page (src/app/not-found.tsx) | P1 | DONE |

#### Dependencies
- Phase 1 exit criteria met.
- Navigation label language decision confirmed (`[LANGUAGE] — PENDING APPROVAL`).

#### Exit Criteria
- Desktop sticky navbar functions with smooth link hover.
- `< 1024px` hamburger menu triggers full-screen accessible `NavDrawer`.
- Keyboard navigation traps focus inside open drawer; ESC key closes.
- Skip-to-content link works.
- Navigating to invalid route renders editorial 404 page with return link.

---

### PHASE 3 — EDITORIAL HERO SECTION

#### Goal
Build the signature editorial hero scene — high-resolution cohort photography, display typography, and measured entrance animations.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-301** | Build HeroSection Component Architecture | P0 | DONE |
| **T-302** | Integrate Production Hero Photography | P0 | BLOCKED (Hero photo submission) |
| **T-303** | Implement Desktop Hero Parallax (L-01) | P1 | DONE (native rAF + matchMedia, no GSAP) |
| **T-304** | Implement Hero Text Entrance Animation (L-02) | P1 | DONE (CSS keyframes) |

#### Dependencies
- Phase 2 complete.
- Authentic landscape hero photograph from class committee (`[CONTENT NEEDED]`).
- GSAP license approval for ScrollTrigger (`Mo1`).

#### Exit Criteria
- Hero fills `100svh` seamlessly.
- Parallax scrolls at 0.35× on desktop; completely static on mobile and under reduced motion.
- Mobile LCP < 2.5s.

---

### PHASE 4 — STUDENT EXPERIENCE (DIRECTORY & PROFILES)

#### Goal
Build the core yearbook directory and individual student profile pages with static site generation (SSG).

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-401** | Compile Static Student Data (`students.json`) | P0 | BLOCKED (Data submission & consent) |
| **T-402** | Build StudentCard Component | P1 | DONE |
| **T-403** | Build StudentGrid Component with Stagger Reveal | P1 | DONE |
| **T-404** | Build Individual StudentProfile Page (SSG) | P1 | DONE |
| **T-405** | Build Student Directory Page (`/students`) | P1 | DONE |

#### Dependencies
- Phase 1 data layer (`T-112`) operational.
- Student data collection form completed with verified `consentPublic: true`.
- Student portrait photographs placed in `public/images/students/`.

#### Exit Criteria
- Directory grid renders 4/3/2/1 columns correctly across all breakpoints.
- Zero unconsented students appear anywhere on the site.
- Missing photos render designed initials monogram fallback.
- `generateStaticParams()` pre-renders every consented profile.

---

### PHASE 5 — PROJECTS & CAMPUS LIFE SHOWCASE

#### Goal
Present student engineering capstones, hackathon projects, candid campus photo stories, and the accessible photo lightbox.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-501** | Compile Static Project Data (`projects.json`) | P1 | BLOCKED (Project submissions) |
| **T-502** | Build ProjectCard Component | P1 | DONE |
| **T-503** | Build Individual ProjectDetail Page (SSG) | P1 | DONE |
| **T-504** | Build Project Showcase Index Page (`/projects`) | P1 | DONE |
| **T-505** | Compile Campus Life & Memory Data | P2 | BLOCKED (Photo submissions) |
| **T-506A** | Build MemoryCard & GalleryGrid Components | P2 | DONE |
| **T-506B** | Build GalleryLightbox Component (Modal Interaction & Touch Swipe) | P1 | DONE |

#### Dependencies
- Project details, screenshots, and team member lists collected.
- Campus candid photography collected.
- Data access layer (`T-112`) operational.

#### Exit Criteria
- Project showcase renders with 16:9 covers, tech badges, and team member links.
- Full-screen accessible lightbox opens, navigates via arrow keys/swipes, traps focus, and restores focus upon ESC close.

---

### PHASE 6 — EVENTS, TIMELINE, LEGACY & HOMEPAGE ASSEMBLY

#### Goal
Chronicle class events, verified awards, the 4-year journey timeline, the valedictory closing statement, and assemble the complete landing page.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-601** | Compile Events, Achievements & Timeline Data | P2 | BLOCKED (Historical archives) |
| **T-602** | Build EventCard & EventList Components | P2 | DONE |
| **T-603** | Build AchievementCard & AchievementList Components | P2 | DONE |
| **T-604** | Build TimelineView & TimelineEntry Components | P2 | DONE |
| **T-605** | Build ClosingSection Component (Class Legacy) | P1 | DONE |
| **T-606** | Assemble Complete Homepage (src/app/page.tsx) | P0 | DONE |

#### Dependencies
- Class milestone dates and verified achievement records.
- Class committee valedictory text submission.
- All section components available: `T-301` (Hero), `T-403` (Student Grid/Preview), `T-502` (Project Card/Preview), `T-605` (Closing).

#### Exit Criteria
- Timeline renders alternating on desktop and single-column on mobile.
- Section 10 Closing statement renders with high editorial dignity.
- Homepage (`/`) renders all 5 narrative sections in strict PRD order.

---

### PHASE 7 — MOTION POLISH, ACCESSIBILITY, PERFORMANCE & SEO

#### Goal
Audit and optimize animations, accessibility (WCAG AA), Core Web Vitals, and search/social metadata.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-701** | Implement ScrollReveal Component (R-01..R-03) | P1 | DONE |
| **T-702** | Execute Comprehensive Accessibility Audit & Remediations | P0 | IN PROGRESS |
| **T-703** | Performance & Core Web Vitals Optimization | P0 | IN PROGRESS |
| **T-704** | SEO, Social Open Graph & Metadata Implementation | P1 | DONE |

#### Dependencies
- Phases 1–6 complete.

#### Exit Criteria
- Lighthouse Mobile scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90.
- Zero axe-core accessibility violations.
- All social preview cards generate correctly at 1200×630px.
- Sitemap.xml and robots.txt verified.

---

### PHASE 8 — FINAL QUALITY ASSURANCE & RELEASE SIGN-OFF

#### Goal
Comprehensive cross-browser verification and final cohort committee sign-off.

#### Task Inventory
| Task ID | Task Title | Priority | Status |
|---------|------------|----------|--------|
| **T-801** | Full QA Checklist Verification against QA.md | P0 | IN PROGRESS |
| **T-802** | Final Cohort Data & Consent Verification | P0 | BLOCKED (Committee Sign-off) |

#### Dependencies
- All prior phases complete.

#### Exit Criteria
- 100% of P0/P1 checklist items in `QA.md` passed.
- Formal committee sign-off on 100% consent compliance.
- Public site ready for production deployment.

---

## 3. COMPREHENSIVE DEPENDENCY MATRIX

```text
DECISIONS NEEDED (from User):
├── Stack confirmation (Next.js 15, React 19) ─── blocks T-101
├── Icon library selection ────────────────────── blocks T-110, T-202
├── Language decision (Indonesian recommended) ── blocks T-202, T-405, T-606
└── GSAP license confirmation ─────────────────── blocks T-303, T-701

FOUNDATION CODE BLOCKERS:
└── Data Access Layer (T-112) ─────────────────── blocks T-401, T-404, T-501, T-503, T-601, T-606

CONTENT ASSETS NEEDED (from STI 2026 Cohort Committee):
├── Hero master photograph ────────────────────── blocks T-302
├── Student data + consented portraits ────────── blocks T-401
├── Project summaries + cover visuals ─────────── blocks T-501
├── Campus life & candid photo archives ───────── blocks T-505
├── Historical milestones & verified awards ───── blocks T-601
├── Valedictory closing text ──────────────────── blocks T-605
└── Final publication sign-off ────────────────── blocks T-802
```
