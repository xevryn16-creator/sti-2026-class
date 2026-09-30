# PRD.md
> STI 2026 — Sistem dan Teknologi Informasi
> Product Requirements Document (PRD)

---

## DOCUMENT METADATA

- **Project:** STI 2026 Digital Yearbook & Class Portfolio
- **Cohort:** Sistem dan Teknologi Informasi, Class of 2026
- **Status:** DRAFT — PENDING FINAL APPROVAL
- **Version:** 1.0.0
- **Document Phase:** Phase 0 (Documentation Blueprint)

---

## 1. PRODUCT IDENTITY & OVERVIEW

### 1.1 What is STI 2026?
STI 2026 is the academic cohort of **Sistem dan Teknologi Informasi (Information Systems and Technology)** graduating in the class year of 2026. This undergraduate program combines computing, systems architecture, business processes, information governance, and software engineering.

### 1.2 What is this Website?
This website is a **permanent, public-facing digital yearbook, cohort portfolio, and living historical archive** for STI 2026. 

Unlike traditional printed yearbooks that become static and inaccessible after graduation, and unlike transient social media posts that get buried in algorithms, this website serves as:
1. **An Enduring Digital Monument:** Preserving the collective identity, shared struggles, milestones, and authentic culture of STI 2026.
2. **A Collective Talent Showcase:** A high-credibility portfolio displaying student projects, technical capabilities, and verified achievements to potential employers, collaborators, and the broader tech industry.
3. **An Archival Memory Capsule:** Documenting campus moments, candid photography, events, and a chronological journey from enrollment through graduation.

### 1.3 Core Experience & Narrative
The primary experience of visiting the STI 2026 website is **deliberate, warm, and editorial**.
- It does **not** feel like a generic SaaS landing page, a whimsical university promotional brochure, or a gamified tech demo.
- It feels like an **exquisitely curated monograph or architectural publication**: confident monochrome ink, warm tactile parchment surfaces, generous whitespace, confident Geist typography, authentic student portraiture, and a singular, theatrical broadcast gradient accent that highlights student excellence.

---

## 2. GOALS & NON-GOALS

### 2.1 Concrete Goals
1. **Cohort Representation:** Provide a permanent profile for every consenting student of STI 2026, showcasing their chosen bio, interests, projects, and professional links.
2. **Project Portfolio:** Showcase cohort-built academic, capstone, competition, and independent software/design projects with clear team attribution and technology tags.
3. **Historical Continuity:** Present an interactive chronological timeline (2022–2026) capturing key academic, social, and institutional milestones.
4. **Authentic Campus Life Archive:** Feature curated, candid photo stories and campus galleries with accessible full-screen lightbox viewing.
5. **Zero Friction Access:** Deliver an ultra-fast, statically pre-rendered public website requiring no authentication, login, or subscriptions.
6. **Privacy by Design:** Enforce strict consent-first publication rules—no student data appears without explicit authorization, and private PII is strictly excluded.
7. **Accessibility & Longevity:** Comply with WCAG 2.1 AA standards so the archive remains accessible to all people and assistive technologies indefinitely.
8. **Performance Excellence:** Achieve mobile Lighthouse scores of ≥ 90 across Performance, Accessibility, Best Practices, and SEO, with LCP < 2.5s.

### 2.2 Explicit Non-Goals
1. **NOT a Learning Management System (LMS) or Academic Portal:** No assignment submissions, course enrollment, grade tracking, or academic administration.
2. **NOT a Social Network:** No user accounts, registration, login sessions, commenting, liking, upvoting, or direct in-app messaging.
3. **NOT a Dynamic Content Management System (CMS):** The site does not include an in-browser admin panel or public editing interface. Content changes are version-controlled via static data files.
4. **NOT an E-Commerce or Merchandising Store:** No cart, checkout, or monetary transactions.
5. **NOT a SaaS Marketing Funnel:** No demo request forms, lead capture popups, newsletter subscription flyouts, or pricing tiers.
6. **NOT an Institutional Replacement:** This site represents the student cohort of STI 2026, not the university's official administrative admissions portal.

---

## 3. TARGET USERS & AUDIENCE

The site is designed for five distinct audiences without inventing artificial demographics:

| User Group | Primary Intent | Core Value Delivered |
|------------|----------------|----------------------|
| **STI 2026 Cohort Members (Students & Alumni)** | Finding themselves, sharing their profile, reliving memories, revisiting peers' work. | Pride of belonging, permanent digital footprint, personal portfolio link. |
| **Tech Recruiters & Industry Employers** | Scouting emerging engineering, product, and design talent; evaluating capstone/project quality. | Verified project attribution, clean links to GitHub/LinkedIn/portfolios. |
| **Faculty & Academic Mentors** | Reviewing cohort progression, celebrating student achievements, referencing capstones. | Professional presentation of academic outcomes and student milestones. |
| **Prospective Students & Academic Community** | Learning about what STI students actually build and experiencing the cohort culture. | Realistic, inspirational view of student life and technical excellence. |
| **Families & Friends** | Celebrating the students' graduation and university journey. | Dignified, accessible digital yearbook that is easy to browse on mobile. |

---

## 4. USER JOURNEYS

### 4.1 Primary Journey: The Complete Cohort Story
```
[Landing / Hero]
      ↓
[Class Identity & Macro Stats]
      ↓
[Student Directory (People)] ──→ [Individual Student Profile]
      ↓                                   │
[Project Showcase]           ←────────────┘ (links via member tags)
      ↓
[Campus Life & Curated Memories] ──→ [Full-Screen Lightbox]
      ↓
[Events & Verified Achievements]
      ↓
[Chronological Class Timeline (2022–2026)]
      ↓
[Closing Valedictory & Class Legacy]
      ↓
[Footer & Program Identity]
```

