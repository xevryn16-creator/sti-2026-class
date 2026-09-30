# sti-2026-class

**STI 2026 — Sistem dan Teknologi Informasi.** Digital yearbook, class portfolio, and historical archive for the STI 2026 cohort.

An editorial, photography-first publication in Bahasa Indonesia: ink on warm parchment, Geist typography, restrained motion — built to feel like a curated monograph, not a template.

## Status

Phases 1–6 of the [implementation roadmap](docs/ROADMAP.md) are complete; Phase 7 audits are in progress. Content-dependent tasks (student data, photography, historical records) are blocked on authentic cohort submissions — the site renders documented editorial fallbacks everywhere and **contains zero fabricated content**.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, SSG) |
| UI | React 19, Server Components by default |
| Language | TypeScript (strict) |
| Styling | Vanilla CSS with design tokens from [docs/DESIGN.md](docs/DESIGN.md) |
| Icons | Lucide React |
| Motion | Native CSS + IntersectionObserver + rAF (no animation libraries) |
| Data | Static JSON in `src/data/` validated by `src/lib/data.ts` |

## Commands

```bash
npm install
npm run dev      # development server
npm run build    # production build (static prerender)
npm run start    # serve the production build
```

## Adding real content

All data lives in human-auditable files under [`src/data/`](src/data/). See [docs/CONTENT.md](docs/CONTENT.md) for field specifications and [docs/DATA_MODEL.md](docs/DATA_MODEL.md) for schemas.

1. **Students** — copy the template entry in [`src/data/students.json`](src/data/students.json), fill real fields, and set `consentPublic: true` **only** after the student signs the publication consent. Drop portraits into `public/images/students/` (3:4, ≥ 800×1066). Profiles and directory pages are generated automatically at build time.
2. **Projects** — fill [`src/data/projects.json`](src/data/projects.json) with real team slugs; covers go in `public/images/projects/` (16:9, ≥ 1280×720).
3. **Photography & history** — fill `campus.json`, `memories.json`, `events.json`, `achievements.json`, `timeline.json`.
4. **Identity text** — statement, valedictory, stats in `class.json`.
5. Set `NEXT_PUBLIC_SITE_URL` before deployment so canonical/OG URLs resolve to the real domain.

The data layer enforces privacy automatically: banned PII keys abort the build, unconsented students never render, and every reference is checked against consented records.

## Documentation

[PRD](docs/PRD.md) · [DESIGN](docs/DESIGN.md) · [ARCHITECTURE](docs/ARCHITECTURE.md) · [CONTENT](docs/CONTENT.md) · [DATA_MODEL](docs/DATA_MODEL.md) · [MOTION](docs/MOTION.md) · [TASKS](docs/TASKS.md) · [ROADMAP](docs/ROADMAP.md) · [QA](docs/QA.md) · [LICENSES](docs/LICENSES.md)
