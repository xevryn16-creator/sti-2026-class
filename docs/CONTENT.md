# CONTENT.md
> STI 2026 — Sistem dan Teknologi Informasi
> Content Architecture, Field Specifications & Privacy Policy

---

## 1. STATUS & EDITORIAL GOVERNANCE

> [!IMPORTANT]
> - This document specifies **content requirements, schema structures, media criteria, fallbacks, and privacy policies**.
> - All factual records (names, photographs, event dates, project summaries) must be supplied directly by the STI 2026 cohort.
> - Fields marked `[CONTENT NEEDED]` require submission by the cohort committee.
> - **Language Status:** `[LANGUAGE] — PENDING APPROVAL` (Recommendation: Bahasa Indonesia as primary editorial language, retaining standard technical terms in English).

### 1.1 Core Editorial Principles
1. **Dignified & Monographic:** The voice is warm, confident, and journalistic — reminiscent of an architectural monograph rather than a promotional hype page.
2. **People-Centric:** Students are celebrated as the authors and creators of the program's legacy.
3. **Absolute Privacy by Design:** Only publish information that students have explicitly reviewed and consented to share publicly.
4. **Zero Fabrication:** Never invent placeholder names, dummy achievements, or synthetic project dates. If an asset is missing, use designed editorial fallbacks.

---

## 2. PRIVACY & DATA GOVERNANCE POLICY

### 2.1 Strictly Prohibited Personal Data (Banned PII)
To protect the security, privacy, and digital well-being of every student, the following data items **must never be collected, stored in data files, or rendered on the website**:
- ❌ **Personal Phone Numbers** (WhatsApp, mobile numbers)
- ❌ **Residential / Home Addresses**
- ❌ **Student Identification Numbers (NIM)** — strictly excluded from public display
- ❌ **Personal / Private Email Addresses** (unless specifically requested by student for public contact)
- ❌ **Academic Scores, Transcripts, GPA, or Course Grades**
- ❌ **Financial, Family, or Sensitive Demographic Information**

### 2.2 Consent & Opt-In Rules
1. **Explicit Consent:** Every student record has a mandatory `consentPublic: boolean` flag. Only records with `consentPublic: true` are built into the public website.
2. **Right to Modification & Removal:** Any student can request immediate updates to their photo, bio, project links, or complete removal from the live site via a streamlined pull request or email to the class digital archivist.
3. **Approved Social Links:** Only public, professional portfolios and profiles are permitted:
   - Permitted: LinkedIn, GitHub, Behance, Personal Portfolio Website.
   - Restricted: Instagram (permitted only if publicly accessible and opted in; no personal private handles).
   - Forbidden: Direct messaging handles (WhatsApp, Telegram, Discord IDs).

---

## 3. SECTION SPECIFICATIONS

---

### SECTION 1 — HERO SECTION

#### Purpose
Establishes the commanding first impression of the STI 2026 cohort. Sets the editorial tone with confident typography and full-bleed portraiture/landscape imagery.

#### Content Fields
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `programName` | string | **Required** | "Sistem dan Teknologi Informasi" | Confirmed |
| `classYear` | number | **Required** | `2026` | Confirmed |
| `institution` | string | **Required** | Full University and Faculty affiliation | `[CONTENT NEEDED]` |
| `heroHeadline` | string | **Required** | Expressive display headline (e.g. "Arsitek Sistem, Penggerak Transformasi") | `[CONTENT NEEDED]` |
| `heroSubheadline` | string | Optional | Editorial narrative subhead (max 2 sentences) | `[CONTENT NEEDED]` |
| `heroPhoto` | string | **Required** | File path to hero master photograph | `[CONTENT NEEDED]` |
| `ctaLabel` | string | **Required** | Button label (e.g. "Kenalan dengan Angkatan") | `[CONTENT NEEDED]` |

#### Media Requirements
- **Resolution:** Minimum 1920×1080px (landscape).
- **Format:** High dynamic range WebP or AVIF.
- **Composition:** Editorial landscape group photo or campus setting with clean negative space for text overlay.

#### Fallback Behavior
- If hero photo is delayed, render an ink-black minimalist editorial canvas with Geist 56px display typography on Warm Parchment with subtle Broadcast Gradient framing.

#### Privacy Considerations
- Any recognizable students in the hero photograph must give group media release consent.

---

### SECTION 2 — CLASS IDENTITY & MACRO STATS

#### Purpose
Provides context on what defines STI 2026 — academic focus, cohort size, values, and cumulative metrics.

