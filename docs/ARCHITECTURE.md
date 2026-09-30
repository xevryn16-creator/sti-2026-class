# ARCHITECTURE.md
> STI 2026 — Sistem dan Teknologi Informasi
> Digital Yearbook & Class Portfolio
> System & Technical Architecture Specification

---

## 1. REPOSITORY & IMPLEMENTATION STATUS

> [!IMPORTANT]
> **CURRENT REPOSITORY STATE: Implementation Phase — Phases 1–6 built, Phase 7 audits in progress**
> - `package.json`, `tsconfig.json`, and `next.config.ts` exist; the approved stack is installed.
> - `src/` (app, components, styles, data, lib, hooks, types) and `public/` (images, og, icons) exist.
> - **Source of Truth Rule:** `docs/DESIGN.md` remains the **sole canonical design system document**.
> - Production build passes: 11/11 routes prerendered; TypeScript strict mode passes.
> - Implemented deviations from the original proposal are documented in §2.2 below.

### 1.1 Actual Repository State (CURRENT)
```text
/
├── .vscode/               ← Editor configuration
├── docs/                  ← Complete project documentation
│   ├── PRD.md             ← Product requirements & goals
│   ├── DESIGN.md          ← Sole canonical visual design system & token source of truth
│   ├── ARCHITECTURE.md    ← System architecture (this document)
│   ├── CONTENT.md         ← Content field schemas & editorial rules
│   ├── DATA_MODEL.md      ← Static data schemas & relationships
│   ├── MOTION.md          ← Motion specifications & easing rules
│   ├── TASKS.md           ← Atomic implementation task breakdown
│   ├── ROADMAP.md         ← Phased implementation roadmap & blockers
│   ├── QA.md              ← Comprehensive quality assurance checklist
│   └── LICENSES.md        ← Third-party license audit & status
├── .gitignore             ← Version control ignore rules
└── README.md              ← High-level project introduction
```

---

## 2. TECHNOLOGY STACK ARCHITECTURE

### 2.1 Stack Decisions (Proposed vs Status)

| Layer | Proposed Technology | Justification | Current Status |
|-------|---------------------|---------------|----------------|
| **Core Runtime / Framework** | Next.js 15 (App Router, React 19) | Native Static Site Generation (SSG), React Server Components (RSC) for zero-JS static content, built-in image & font optimization. | `USED` (next 15.5.27, react 19.3.0) |
| **Language** | TypeScript 5.x | Strict end-to-end type safety mapping directly to `DATA_MODEL.md` schemas. | `USED` (5.9.3, strict + noUncheckedIndexedAccess) |
| **Styling** | Vanilla CSS (CSS Custom Properties) | Direct 1:1 mapping of `docs/DESIGN.md` tokens; zero runtime CSS-in-JS overhead; absolute styling control without utility baggage. | `USED` |
| **Animation Engine** | Native CSS transitions/keyframes + IntersectionObserver + rAF-throttled scroll listener | Editorial-grade parallax, weighted scroll reveals; hardware-accelerated transforms; strict `prefers-reduced-motion` integration. | `USED — GSAP REJECTED` (all documented patterns M/R/L implemented natively; zero animation dependencies) |
| **Typography Loading** | Geist via `next/font/google` (fallback: Inter) | Automated self-hosting, zero layout shift (size-adjust), preloaded weights 400/500 with stylistic sets `ss01, ss03, ss04`. | `USED` |
| **Asset Optimization** | Next.js Image Component (`next/image`) | Automated WebP/AVIF conversion, intrinsic aspect ratios, responsive `srcset`, priority LCP loading. | `USED` (wrapped by `SafeImage` with editorial fallback) |
| **Icon Library** | Lucide React | Clean, uniform 1.75px line glyphs matching Beau's restrained aesthetic. Strictly one icon set. | `USED` (lucide-react 1.49.0) |
| **Data Layer** | Local Static JSON Files (`src/data/`) + `src/lib/data.ts` | Zero database overhead, fully auditable in version control, human-editable, tamper-proof static builds. | `USED` (with PII firewall + consent filtering + referential integrity validation) |
| **Hosting & Deployment** | Vercel / Cloudflare Pages / Static CDN | Ultra-fast global edge caching, zero server maintenance costs, instant immutable rollbacks. | `[DEPLOYMENT TARGET] — PENDING APPROVAL` |

---

### 2.2 Implemented Deviations from Original Proposal (per Execution Rule §30 — documented, not silent)

