# ARCHITECTURE.md
> STI 2026 — Sistem dan Teknologi Informasi
> Digital Yearbook & Class Portfolio
> System & Technical Architecture Specification

---

## 1. REPOSITORY & IMPLEMENTATION STATUS

> [!IMPORTANT]
> **CURRENT REPOSITORY STATE: Documentation Phase Only (Zero Implementation Files)**
> - No `package.json` exists in the repository.
> - No frontend framework, styling library, or animation packages are installed.
> - No source code (`src/`), styling (`styles/`), or public asset (`public/`) directories exist yet.
> - **All architectural specifications below represent the PROPOSED ARCHITECTURE and are PENDING APPROVAL before Phase 1 installation.**

### 1.1 Actual Repository State (CURRENT)
```text
/
├── .vscode/               ← Editor configuration
├── docs/                  ← Complete project documentation
│   ├── PRD.md             ← Product requirements & goals
│   ├── DESIGN.md          ← Visual design system & token source of truth
│   ├── ARCHITECTURE.md    ← System architecture (this document)
│   ├── CONTENT.md         ← Content field schemas & editorial rules
│   ├── DATA_MODEL.md      ← Static data schemas & relationships
│   ├── MOTION.md          ← Motion specifications & easing rules
│   ├── TASKS.md           ← Atomic implementation task breakdown
│   ├── ROADMAP.md         ← Phased implementation roadmap & blockers
│   ├── QA.md              ← Comprehensive quality assurance checklist
│   └── LICENSES.md        ← Third-party license audit & status
```

---

## 2. TECHNOLOGY STACK ARCHITECTURE

### 2.1 Stack Decisions (Proposed vs Status)