### 4.2 Journey Details

#### 1. Landing & First Impression (Hero)
- **User enters:** Sees an editorial landscape photograph capturing the spirit of the cohort.
- **Immediate cognition:** "STI 2026 — Sistem dan Teknologi Informasi".
- **Action:** User can immediately scroll to absorb the narrative or tap a pill button ("Kenalan dengan Angkatan" / "Explore the Class") to navigate directly to the people.

#### 2. Discovering Class Identity
- **User scrolls:** Encounters the program statement, class size, faculty/university affiliation, and verified key metrics (e.g., total projects built, years traversed).

#### 3. Meeting the Students (People)
- **User browses:** A responsive, clean portrait grid with 6px rounded cards on Warm Parchment.
- **Interaction:** Hovering reveals subtle elevation on desktop.
- **Deep dive:** Clicking/tapping a student navigates to `/students/[slug]`, presenting their portrait, bio, interests, quotes, connected projects, and professional links.

#### 4. Exploring Projects
- **User views:** Project cards showcasing product screenshots or architectural covers, team member badges, and technology tags.
- **Detail exploration:** User navigates to `/projects/[slug]` to read problem statements, solutions, view additional images, and access live demo / GitHub links.

#### 5. Experiencing Campus Life & Memories
- **User discovers:** Candid moments from lab sessions, late-night study marathons, campus gatherings, and field visits.
- **Lightbox interaction:** Clicking any photograph opens an accessible modal lightbox allowing keyboard arrow navigation, swipe gestures on mobile, and focus management.

#### 6. Timeline & Milestones
- **User follows:** A vertical chronological track tracing 2022 enrollment, orientation, milestone semesters, capstones, and 2026 graduation.

#### 7. Closing Legacy & Footer
- **User reaches conclusion:** A dignified valedictory statement honoring the cohort's journey, followed by a minimal footer with copyright, attribution, and program identity.

---

## 5. SUCCESS CRITERIA

The product must meet the following verifiable criteria:

| Category | Metric / Criterion | Verification Method |
|----------|--------------------|---------------------|
| **Privacy Compliance** | 100% of visible student profiles have verified `consentPublic: true`. Zero unconsented PII. | Automated JSON schema check + manual review before publish. |
| **Performance** | Mobile Lighthouse Performance score ≥ 90; Desktop ≥ 95. | Lighthouse production run on simulated mobile 4G. |
| **Core Web Vitals** | LCP < 2.5s, CLS < 0.05, INP < 150ms on mobile. | Chrome DevTools CWV audit. |
| **Accessibility** | 100% WCAG 2.1 AA compliance; 0 critical or serious axe violations. | Automated axe-core scan + manual keyboard screen reader walkthrough. |
| **Visual Integrity** | 100% adherence to DESIGN.md tokens (no off-palette colors, no off-scale typography). | Visual QA checklist (`QA.md`). |
| **Responsive Stability** | Flawless rendering from 375px (iPhone SE) to 1920px+ with zero horizontal overflow. | Multi-device responsive audit. |
| **Content Accuracy** | Zero broken internal links, zero missing image fallbacks, zero raw placeholder strings (`[CONTENT NEEDED]`) in production. | Pre-release content checklist. |

---

## 6. CONSTRAINTS & BOUNDARIES

### 6.1 Content Availability Constraints
- The site depends on student-submitted data and photography.
- Where data is missing or delayed, the site **must** use designed editorial fallbacks (e.g. monogram placeholders, omitted optional bio blocks) and **never** display fake or mock data.

### 6.2 Privacy & Legal Constraints
- Indonesian personal data privacy standards and ethical consent guidelines apply.
- Phone numbers, personal home addresses, Student Identification Numbers (NIM), academic transcripts/GPA, and personal financial data are **strictly prohibited** from the codebase and public build.
- Every student has the continuous right to opt out or request photo/data replacement.

### 6.3 Technical & Architectural Constraints
- **Static Hosting:** The site must be buildable as a static export or pre-rendered static site (SSG) that can be hosted cost-effectively and securely without requiring a stateful Node.js backend.
- **No Database:** All data is held in human-auditable static JSON files in `src/data/`.
- **Zero Heavy Runtime Overhead:** Animations must be hardware-accelerated (`transform`, `opacity`) and fully suppressible via `prefers-reduced-motion`.

---

## 7. OPEN PRODUCT DECISIONS

| ID | Item | Options | Current Recommendation | Status |
|----|------|---------|------------------------|--------|
| P1 | Primary Site Language | Bahasa Indonesia / English / Bilingual Toggle | **Bahasa Indonesia** as primary editorial language, retaining standard technical terms (e.g., "Full-stack Developer", "Machine Learning"). | [PENDING APPROVAL] |
| P2 | Student Profile Routing | Full Page (`/students/[slug]`) vs Modal Overlay | **Full Page (SSG)** to ensure direct shareable URLs for student resumes/portfolios and clean SEO indexing. | [PENDING APPROVAL] |
| P3 | Project Detail Routing | Full Page (`/projects/[slug]`) vs In-page Drawer | **Full Page (SSG)** for full project case-study presentation. | [PENDING APPROVAL] |
| P4 | Student NIM Display | Excluded entirely vs Opt-in only | **Excluded entirely** to avoid PII exposure on the public web. | [PENDING APPROVAL] |
| P5 | Class Motto / Statement | Class-provided text | To be provided by class representatives (`[CONTENT NEEDED]`). | [CONTENT NEEDED] |