| # | Original proposal | Implemented reality | Rationale |
|---|-------------------|---------------------|-----------|
| D1 | GSAP + ScrollTrigger for parallax/reveals | Native CSS + IntersectionObserver + rAF scroll listener | Authorization brief §03 mandates the native path unless documented motion is impossible natively; all M/R/L patterns are implemented natively. Zero animation dependencies. |
| D2 | `useParallax` receives a ref from its parent | `ParallaxContainer` owns its ref internally | Keeps `HeroSection` a React Server Component (no `'use client'` needed for the text layer); only the photo layer is a client island. |
| D3 | Scroll reveals via per-component wrappers | Single `ScrollReveal` client component observing every `[data-reveal]` node + CSS hidden states gated by an inline bootstrap (`data-reveal-ready`) | Reveals server-rendered content without making cards client components; no-JS and reduced-motion users never see hidden content. |
| D4 | `validateDatabaseIntegrity` throws on unconsented references | Throws on **unknown** slugs; **filters** unconsented ones downstream | A student withdrawing consent must never break the build (DATA_MODEL §3.2 privacy rule); unknown slugs remain fatal typos. |
| D5 | Empty `photo`/`coverImage` fail schema validation | Treated as "use documented fallback" | ARCHITECTURE §8.1 defines designed fallbacks (monogram, typographic cover) for exactly these cases; rejecting them would make fallbacks unreachable. |
| D6 | App structure shows `hooks/` with parallax + reveal hooks | Kept 1:1 (`useReducedMotion`, `useInView`, `useParallax`) | Matches the documented structure; `useInView` is used by the reveal system's API surface. |

---

## 3. PROPOSED APPLICATION STRUCTURE

> [!NOTE]
> All paths below represent the **planned implementation structure** once Phase 1 commences. No implementation files currently exist.

```text
/
├── public/                                ← PROPOSED: Static public assets
│   ├── favicon.ico                        ← Site favicon
│   ├── icon.svg                           ← Vector app icon
│   ├── apple-touch-icon.png               ← iOS touch icon
│   ├── og/                                ← Open Graph social share cards (1200×630)
│   │   ├── og-home.jpg
│   │   ├── og-students.jpg
│   │   └── og-projects.jpg
│   └── images/                            ← Master media assets
│       ├── hero/                          ← Hero landscape photography
│       ├── students/                      ← Student portraits (slug-based naming)
│       ├── projects/                      ← Project covers and showcase media
│       ├── campus/                        ← Campus life and candid photography
│       └── events/                        ← Event posters and archive photos
│
├── src/                                   ← PROPOSED: Application source code
│   ├── app/                               ← Next.js App Router (SSG Pages)
│   │   ├── layout.tsx                     ← Root layout: Geist font, SiteHeader, SiteFooter (T-201)
│   │   ├── page.tsx                       ← Home / Landing: Complete narrative assembly (T-606)
│   │   ├── not-found.tsx                  ← Editorial 404 page (T-205)
│   │   ├── sitemap.ts                     ← Automated static sitemap generator (T-704)
│   │   ├── robots.ts                      ← Robots.txt generator (T-704)
│   │   ├── students/
│   │   │   ├── page.tsx                   ← Student Directory (full grid) (T-405)
│   │   │   └── [slug]/
│   │   │       └── page.tsx               ← Individual Student Profile (SSG) (T-404)
│   │   ├── projects/
│   │   │   ├── page.tsx                   ← Project Showcase index (T-504)
│   │   │   └── [slug]/
│   │   │       └── page.tsx               ← Individual Project Detail (SSG) (T-503)
│   │   ├── memories/
│   │   │   └── page.tsx                   ← Campus life photo stories & gallery
│   │   ├── events/
│   │   │   └── page.tsx                   ← Events & gatherings archive (T-602)
│   │   └── timeline/
│   │       └── page.tsx                   ← Chronological journey (2022–2026) (T-604)
│   │
│   ├── components/                        ← Strict 4-tier component architecture
│   │   ├── foundation/                    ← Primitives: Typography, Button, Container, etc. (T-105..T-111)
│   │   ├── content/                       ← Data-driven cards, grids, lists (T-402, T-502, T-506A, etc.)
│   │   ├── experience/                    ← Interactive layers: Lightbox (T-506B), Parallax, Reveal
│   │   └── layout/                        ← Header, Footer, Hero, NavDrawer (T-202, T-204, T-301)
│   │
│   ├── styles/                            ← Vanilla CSS architecture
│   │   ├── tokens.css                     ← CSS Custom Properties from docs/DESIGN.md (T-102)
│   │   ├── reset.css                      ← Modern CSS reset (T-103)
│   │   ├── typography.css                 ← Font scale and tracking utilities
│   │   ├── layout.css                     ← Grid, container, and section gap classes
│   │   └── globals.css                    ← Base styles, focus rings, root variables
│   │
│   ├── data/                              ← Static JSON data sources
│   │   ├── class.json                     ← Cohort metadata and identity
│   │   ├── students.json                  ← Array of Student records (T-401)
│   │   ├── projects.json                  ← Array of Project records (T-501)
│   │   ├── events.json                    ← Array of Event records (T-601)
│   │   ├── memories.json                  ← Array of Memory records (T-505)
│   │   ├── campus.json                    ← Array of CampusPhoto records (T-505)
│   │   ├── achievements.json              ← Array of verified Achievement records (T-601)
│   │   └── timeline.json                  ← Array of Timeline milestones (T-601)
│   │
│   ├── lib/                               ← Pure helper functions & data access layer
│   │   ├── data.ts                        ← Type-safe data accessors, validators & consent filters (T-112)
│   │   ├── utils.ts                       ← Classname formatting and shared helpers
│   │   └── constants.ts                   ← Navigation links and metadata constants
│   │
│   ├── hooks/                             ← Custom React hooks (Client-side only)
│   │   ├── useReducedMotion.ts            ← Detects prefers-reduced-motion media query
│   │   ├── useInView.ts                   ← Intersection Observer for scroll triggers
│   │   └── useParallax.ts                 ← rAF-throttled scroll offset calculator
│   │
│   └── types/                             ← TypeScript definitions
│       └── index.ts                       ← Interfaces mirroring DATA_MODEL.md
│
├── docs/                                  ← Project documentation
├── package.json                           ← PROPOSED: Dependency manifest (Phase 1)
├── tsconfig.json                          ← PROPOSED: Strict TypeScript config
└── next.config.ts                         ← PROPOSED: Next.js build & image config
```