| Layer | Proposed Technology | Justification | Current Status |
|-------|---------------------|---------------|----------------|
| **Core Runtime / Framework** | Next.js 15 (App Router, React 19) | Native Static Site Generation (SSG), React Server Components (RSC) for zero-JS static content, built-in image & font optimization. | `PROPOSED — PENDING APPROVAL` |
| **Language** | TypeScript 5.x | Strict end-to-end type safety mapping directly to `DATA_MODEL.md` schemas. | `PROPOSED — PENDING APPROVAL` |
| **Styling** | Vanilla CSS (CSS Custom Properties) | Direct 1:1 mapping of `DESIGN.md` tokens; zero runtime CSS-in-JS overhead; absolute styling control without utility baggage. | `PROPOSED — PENDING APPROVAL` |
| **Animation Engine** | GSAP 3.x (core + ScrollTrigger) + CSS Transitions | Editorial-grade parallax, weighted scroll reveals; hardware-accelerated transforms; strict `prefers-reduced-motion` integration. | `PROPOSED — PENDING APPROVAL` |
| **Typography Loading** | Geist via `next/font/google` (fallback: Inter) | Automated self-hosting, zero layout shift (size-adjust), preloaded weights 400/500 with stylistic sets `ss01, ss03, ss04`. | `PROPOSED — PENDING APPROVAL` |
| **Asset Optimization** | Next.js Image Component (`next/image`) | Automated WebP/AVIF conversion, intrinsic aspect ratios, responsive `srcset`, priority LCP loading. | `PROPOSED — PENDING APPROVAL` |
| **Icon Library** | Lucide React (or Heroicons) | Clean, uniform 1.5px/1.75px line glyphs matching Beau's restrained aesthetic. Strictly one icon set. | `[ICON LIBRARY] — PENDING APPROVAL` |
| **Data Layer** | Local Static JSON Files (`src/data/`) | Zero database overhead, fully auditable in version control, human-editable, tamper-proof static builds. | `PROPOSED — PENDING APPROVAL` |
| **Hosting & Deployment** | Vercel / Cloudflare Pages / Static CDN | Ultra-fast global edge caching, zero server maintenance costs, instant immutable rollbacks. | `[DEPLOYMENT TARGET] — PENDING APPROVAL` |

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
│   │   ├── layout.tsx                     ← Root layout: Geist font, SiteHeader, SiteFooter
│   │   ├── page.tsx                       ← Home / Landing: Hero, Identity, Highlights, Closing
│   │   ├── not-found.tsx                  ← Editorial 404 page
│   │   ├── sitemap.ts                     ← Automated static sitemap generator
│   │   ├── robots.ts                      ← Robots.txt generator
│   │   ├── students/
│   │   │   ├── page.tsx                   ← Student Directory (full grid)
│   │   │   └── [slug]/
│   │   │       └── page.tsx               ← Individual Student Profile (SSG)
│   │   ├── projects/
│   │   │   ├── page.tsx                   ← Project Showcase index
│   │   │   └── [slug]/
│   │   │       └── page.tsx               ← Individual Project Detail (SSG)
│   │   ├── memories/
│   │   │   └── page.tsx                   ← Campus life photo stories & gallery
│   │   ├── events/
│   │   │   └── page.tsx                   ← Events & gatherings archive
│   │   └── timeline/
│   │       └── page.tsx                   ← Chronological journey (2022–2026)
│   │
│   ├── components/                        ← Strict 4-tier component architecture
│   │   ├── foundation/                    ← Primitives: Typography, Button, Container, etc.
│   │   ├── content/                       ← Data-driven cards, grids, lists
│   │   ├── experience/                    ← Interactive layers: Lightbox, Parallax, Reveal
│   │   └── layout/                        ← Header, Footer, Hero, NavDrawer
│   │
│   ├── styles/                            ← Vanilla CSS architecture
│   │   ├── tokens.css                     ← CSS Custom Properties from DESIGN.md
│   │   ├── reset.css                      ← Modern CSS reset
│   │   ├── typography.css                 ← Font scale and tracking utilities
│   │   ├── layout.css                     ← Grid, container, and section gap classes
│   │   └── globals.css                    ← Base styles, focus rings, root variables
│   │
│   ├── data/                              ← Static JSON data sources
│   │   ├── class.json                     ← Cohort metadata and identity
│   │   ├── students.json                  ← Array of Student records
│   │   ├── projects.json                  ← Array of Project records
│   │   ├── events.json                    ← Array of Event records
│   │   ├── memories.json                  ← Array of Memory & photo records
│   │   ├── achievements.json              ← Array of verified Achievement records
│   │   └── timeline.json                  ← Array of Timeline milestones
│   │
│   ├── lib/                               ← Pure helper functions
│   │   ├── data.ts                        ← Type-safe data accessors & validators
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
| `/` | STI 2026 — Sistem dan Teknologi Informasi | `class.json`, highlights from other files | `HeroSection`, `ClassIdentity`, `FeaturedStudents`, `FeaturedProjects`, `ClosingSection` | CONFIRMED |
| `/students` | Angkatan — Mahasiswa STI 2026 | `students.json` | `StudentGrid`, `StudentCard`, Filter/Search bar | CONFIRMED |
| `/students/[slug]` | `[Student Name] — STI 2026` | `students.json` (filtered by slug) | `StudentProfile`, `ProjectCard`, `SocialLinks` | `PROPOSED (Full Page SSG) — PENDING APPROVAL` |
| `/projects` | Karya — Proyek STI 2026 | `projects.json` | `ProjectShowcase`, `ProjectCard` | CONFIRMED |
| `/projects/[slug]` | `[Project Title] — Proyek STI 2026` | `projects.json` (filtered by slug) | `ProjectDetail`, `GradientFrame`, `TeamList` | `PROPOSED (Full Page SSG) — PENDING APPROVAL` |
| `/memories` | Kenangan & Kehidupan Kampus | `memories.json` | `GalleryGrid`, `MemoryCard`, `GalleryLightbox` | CONFIRMED |
| `/events` | Acara & Dokumentasi Angkatan | `events.json` | `EventList`, `EventCard` | CONFIRMED |
| `/timeline` | Perjalanan STI 2026 (2022–2026) | `timeline.json` | `TimelineView`, `TimelineEntry` | CONFIRMED |
| `/*` (404) | Halaman Tidak Ditemukan | None (static) | Editorial 404 message, return link | CONFIRMED |

### 4.1 Route Decision Note: Full Page vs Modal
- **Student Profile:** Proposed as a dedicated full-page SSG route (`/students/[slug]`) rather than an in-page modal to provide permanent, shareable URLs for student resumes, LinkedIn posts, and professional portfolios.
- **Project Detail:** Proposed as a full-page SSG route (`/projects/[slug]`) to allow comprehensive case-study presentation with multiple screenshots and external links.

---

## 5. COMPONENT ARCHITECTURE & DEPENDENCY DIRECTION

To prevent circular dependencies and spaghetti imports, components follow a strict **unidirectional 4-layer dependency model**:

