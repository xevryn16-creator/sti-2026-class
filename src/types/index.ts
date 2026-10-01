/**
 * STI 2026 — Type definitions
 * 1:1 mirror of docs/DATA_MODEL.md §3. Do not add fields that are not in the
 * data model. Prohibited PII (phone, address, NIM, GPA) intentionally has no
 * type representation anywhere in this codebase.
 */

/* ============================== Class ============================== */

export interface ClassStat {
  /** e.g., "Mahasiswa", "Karya", "Penghargaan" */
  label: string;
  /** e.g., "85", "32+", "14" — must be verified before publication */
  value: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  programName: string;
  programAbbreviation: string;
  faculty: string;
  university: string;
  graduationYear: number;
  motto?: string;
  statement: string;
  classPhotoFormal?: string;
  totalStudents?: number;
  stats?: ClassStat[];
  valedictoryTitle: string;
  valedictoryBody: string[];
  signOff: string;
  closingPhoto?: string;
}

/* ============================== Student ============================== */

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "behance"
  | "portfolio"
  | "instagram";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface StudentEntity {
  id: string;
  name: string;
  nickname?: string;
  photo: string;
  photoFallback?: string;
  bio?: string;
  interests?: string[];
  quote?: string;
  roles?: string[];
  projects?: string[];
  achievements?: string[];
  socialLinks?: SocialLink[];
  /** MANDATORY: explicit consent to appear on the public site. */
  consentPublic: boolean;
  /** Publication lifecycle status (defaults to published if omitted). */
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== Role ============================== */

export interface RoleEntity {
  id: string;
  label: string;
  studentId: string;
  period?: string;
  division?: string;
}

/* ============================== Project ============================== */

export type ProjectStatus = "completed" | "in-progress" | "prototype" | "archived";

export interface ProjectMember {
  studentId: string;
  role?: string;
}

export interface ProjectEntity {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  members: ProjectMember[];
  technology?: string[];
  link?: string;
  year?: number;
  status?: ProjectStatus;
  category?: string;
  course?: string;
  gallery?: string[];
  /** If true, receives the Broadcast Gradient frame treatment. */
  featured?: boolean;
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== CampusPhoto ============================== */

export interface CampusPhotoEntity {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  activity?: string;
  /** "YYYY-MM" or approximate semester label */
  date?: string;
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== Event ============================== */

export type EventCategory =
  | "academic"
  | "social"
  | "competition"
  | "ceremony"
  | "other";

export interface EventEntity {
  id: string;
  title: string;
  /** ISO date string: "2024-05-18" */
  date: string;
  description: string;
  poster?: string;
  category?: EventCategory;
  location?: string;
  participantsCount?: number;
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== Memory ============================== */

export interface MemoryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface MemoryEntity {
  id: string;
  title: string;
  description?: string;
  photos: MemoryPhoto[];
  period?: string;
  category?: string;
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== Achievement ============================== */

export type AchievementLevel =
  | "universitas"
  | "regional"
  | "nasional"
  | "internasional";

export interface AchievementEntity {
  id: string;
  title: string;
  studentIds: string[];
  /** "Kompetisi", "Akademik", "Inovasi", "Olahraga" */
  category: string;
  level?: AchievementLevel;
  year?: number;
  description?: string;
  proofUrl?: string;
  consentPublic: boolean;
  publishStatus?: "draft" | "published" | "archived";
}

/* ============================== TimelineEntry ============================== */

export type TimelineCategory =
  | "matriculation"
  | "academic"
  | "social"
  | "milestone"
  | "graduation";

export interface TimelineEntryEntity {
  id: string;
  /** "YYYY-MM-DD" or "YYYY-MM" */
  date: string;
  /** Headline title, max 6 words */
  milestone: string;
  description?: string;
  image?: string;
  category?: TimelineCategory;
  publishStatus?: "draft" | "published" | "archived";
}