#### Content Fields
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `classStatement` | string | **Required** | 2–3 sentence defining statement of the cohort's identity | `[CONTENT NEEDED]` |
| `faculty` | string | **Required** | Faculty name | `[CONTENT NEEDED]` |
| `university` | string | **Required** | University name | `[CONTENT NEEDED]` |
| `classMotto` | string | Optional | Official or informal cohort motto | `[CONTENT NEEDED]` |
| `classPhotoFormal` | string | Optional | Formal group photograph | `[CONTENT NEEDED]` |
| `keyStats` | Array | Optional | Verified metrics (e.g. `[{ label: "Mahasiswa", value: "85" }, { label: "Karya", value: "32" }]`) | `[CONTENT NEEDED]` |

#### Media Requirements
- Minimum 1440×900px, landscape orientation, natural lighting.

#### Fallback Behavior
- If `keyStats` are not formally verified, omit the stats row entirely. Never invent synthetic counts.

#### Privacy Considerations
- General public cohort data only; zero personal disclosures.

---

### SECTION 3 — PEOPLE (Student Directory & Profiles)

#### Purpose
The heartbeat of the yearbook. Every consenting student has an individual presence and dedicated profile page.

#### Content Fields (Per Student)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | URL-safe slug (e.g. "budi-santoso") | Schema |
| `name` | string | **Required** | Full name as preferred for public portfolio | `[CONTENT NEEDED]` |
| `nickname` | string | Optional | Preferred alias or call name | `[CONTENT NEEDED]` |
| `photo` | string | **Required** | Portrait photography file path | `[CONTENT NEEDED]` |
| `bio` | string | Optional | 2–3 sentence statement on interests, aspirations, or philosophy | `[CONTENT NEEDED]` |
| `interests` | string[] | Optional | 2–5 focus areas (e.g. ["Software Engineering", "Data Analytics", "Cloud"]) | `[CONTENT NEEDED]` |
| `quote` | string | Optional | Yearbook reflection or memorable quote | `[CONTENT NEEDED]` |
| `roles` | string[] | Optional | Formal cohort roles (e.g. "Ketua Angkatan", "Divisi Kominfo") | `[CONTENT NEEDED]` |
| `projects` | string[] | Optional | Array of referenced Project slugs | `[CONTENT NEEDED]` |
| `socialLinks` | Object[] | Optional | Professional profiles (LinkedIn, GitHub, Portfolio) | `[CONTENT NEEDED]` |
| `consentPublic` | boolean | **Required** | Explicit opt-in verification (must be `true` to render) | Mandatory |

#### Media Requirements
- **Aspect Ratio:** 3:4 portrait (min 800×1066px) or 1:1 square (min 800×800px).
- **Style:** Head-and-shoulders or torso portrait. Clean background, good lighting. WebP/AVIF format.

#### Fallback Behavior
- **No Photo:** Render elegant typographic initials monogram on Warm Parchment (`#f6f4f1`) with Geist 500.
- **No Bio:** Omit bio block gracefully without leaving empty whitespace.
- **No Social Links:** Section is hidden cleanly.

#### Privacy Considerations
- Zero display of NIM, phone numbers, personal email, or residential locations.
- Student must explicitly verify consent form before entry is compiled into `students.json`.

---

### SECTION 4 — PROJECTS (Cohort Showcase)

#### Purpose
Demonstrates the engineering, research, and design prowess of STI 2026 students through academic capstones, hackathon builds, and independent software.

#### Content Fields (Per Project)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | URL-safe slug (e.g. "sistem-monitoring-iot") | Schema |
| `title` | string | **Required** | Official project name | `[CONTENT NEEDED]` |
| `description` | string | **Required** | 3–4 sentence executive summary of problem & solution | `[CONTENT NEEDED]` |
| `coverImage` | string | **Required** | Cover visual or UI screenshot | `[CONTENT NEEDED]` |
| `members` | Object[] | **Required** | Team members (`{ studentSlug: string, role: string }`) | `[CONTENT NEEDED]` |
| `technology` | string[] | Optional | Tech stack tags (e.g. ["TypeScript", "Next.js", "PostgreSQL"]) | `[CONTENT NEEDED]` |
| `category` | string | Optional | Domain (e.g. "Web Application", "AI/ML", "Enterprise Systems") | `[CONTENT NEEDED]` |
| `link` | string | Optional | Live demonstration URL or public GitHub repository | `[CONTENT NEEDED]` |
| `year` | number | Optional | Year built (e.g. 2024, 2025) | `[CONTENT NEEDED]` |
| `gallery` | string[] | Optional | Secondary screenshots for detail page | `[CONTENT NEEDED]` |

#### Media Requirements
- **Cover Image:** 16:9 ratio, min 1280×720px, crisp UI or architectural rendering.

#### Fallback Behavior
- **Missing Cover Image:** Minimalist typography-led card with title, team badges, and a Warm Parchment backdrop with Broadcast Gradient hairline.