---

## 4. ROUTE ARCHITECTURE & PAGE SPECIFICATIONS

| Route | Page Title | SSG Data Source | Key UI Components | Route Decision Status |
|-------|------------|-----------------|-------------------|-----------------------|
| `/` | STI 2026 — Sistem dan Teknologi Informasi | `class.json`, `students.json`, `projects.json` via `src/lib/data.ts` | `HeroSection`, `ClassIdentity`, `FeaturedStudents`, `FeaturedProjects`, `ClosingSection` | CONFIRMED (T-606) |
| `/students` | Angkatan — Mahasiswa STI 2026 | `students.json` | `StudentGrid`, `StudentCard`, Filter/Search bar | CONFIRMED (T-405) |
| `/students/[slug]` | `[Student Name] — STI 2026` | `students.json` (filtered by slug) | `StudentProfile`, `ProjectCard`, `SocialLinks` | `PROPOSED (Full Page SSG) — PENDING APPROVAL` (T-404) |
| `/projects` | Karya — Proyek STI 2026 | `projects.json` | `ProjectShowcase`, `ProjectCard` | CONFIRMED (T-504) |
| `/projects/[slug]` | `[Project Title] — Proyek STI 2026` | `projects.json` (filtered by slug) | `ProjectDetail`, `GradientFrame`, `TeamList` | `PROPOSED (Full Page SSG) — PENDING APPROVAL` (T-503) |
| `/memories` | Kenangan & Kehidupan Kampus | `memories.json`, `campus.json` | `GalleryGrid`, `MemoryCard`, `GalleryLightbox` | CONFIRMED (T-506A, T-506B) |
| `/events` | Acara & Dokumentasi Angkatan | `events.json` | `EventList`, `EventCard` | CONFIRMED (T-602) |
| `/timeline` | Perjalanan STI 2026 (2022–2026) | `timeline.json` | `TimelineView`, `TimelineEntry` | CONFIRMED (T-604) |
| `/*` (404) | Halaman Tidak Ditemukan | None (static) | Editorial 404 message, return link to `/` | CONFIRMED (T-205) |

---

## 5. COMPONENT ARCHITECTURE & DEPENDENCY DIRECTION

To prevent circular dependencies and spaghetti imports, components follow a strict **unidirectional 4-layer dependency model**:

```text
Layer 1: FOUNDATION (Design Tokens, Primitives, Data Access Layer)
      ↓ (can only be imported by Content, Experience, Layout)
Layer 2: CONTENT (Data-Driven Cards, Grids, Lists)
      ↓ (can only be imported by Layout & Pages)
Layer 3: EXPERIENCE (Interactive Wrappers: Lightbox, Parallax, Reveal)
      ↓ (can wrap Content or Foundation)
Layer 4: LAYOUT & PAGES (Route Assembly)
```

