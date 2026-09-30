# DATA_MODEL.md
> STI 2026 — Sistem dan Teknologi Informasi
> Data Model & JSON Schema Specification

---

## 1. DATA ARCHITECTURE & STORAGE OVERVIEW

> [!IMPORTANT]
> - All data is stored in **static JSON files** within `src/data/`.
> - No relational database, GraphQL endpoint, or external CMS is required at runtime.
> - Data files are committed directly to version control, making all content human-auditable and tamper-proof.
> - **Build-time Validation:** All JSON files must strictly conform to TypeScript interfaces defined in this document. Any schema discrepancy or unconsented record triggers a build failure or silent exclusion.

### 1.1 Data File Hierarchy
```text
src/data/
├── class.json             ← Single Class record: identity, macro stats, closing valedictory
├── students.json          ← Array of Student records (with consent flags)
├── roles.json             ← Array of Role definitions (class committee & structural roles)
├── projects.json          ← Array of Project records (with team member associations)
├── events.json            ← Array of Event records (historical events & documentation)
├── memories.json          ← Array of Memory records (curated photo stories)
├── campus.json            ← Array of CampusPhoto records (candid campus moments)
├── achievements.json      ← Array of verified Achievement records
└── timeline.json          ← Array of TimelineEntry records (2022–2026 milestones)
```

---

## 2. ENTITY RELATIONSHIP DIAGRAM

```text
Class (1)
  │
  ├── contains ──→ Student (N)
  │                  ├── has many ──→ SocialLink (N) [embedded]
  │                  ├── assigned ──→ Role (N) [via studentId]
  │                  └── linked ────→ Project (N) [via ProjectMember]
  │
  ├── showcases ─→ Project (N)
  │                  └── composed of → ProjectMember (N) [embedded, references Student.id]
  │
  ├── archives ──→ Event (N)
  │
  ├── preserves ─→ Memory (N)
  │                  └── contains ──→ MemoryPhoto (N) [embedded]
  │
  ├── captures ──→ CampusPhoto (N)
  │
  ├── honors ────→ Achievement (N) [references Student.id]
  │
  └── traces ────→ TimelineEntry (N)
```

---

## 3. ENTITY SPECIFICATIONS

---

### 3.1 ENTITY: Class (`class.json`)

#### Purpose
The root singleton descriptor representing the cohort's collective identity, macro numbers, institutional affiliations, and closing valedictory statement.

#### TypeScript Interface
```typescript
export interface ClassStat {
  label: string; // e.g., "Mahasiswa", "Karya", "Penghargaan"
  value: string; // e.g., "85", "32+", "14"
}

export interface ClassEntity {
  id: string; // Unique identifier: "sti-2026"
  name: string; // "STI 2026"
  programName: string; // "Sistem dan Teknologi Informasi"
  programAbbreviation: string; // "STI"
  faculty: string; // Faculty name
  university: string; // University name
  graduationYear: number; // 2026
  motto?: string; // Optional class motto
  statement: string; // 2–3 sentence defining statement
  classPhotoFormal?: string; // Path to formal class photo
  totalStudents?: number; // Verified student count
  stats?: ClassStat[]; // Verified macro statistics
  valedictoryTitle: string; // Section 10 Closing headline
  valedictoryBody: string[]; // Section 10 Closing paragraphs
  signOff: string; // Closing signature e.g., "Keluarga Besar STI 2026"
  closingPhoto?: string; // Cinematic closing photo path
}
```

---

### 3.2 ENTITY: Student (`students.json`)

#### Purpose
One record per student. The core entity of the digital yearbook.

#### TypeScript Interface
```typescript
export type SocialPlatform = 'linkedin' | 'github' | 'behance' | 'portfolio' | 'instagram';

export interface SocialLink {
  platform: SocialPlatform;
  url: string; // Full URL: e.g. "https://linkedin.com/in/username"
  label?: string; // Optional display label override
}

export interface StudentEntity {
  id: string; // URL-safe unique slug: e.g., "budi-santoso"
  name: string; // Full name as preferred for publication
  nickname?: string; // Preferred alias or short call-name
  photo: string; // File path: "/images/students/budi-santoso-portrait.webp"
  photoFallback?: string; // Optional custom fallback path
  bio?: string; // Personal statement (max 2–3 sentences)
  interests?: string[]; // Array of focus tags: ["Software Engineering", "UI/UX"]
  quote?: string; // Personal yearbook reflection quote
  roles?: string[]; // Referenced Role IDs: ["ketua-angkatan"]
  projects?: string[]; // Referenced Project IDs: ["sistem-monitoring-iot"]
  achievements?: string[]; // Referenced Achievement IDs: ["gemastik-2024-iot"]
  socialLinks?: SocialLink[]; // Array of approved public links
  consentPublic: boolean; // MANDATORY: Explicit consent to appear on public site
}
```

#### Privacy & Validation Rules
- **Privacy Rule:** If `consentPublic !== true`, the student record is strictly filtered out at build time. No profile page is generated, and the student will not appear in any directory or project team list.
- **Banned Fields:** Never include `phone`, `address`, `nim`, `gpa`, or `email` (unless opted in for public contact).

---

### 3.3 ENTITY: Role (`roles.json`)

#### Purpose
Formal structural, organizational, or academic responsibilities held by students during their tenure.

#### TypeScript Interface
```typescript
export interface RoleEntity {
  id: string; // Unique identifier: e.g., "ketua-angkatan"
  label: string; // Display title: "Ketua Angkatan"
  studentId: string; // References StudentEntity.id
  period?: string; // Tenure period: e.g., "2023–2025"
  division?: string; // e.g., "Pengurus Inti", "Kominfo"
}
```

