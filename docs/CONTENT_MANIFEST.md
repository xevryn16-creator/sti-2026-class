# CONTENT_MANIFEST.md
> STI 2026 — Sistem dan Teknologi Informasi
> Committee Content Intake Manifest & Ingestion Manual

---

## 1. PURPOSE & OVERVIEW

This document is the operational guide for the STI 2026 Class Committee to collect, structure, validate, and ingest class cohort data into the digital yearbook platform.

The system uses an automated, zero-fabrication ingestion pipeline:
```text
Inbox Folder (raw committee submissions + photos + consent register)
                    │
                    ▼
         npm run ingest -- --inbox <path>
                    │
                    ├─ 1. PII Firewall check (banned keys abort)
                    ├─ 2. Consent Gate check (cross-checked against consent.json)
                    ├─ 3. Photo intake (EXIF GPS stripping, aspect ratio check, Sharp optimization)
                    ├─ 4. Referential integrity verification (students, roles, projects)
                    ├─ 5. Atomic write to src/data/*.json & public/images/
                    └─ 6. Build verification (TypeScript + Next.js static build)
```

---

## 2. INBOX DIRECTORY STRUCTURE

Prepare a folder named `inbox/` (or any custom path passed to `--inbox`):

```text
inbox/
├── consent.json                ← Signed consent registry (REQUIRED for public profiling)
├── class.json                  ← Cohort metadata, defining statement, valedictory text
├── students.json               ← Student directory records
├── roles.json                  ← Class committee & structural roles
├── projects.json               ← Capstone & showcase projects
├── campus.json                 ← Candid campus life imagery
├── events.json                 ← Cohort events & gatherings
├── memories.json               ← Curated photo stories & archives
├── achievements.json           ← Verified awards, competitions & honors
├── timeline.json               ← 2022–2026 milestone chronology
└── photos/                     ← High-resolution photographic assets
    ├── students/               ← Student portraits (e.g., ahmad-fauzi.jpg)
    ├── projects/               ← Project covers and galleries (e.g., sim-kampus-cover.jpg)
    ├── campus/                 ← Campus candid photos (e.g., lab-iot-session.jpg)
    ├── events/                 ← Event posters/photos (e.g., makrab-2023.jpg)
    └── hero/                   ← Hero & valedictory banners (e.g., angkatan-2026-hero.jpg)
```

---

## 3. PHOTO SPECIFICATIONS & ASSET NAMING

> [!IMPORTANT]
> The automated intake engine strips all camera metadata (EXIF, GPS, device identifiers) for privacy and optimizes all images via `sharp`. 
> Follow the aspect ratios below to prevent editorial distortion.

| Category | Target Path in `public/` | Target Aspect Ratio | Recommended Resolution | Accepted Formats | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Student Portrait** | `public/images/students/<slug>.jpg` | **3:4** Portrait | `800 × 1066 px` | JPG, PNG, WebP | Neutral background, warm lighting, editorial framing |
| **Project Cover** | `public/images/projects/<slug>-cover.jpg` | **3:2** Landscape | `1200 × 800 px` | JPG, PNG, WebP | UI screenshot, hardware mockup, or team shot |
| **Project Gallery** | `public/images/projects/<slug>-<seq>.jpg` | **16:9** or **3:2** | `1200 × 800 px` | JPG, PNG, WebP | Architecture diagram, exhibition booth, team demo |
| **Campus Life** | `public/images/campus/<slug>.jpg` | **3:2** or **4:3** | `1200 × 800 px` | JPG, PNG, WebP | Candid classroom, laboratory, canteen moments |
| **Event Poster/Photo** | `public/images/events/<slug>.jpg` | **4:5** or **3:2** | `1000 × 1250 px` | JPG, PNG, WebP | Official documentation or promotional photography |
| **Hero / Valedictory** | `public/images/hero/<name>.jpg` | **16:9** Panoramic | `2400 × 1350 px` | JPG, PNG, WebP | High-resolution collective cohort panorama |

---

## 4. PRIVACY FIREWALL & BANNED PII KEYS

To comply with Indonesian privacy regulations (UU PDP) and project ethical guidelines:

1. **Strictly Forbidden Keys:**
   Any submission JSON containing any of the following keys will be **IMMEDIATELY REJECTED** with a fatal error:
   - `phone`, `whatsapp`, `telegram`
   - `address`, `homeAddress`
   - `nim`, `studentIdNumber`
   - `gpa`, `grade`, `transcript`
   - `email` (use public handles like GitHub, LinkedIn, or personal website instead)

2. **Allowed Social Links:**
   Only public professional platforms are permitted:
   - `github`: Username string or full URL (e.g., `https://github.com/username`)
   - `linkedin`: Profile URL (e.g., `https://linkedin.com/in/username`)
   - `website`: Portfolio/personal site URL (e.g., `https://portfolio.dev`)
   - `instagram`: Public handle or URL (e.g., `https://instagram.com/username`)

---

## 5. CONSENT REGISTRY (`consent.json`)

Student profiles and individual achievements will **ONLY** be rendered publicly if explicit consent has been granted.

### Format
```json
[
  {
    "id": "ahmad-fauzi",
    "name": "Ahmad Fauzi",
    "consentPublic": true,
    "consentDate": "2026-09-15",
    "notes": "Full yearbook profile approved"
  },
  {
    "id": "budi-santoso",
    "name": "Budi Santoso",
    "consentPublic": false,
    "consentDate": "2026-09-16",
    "notes": "Opted out of public web directory"
  }
]
```

- When `consentPublic: false`, the student's profile page and directory card are excluded from the static build.
- If a project lists a non-consenting student as a member, their name is displayed in plain text without an active hyperlink to a student profile.

---

## 6. EXECUTION WORKFLOW

### Step 1: Dry-Run Validation
Before modifying the repository, test the submission against all validation gates:
```bash
npm run ingest -- --inbox path/to/inbox --dry-run --verbose
```

### Step 2: Full Ingestion
When the dry-run passes without fatal errors:
```bash
npm run ingest -- --inbox path/to/inbox
```
This command will:
1. Copy and optimize all images into `public/images/...`
2. Normalize and write valid records to `src/data/*.json`
3. Execute `npm run typecheck` and `npm run build` to guarantee zero compilation errors.

### Step 3: Git Commit & Inspection
```bash
git status
git diff src/data/
git add src/data/ public/images/
git commit -m "feat(content): ingest verified STI 2026 cohort data and photography"
```

---

## 7. EDITORIAL FALLBACKS WHEN DATA IS PARTIAL

If some assets or sections are not yet finalized by the committee:
- **Missing photo:** The system automatically renders a dignified monogram placeholder using the student's initials and cohort color tokens.
- **Empty projects/events/memories:** The views render warm, Beau-inspired editorial notices (e.g., *"Karya dan dokumentasi angkatan sedang dalam tahap kurasi dan pengarsipan."*).
- **Never insert fake or placeholder names** (e.g., "John Doe", "Test Student"). Leave the array empty or omit the record until verified.