### 5.1 Strict Import Rules
- **Rule 1:** Foundation components **must never** import from Content, Experience, or Layout.
- **Rule 2:** Content components **must never** import from Layout or Pages.
- **Rule 3:** Experience components are pure interaction wrappers (Client Components); they accept `children` or primitives.
- **Rule 4:** Server Components are the default. Client Components (`'use client'`) are strictly restricted to interactive nodes (Lightbox, Mobile Drawer, Parallax Hook).

---

## 6. DATA ARCHITECTURE & FLOW

```text
[Static JSON in src/data/]
           │
           ▼
[Type-Safe Data Access Layer (src/lib/data.ts — T-112)]
  • Validates JSON structure against TypeScript interfaces (DATA_MODEL.md)
  • Filters out unconsented records (consentPublic !== true)
  • Suppresses all private PII (NIM, phone, address, grades)
  • Handles fallbacks for missing/empty fields
  • Sorts chronologically (events, timeline, achievements)
           │
           ▼
[React Server Components (RSC)]
  • Static generation at build time (generateStaticParams)
  • Zero client-side data fetching overhead
  • Zero database connections at runtime
           │
           ▼
[Static HTML + Pre-optimized WebP/AVIF Images]
```

---

## 7. ASSET ARCHITECTURE & SPECIFICATIONS

### 7.1 Directory Layout & Naming Conventions
```text
public/images/
├── hero/
│   └── hero-master.jpg              ← Min 1920×1080, landscape, high dynamic range
├── students/
│   ├── [student-slug]-portrait.jpg   ← Min 800×1066 (3:4 ratio) or 800×800 (1:1)
│   └── ...
├── projects/
│   ├── [project-slug]-cover.jpg      ← Min 1280×720 (16:9 ratio)
│   └── [project-slug]-[01..N].jpg    ← Secondary project screenshots
├── campus/
│   └── campus-[year]-[descriptor].jpg← Min 1200×800 (3:2 or 4:3)
└── events/
    └── event-[year]-[slug].jpg       ← Min 1200×800
```

### 7.2 File Formats & Compression Budgets
- **Master Files (Source):** High-resolution JPEG or PNG stored in version control or designated media drive.
- **Production Delivery:** Automatically converted by Next.js into **AVIF** and **WebP** based on client `Accept` headers.
- **Maximum Asset File Size Budgets:**
  - Hero Background Photo: `< 400 KB` (AVIF/WebP)
  - Student Portrait: `< 120 KB` (AVIF/WebP)
  - Project Cover: `< 180 KB` (AVIF/WebP)
  - Gallery / Campus Photo: `< 200 KB` (AVIF/WebP)
  - Vector Icons: `< 5 KB` (SVG)

---

## 8. FALLBACK & ERROR ARCHITECTURE

### 8.1 Editorial Fallbacks (Zero Fake Data Policy)
| Missing Asset / Data | Fallback UI Behavior |
|----------------------|----------------------|
| **Student Photo Missing** | Renders an elegant typographic monogram card on Warm Parchment (`#f6f4f1`) featuring the student's uppercase initials in Geist 500. Strictly no generic silhouette or cartoon avatar. |
| **Student Bio Missing** | Bio block is omitted from profile. Name, nickname, interest pills, and quote expand naturally without awkward whitespace. |
| **Project Cover Missing** | Renders a minimalist typographic card with project title and Broadcast Gradient hairline accent border. |
| **Campus Photo Load Failure** | Broken image replaced with a discreet message: *"Foto dalam proses digitalisasi arsip."* |
| **Student Quote Missing** | Quote block is completely hidden. |

### 8.2 Error Pages
- **404 Not Found (`src/app/not-found.tsx` — T-205):**
  - Background: Warm Parchment (`#f6f4f1`).
  - Typography: Geist 500 56px "404", Geist 500 20px "Halaman Tidak Ditemukan", Geist 400 17px editorial copy ("Halaman yang Anda tuju tidak ditemukan atau telah diarsipkan ke tempat lain.").
  - Navigation: Single filled pill button returning user to `/`.

---

## 9. DEPLOYMENT & HOSTING SPECIFICATION

- **Current Status:** Vercel-ready (standard SSG build; zero runtime secrets; `NEXT_PUBLIC_SITE_URL` optional for canonical/OG URLs)
- **Build Mode:** Static Site Generation (`output: 'export'` or standard Vercel serverless SSG).
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (or `out/` for static export).
- **Environment Variables:** Zero required runtime secrets (site is 100% public read-only).
- **Caching Headers:**
  - Static HTML: `public, max-age=0, must-revalidate` (instant cache invalidation on deployment).
  - Static Media & Hashed JS/CSS: `public, max-age=31536000, immutable` (maximum edge performance).