#### Privacy Considerations
- All listed team members must consent to project attribution. External links must point only to public repositories or live sites.

---

### SECTION 5 — CAMPUS LIFE (Authentic Moments)

#### Purpose
Captures the human, unvarnished story of student life — lab sessions, study groups, celebrations, and campus culture.

#### Content Fields (Per Campus Photo)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | Unique photo ID | Schema |
| `src` | string | **Required** | Image file path | `[CONTENT NEEDED]` |
| `alt` | string | **Required** | Accessibility description of the scene | `[CONTENT NEEDED]` |
| `caption` | string | Optional | Short contextual caption (max 1 sentence) | `[CONTENT NEEDED]` |
| `activity` | string | Optional | Activity tag (e.g. "Praktikum Lab", "Ospek", "Studi Kelompok") | `[CONTENT NEEDED]` |
| `date` | string | Optional | Approximate date or semester | `[CONTENT NEEDED]` |

#### Media Requirements
- Minimum 1200×800px, natural light, no harsh artificial filters.

#### Fallback Behavior
- Photos failing integrity checks are excluded from the gallery.

#### Privacy Considerations
- Identifiable students in candid photography must not object to public publication. Any student can request removal at any time.

---

### SECTION 6 — EVENTS ARCHIVE

#### Purpose
Chronicles formal and informal gatherings, competitions, guest lectures, and ceremonies hosted or attended by STI 2026.

#### Content Fields (Per Event)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | URL-safe slug | Schema |
| `title` | string | **Required** | Event name | `[CONTENT NEEDED]` |
| `date` | string | **Required** | ISO date string (`YYYY-MM-DD`) | `[CONTENT NEEDED]` |
| `description` | string | **Required** | 2–3 sentence event summary | `[CONTENT NEEDED]` |
| `poster` | string | Optional | Event visual or documentation photo | `[CONTENT NEEDED]` |
| `category` | string | Optional | "Akademik", "Sosial", "Kompetisi", "Ceremony" | `[CONTENT NEEDED]` |

#### Media Requirements
- Landscape or 4:3 ratio, minimum 1000×750px.

#### Fallback Behavior
- If no image is available, render clean typographic card highlighting date, category pill, and description.

---

### SECTION 7 — MEMORIES (Editorial Photo Stories)

#### Purpose
Deeply curated multi-photo stories capturing significant milestones (e.g. Cohort Study Trip, Industrial Visit, Graduation Preparation).

#### Content Fields (Per Memory Story)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | Unique story ID | Schema |
| `title` | string | **Required** | Story title | `[CONTENT NEEDED]` |
| `description` | string | Optional | Narrative description | `[CONTENT NEEDED]` |
| `photos` | Object[] | **Required** | Array of photo objects (`{ src, alt, caption }`) | `[CONTENT NEEDED]` |
| `period` | string | Optional | e.g. "Semester 5 (2024)" | `[CONTENT NEEDED]` |

#### Media Requirements
- Lightbox-ready high-resolution photography (min 1600px on long edge).

#### Fallback Behavior
- Stories with zero valid photos are withheld from the build.

---

### SECTION 8 — ACHIEVEMENTS

#### Purpose
Celebrates verified competitions, hackathons, academic papers, and campus honors won by cohort students.

#### Content Fields (Per Achievement)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | Unique identifier | Schema |
| `title` | string | **Required** | Award or competition name | `[CONTENT NEEDED]` |
| `recipients` | string[] | **Required** | Student names or team members | `[CONTENT NEEDED]` |
| `category` | string | **Required** | "Kompetisi", "Akademik", "Inovasi", "Olahraga" | `[CONTENT NEEDED]` |
| `level` | string | Optional | "Nasional", "Internasional", "Regional", "Universitas" | `[CONTENT NEEDED]` |
| `year` | number | Optional | Year won | `[CONTENT NEEDED]` |
| `proofUrl` | string | Optional | External news link or verified certificate link | `[CONTENT NEEDED]` |

#### Fallback Behavior
- Unverified achievements are omitted.

#### Privacy Considerations
- All named recipients must consent to public listing of their achievement.

---

### SECTION 9 — TIMELINE (Cohort Journey 2022–2026)

#### Purpose
A chronological narrative tracing the 4-year journey from matriculation to graduation.

#### Content Fields (Per Milestone)
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `id` | string | **Required** | Unique entry ID | Schema |
| `date` | string | **Required** | `YYYY-MM` or `YYYY-MM-DD` | `[CONTENT NEEDED]` |
| `milestone` | string | **Required** | Concise milestone title (max 6 words) | `[CONTENT NEEDED]` |
| `description` | string | Optional | 1–2 sentence contextual narrative | `[CONTENT NEEDED]` |
| `image` | string | Optional | Milestone documentation photo | `[CONTENT NEEDED]` |
| `category` | string | Optional | "Milestone", "Akademik", "Sosial" | `[CONTENT NEEDED]` |