---

### 3.4 ENTITY: Project (`projects.json`)

#### Purpose
Academic capstones, hackathon submissions, and independent software solutions built by STI 2026 students.

#### TypeScript Interface
```typescript
export type ProjectStatus = 'completed' | 'in-progress' | 'prototype' | 'archived';

export interface ProjectMember {
  studentId: string; // References StudentEntity.id
  role?: string; // Specific contribution: e.g. "Frontend Engineer", "UI Designer"
}

export interface ProjectEntity {
  id: string; // URL-safe slug: e.g., "sistem-monitoring-iot"
  title: string; // Project title
  description: string; // Executive summary (3–4 sentences)
  coverImage: string; // Primary image path: "/images/projects/iot-cover.webp"
  members: ProjectMember[]; // Array of team members
  technology?: string[]; // Tech stack tags: ["Next.js", "Python", "MQTT"]
  link?: string; // Live demo or GitHub repository URL
  year?: number; // Year built: e.g., 2024
  status?: ProjectStatus; // Status indicator
  category?: string; // Classification: "Web Application", "AI/ML", "IoT"
  course?: string; // Related course/mata kuliah (if academic)
  gallery?: string[]; // Secondary screenshots for detail page
  featured?: boolean; // If true, receives Broadcast Gradient frame treatment
}
```

---

### 3.5 ENTITY: CampusPhoto (`campus.json`)

#### Purpose
Authentic candid photography capturing daily student life across campus, laboratories, and gatherings.

#### TypeScript Interface
```typescript
export interface CampusPhotoEntity {
  id: string; // Unique photo identifier: e.g., "campus-2023-lab-01"
  src: string; // Path: "/images/campus/campus-2023-lab-01.webp"
  alt: string; // Accessible descriptive text
  caption?: string; // Short editorial caption
  activity?: string; // "Praktikum", "Studi Kelompok", "Wisuda"
  date?: string; // "YYYY-MM" or approximate semester
}
```

---

### 3.6 ENTITY: Event (`events.json`)

#### Purpose
Chronicles formal and informal cohort events, conferences, sports days, and ceremonies.

#### TypeScript Interface
```typescript
export type EventCategory = 'academic' | 'social' | 'competition' | 'ceremony' | 'other';

export interface EventEntity {
  id: string; // URL-safe slug: e.g., "industrial-visit-2024"
  title: string; // Event title
  date: string; // ISO date string: "2024-05-18"
  description: string; // Event narrative (2–4 sentences)
  poster?: string; // Event photo or poster image path
  category?: EventCategory; // Category classification
  location?: string; // General location: e.g. "Bandung", "Gedung Kuliah Umum"
  participantsCount?: number; // Approximate attendance count
}
```

---

### 3.7 ENTITY: Memory (`memories.json`)

#### Purpose
Curated multi-image photo stories of significant shared milestones, displayed with lightbox support.

#### TypeScript Interface
```typescript
export interface MemoryPhoto {
  src: string; // Image path: "/images/campus/trip-01.webp"
  alt: string; // Accessible alt description
  caption?: string; // Photo-specific annotation
}

export interface MemoryEntity {
  id: string; // Unique slug: e.g., "study-tour-jakarta-2024"
  title: string; // Story title
  description?: string; // Story background
  photos: MemoryPhoto[]; // Array of photos (minimum 1)
  period?: string; // e.g. "Juni 2024"
  category?: string; // "Gathering", "Study Tour", "Celebration"
}
```

---

### 3.8 ENTITY: Achievement (`achievements.json`)

#### Purpose
Verified academic, technical, hackathon, and extracurricular accomplishments.

#### TypeScript Interface
```typescript
export type AchievementLevel = 'universitas' | 'regional' | 'nasional' | 'internasional';

export interface AchievementEntity {
  id: string; // Unique identifier: e.g., "gemastik-2024-iot"
  title: string; // Competition or award title
  studentIds: string[]; // Array of StudentEntity.id references
  category: string; // "Kompetisi", "Akademik", "Inovasi", "Olahraga"
  level?: AchievementLevel; // Competition level
  year?: number; // Year achieved: e.g., 2024
  description?: string; // Significance and context
  proofUrl?: string; // Verified public news link or announcement
  consentPublic: boolean; // Explicit publication consent
}
```

---

### 3.9 ENTITY: TimelineEntry (`timeline.json`)

#### Purpose
A chronological milestone plotted on the interactive journey track from 2022 to 2026.

#### TypeScript Interface
```typescript
export type TimelineCategory = 'matriculation' | 'academic' | 'social' | 'milestone' | 'graduation';

export interface TimelineEntryEntity {
  id: string; // Unique slug: e.g., "masuk-sti-2022"
  date: string; // ISO date string "YYYY-MM-DD" or "YYYY-MM"
  milestone: string; // Headline title (max 6 words)
  description?: string; // 1–2 sentence narrative description
  image?: string; // Milestone photograph path
  category?: TimelineCategory; // Milestone category
}
```

---

## 4. BUILD-TIME DATA VALIDATION SPECIFICATION

To guarantee runtime stability without a dynamic database, the build pipeline runs a pre-build validation check:

```typescript
// Proposed validation logic in src/lib/data.ts
export function validateDatabaseIntegrity(): void {
  // 1. Verify all referenced studentIds in projects, roles, achievements exist
  // 2. Ensure every Student record has consentPublic explicitly defined
  // 3. Confirm all media file paths referenced in JSON exist in /public/
  // 4. Ensure no unconsented student is linked in projects or achievements
}
```