```text
Layer 1: FOUNDATION (Design Tokens & Primitives)
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

### 5.2 Layer Breakdown

#### Layer 1: Foundation Primitives (`src/components/foundation/`)
- `Typography`: Strict type scale renderer (`display`, `heading-lg`, `heading`, `heading-sm`, `subheading`, `body`, `caption`). Enforces Geist font features.
- `Container`: Centered 1200px max-width layout wrapper with responsive horizontal padding.
- `Section`: Vertical rhythm block enforcing 72px spacing and surface color switching (`paper-white`, `warm-parchment`, `ink-black`, `broadcast-gradient`).
- `Button`: Pill-shaped interactive element (200px radius) with `filled` and `ghost` variants.
- `Badge`: 200px radius pill for metadata tags, roles, and technology indicators.
- `Image`: Safe wrapper around `next/image` enforcing 6px border-radius, aspect-ratio containment, and fallback handling.
- `GradientFrame`: 3px outer Broadcast Gradient ring wrapping featured content.

#### Layer 2: Content Blocks (`src/components/content/`)
- `StudentCard`: Portrait photo, name, nickname, interest badges, and link to profile.
- `StudentGrid`: Responsive 4/3/2/1-column grid.
- `StudentProfile`: Full biographical view with linked projects and social links.
- `ProjectCard`: Cover image, title, team member avatars/names, tech stack badges.
- `ProjectDetail`: Full case-study presentation with media carousel and live links.
- `MemoryCard`: Curated photograph with editorial caption and date metadata.
- `GalleryGrid`: Masonry or balanced photo grid.
- `EventCard`: Chronological event entry with date, poster, and summary.
- `TimelineEntry`: Milestone block with date, description, and connector node.
- `TimelineView`: Vertical journey track (alternating desktop, single-column mobile).

#### Layer 3: Experience Layer (`src/components/experience/`)
- `ParallaxContainer`: Client component providing rAF-throttled scroll offset to hero photography on desktop.
- `ScrollReveal`: Intersection Observer wrapper applying subtle upward translation and fade.
- `GalleryLightbox`: Accessible full-screen modal viewer with touch-swipe and keyboard arrow navigation.
- `NavDrawer`: Slide-in mobile navigation with focus trapping and ESC key support.

#### Layer 4: Layout & Assembled Pages (`src/components/layout/` & `src/app/`)
- `SiteHeader`: Sticky 72px navigation header with wordmark, links, and mobile toggle.
- `SiteFooter`: Editorial conclusion with program attribution, copyright, and verified links.
- `HeroSection`: Full-viewport editorial hero assembling photography, typography, and CTA.

---

## 6. DATA ARCHITECTURE & FLOW

```text
[Static JSON in src/data/]
           │
           ▼
[Type-Safe Data Accessor (src/lib/data.ts)]
  • Validates JSON structure against TypeScript interfaces
  • Filters out unconsented records (consentPublic !== true)
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

### 6.1 Data Validation Rules
1. Every data read passes through `src/lib/data.ts`.
2. Any Student record where `consentPublic !== true` is silently excluded from all queries and static page generation.
3. Every referenced image path is checked at build time; missing images trigger designed editorial fallbacks rather than crashing the build.

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

### 7.3 Responsive Image Breakpoints
All `next/image` invocations must provide explicit `sizes` attributes:
- Student Cards: `sizes="(max-width: 430px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"`
- Project Cards: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"`
- Hero Image: `sizes="100vw" priority`

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
- **404 Not Found (`src/app/not-found.tsx`):**
  - Background: Warm Parchment (`#f6f4f1`).
  - Typography: Geist 500 56px "404", Geist 400 17px editorial copy ("Halaman ini tidak ditemukan atau telah diarsipkan ke tempat lain.").
  - Navigation: Single filled pill button returning user to `/`.

---

## 9. DEPLOYMENT & HOSTING SPECIFICATION

- **Current Status:** `[DEPLOYMENT TARGET] — PENDING APPROVAL`
- **Build Mode:** Static Site Generation (`output: 'export'` or standard Vercel serverless SSG).
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (or `out/` for static export).
- **Environment Variables:** Zero required runtime secrets (site is 100% public read-only).
- **Caching Headers:**
  - Static HTML: `public, max-age=0, must-revalidate` (instant cache invalidation on deployment).
  - Static Media & Hashed JS/CSS: `public, max-age=31536000, immutable` (maximum edge performance).