#### Fallback Behavior
- Missing image does not break timeline layout; card adjusts to text-only mode cleanly.

---

### SECTION 10 — CLOSING & VALEDICTORY (Class Legacy)

#### Purpose
Provides an emotional, dignified conclusion to the digital yearbook. Reflects on the transition from students to alumni, honoring the shared journey and inspiring the cohort's future.

#### Content Fields
| Field | Type | Requirement | Description | Status |
|-------|------|-------------|-------------|--------|
| `valedictoryTitle` | string | **Required** | Closing headline (e.g. "Sebuah Akhir, Ribuan Awal Baru") | `[CONTENT NEEDED]` |
| `valedictoryBody` | string | **Required** | 2–3 paragraphs of closing reflection written by the class | `[CONTENT NEEDED]` |
| `signOff` | string | **Required** | e.g. "Keluarga Besar STI 2026" | `[CONTENT NEEDED]` |
| `closingPhoto` | string | Optional | Sunset or celebratory cohort wide photo | `[CONTENT NEEDED]` |
| `actionLink` | Object | Optional | Link back to student directory or alumni portal | `[CONTENT NEEDED]` |

#### Media Requirements
- Wide cinematic landscape (min 1920×800px).

#### Fallback Behavior
- Renders as a powerful typography-first section on Ink Black (`#000000`) or Warm Parchment with Geist 33px type.

---

## 4. NAVIGATION & FOOTER CONTENT

### 4.1 Navigation Labels (`[PENDING APPROVAL]`)
| Route | Label Option A (Indonesian) | Label Option B (English) | Label Option C (Bilingual) | Recommended |
|-------|------------------------------|--------------------------|----------------------------|-------------|
| `/` | Beranda | Home | Beranda / Home | **Beranda** |
| `/students` | Angkatan | Students | Mahasiswa / People | **Angkatan** |
| `/projects` | Karya | Projects | Karya / Projects | **Karya** |
| `/memories` | Kenangan | Memories | Kenangan / Gallery | **Kenangan** |
| `/events` | Acara | Events | Acara / Events | **Acara** |
| `/timeline` | Perjalanan | Timeline | Perjalanan / Journey | **Perjalanan** |

### 4.2 Footer Content
- **Class Title:** STI 2026 — Sistem dan Teknologi Informasi
- **Institution:** `[CONTENT NEEDED]` (University & Faculty)
- **Copyright Statement:** "© 2026 STI 2026. Seluruh hak cipta dilindungi undang-undang."
- **Credits:** "Dirancang dan dibangun dengan penuh dedikasi oleh Tim Digital STI 2026."

---

## 5. SEO METADATA & SOCIAL SHARE CONTENT

| Page | Title Tag (`<title>`) | Meta Description (`<meta name="description">`) | OG Image |
|------|------------------------|------------------------------------------------|----------|
| `/` | STI 2026 — Sistem dan Teknologi Informasi | Buku tahunan digital dan etalase karya mahasiswa Sistem dan Teknologi Informasi angkatan 2026. | `/og/og-home.jpg` (1200×630) |
| `/students` | Angkatan — Daftar Mahasiswa STI 2026 | Kenali profil, minat, karya, dan jejak langkah seluruh mahasiswa STI angkatan 2026. | `/og/og-students.jpg` |
| `/students/[slug]` | `[Student Name] — Mahasiswa STI 2026` | Profil profesional, karya, dan perjalanan [Student Name] di STI angkatan 2026. | Student portrait or `/og/og-students.jpg` |
| `/projects` | Karya — Etalase Proyek STI 2026 | Koleksi proyek perangkat lunak, sistem informasi, dan riset mahasiswa STI 2026. | `/og/og-projects.jpg` |
| `/projects/[slug]` | `[Project Title] — Proyek STI 2026` | Pelajari arsitektur, tim pengembang, dan solusi teknologi dari [Project Title]. | Project cover image |
| `/memories` | Kenangan & Kehidupan Kampus — STI 2026 | Dokumentasi visual dan momen berharga kehidupan perkuliahan STI 2026. | `/og/og-home.jpg` |
| `/events` | Acara & Dokumentasi — STI 2026 | Arsip kegiatan akademis, sosial, dan kompetisi yang diikuti STI 2026. | `/og/og-home.jpg` |
| `/timeline` | Perjalanan 2022–2026 — STI 2026 | Rekam jejak kronologis perjalanan mahasiswa STI 2026 dari awal masuk hingga wisuda. | `/og/og-home.jpg` |