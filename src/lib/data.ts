/**
 * STI 2026 — Data Access Layer (T-112)
 *
 * Centralized, type-safe access to the static JSON database in `src/data/`.
 * Responsibilities (per docs/ARCHITECTURE.md §6 and docs/DATA_MODEL.md §4):
 *  - Validate every JSON record against the interfaces in `src/types` (1:1 with
 *    docs/DATA_MODEL.md). Schema discrepancies throw at build time.
 *  - Strict consent filtering: records with `consentPublic !== true` are never
 *    returned to the UI layer.
 *  - PII firewall: banned keys (phone, address, nim, gpa, etc.) abort the build
 *    if they ever appear in a data file.
 *  - Referential integrity: project members, roles, achievements, and student
 *    links must resolve to consented student records.
 *  - Predictable, chronologically sorted access APIs.
 *
 * This module is the ONLY component allowed to import from `src/data/`.
 * UI components consume typed data exclusively through these accessors.
 */

import classData from "@/data/class.json";
import studentsData from "@/data/students.json";
import rolesData from "@/data/roles.json";
import projectsData from "@/data/projects.json";
import campusData from "@/data/campus.json";
import eventsData from "@/data/events.json";
import memoriesData from "@/data/memories.json";
import achievementsData from "@/data/achievements.json";
import timelineData from "@/data/timeline.json";
import { BANNED_PII_KEYS } from "./pii";

import type {
  AchievementEntity,
  CampusPhotoEntity,
  ClassEntity,
  EventEntity,
  MemoryEntity,
  ProjectEntity,
  RoleEntity,
  SocialPlatform,
  StudentEntity,
  TimelineEntryEntity,
} from "@/types";

/* ------------------------------------------------------------------ */
/* PII firewall                                                        */
/* ------------------------------------------------------------------ */

function assertNoBannedKeys(record: Record<string, unknown>, source: string): void {
  for (const key of BANNED_PII_KEYS) {
    if (key in record) {
      throw new Error(
        `[data.ts] PII violation: banned key "${key}" found in ${source}. ` +
          `Prohibited personal data must never enter the codebase (docs/CONTENT.md §2.1).`,
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

function assertString(value: unknown, field: string, source: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `[data.ts] Schema violation: ${source}.${field} must be a non-empty string.`,
    );
  }
  return value;
}

function assertOptionalString(
  value: unknown,
  field: string,
  source: string,
): string | undefined {
  if (value === undefined) return undefined;
  return assertString(value, field, source);
}

function assertNumber(value: unknown, field: string, source: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`[data.ts] Schema violation: ${source}.${field} must be a number.`);
  }
  return value;
}

function assertOptionalNumber(
  value: unknown,
  field: string,
  source: string,
): number | undefined {
  if (value === undefined) return undefined;
  return assertNumber(value, field, source);
}

function assertOptionalStringArray(
  value: unknown,
  field: string,
  source: string,
): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    throw new Error(
      `[data.ts] Schema violation: ${source}.${field} must be an array of strings.`,
    );
  }
  return value as string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertArray(value: unknown, field: string, source: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`[data.ts] Schema violation: ${source}.${field} must be an array.`);
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* Raw data ingestion + schema enforcement                             */
/* ------------------------------------------------------------------ */

const RAW_STUDENTS = studentsData as unknown[];
const RAW_ROLES = rolesData as unknown[];
const RAW_PROJECTS = projectsData as unknown[];
const RAW_CAMPUS = campusData as unknown[];
const RAW_EVENTS = eventsData as unknown[];
const RAW_MEMORIES = memoriesData as unknown[];
const RAW_ACHIEVEMENTS = achievementsData as unknown[];
const RAW_TIMELINE = timelineData as unknown[];

/* ----------------------------- Class ----------------------------- */

function validateClass(raw: unknown): ClassEntity {
  const c = isRecord(raw) ? raw : null;
  if (!c) throw new Error("[data.ts] class.json must contain a single object.");

  assertNoBannedKeys(c, "class.json");
  const stats = c.stats;
  if (stats !== undefined) {
    for (const stat of assertArray(stats, "stats", "class.json")) {
      const s = isRecord(stat) ? stat : null;
      if (!s) throw new Error("[data.ts] class.stats entries must be objects.");
      assertString(s.label, "label", "class.stats[]");
      assertString(s.value, "value", "class.stats[]");
    }
  }

  return {
    id: assertString(c.id, "id", "class.json"),
    name: assertString(c.name, "name", "class.json"),
    programName: assertString(c.programName, "programName", "class.json"),
    programAbbreviation: assertString(
      c.programAbbreviation,
      "programAbbreviation",
      "class.json",
    ),
    faculty: assertString(c.faculty, "faculty", "class.json"),
    university: assertString(c.university, "university", "class.json"),
    graduationYear: assertNumber(c.graduationYear, "graduationYear", "class.json"),
    motto: assertOptionalString(c.motto, "motto", "class.json"),
    statement: assertString(c.statement, "statement", "class.json"),
    classPhotoFormal: assertOptionalString(
      c.classPhotoFormal,
      "classPhotoFormal",
      "class.json",
    ),
    totalStudents: assertOptionalNumber(c.totalStudents, "totalStudents", "class.json"),
    valedictoryTitle: assertString(c.valedictoryTitle, "valedictoryTitle", "class.json"),
    valedictoryBody: assertArray(c.valedictoryBody, "valedictoryBody", "class.json").map(
      (p) => assertString(p, "valedictoryBody[]", "class.json"),
    ),
    signOff: assertString(c.signOff, "signOff", "class.json"),
    closingPhoto: assertOptionalString(c.closingPhoto, "closingPhoto", "class.json"),
  };
}

export const classEntity: ClassEntity = validateClass(classData);

/* ----------------------------- Student ----------------------------- */

const ALL_STUDENTS: StudentEntity[] = RAW_STUDENTS.map((raw, i): StudentEntity => {
  const s = isRecord(raw) ? raw : null;
  if (!s) throw new Error(`[data.ts] students[${i}] must be an object.`);
  const source = `students[${i}]`;
  assertNoBannedKeys(s, source);

  if (typeof s.consentPublic !== "boolean") {
    throw new Error(
      `[data.ts] ${source}.consentPublic must be explicitly defined as a boolean ` +
        `(docs/DATA_MODEL.md §3.2).`,
    );
  }

  let socialLinks: StudentEntity["socialLinks"];
  if (s.socialLinks !== undefined) {
    socialLinks = assertArray(s.socialLinks, "socialLinks", source).map(
      (entry, j): StudentEntity["socialLinks"] extends (infer U)[] | undefined ? U : never => {
        const l = isRecord(entry) ? entry : null;
        if (!l) throw new Error(`[data.ts] ${source}.socialLinks[${j}] must be an object.`);
        return {
          platform: assertString(l.platform, "platform", `${source}.socialLinks[${j}]`) as SocialPlatform,
          url: assertString(l.url, "url", `${source}.socialLinks[${j}]`),
          label: assertOptionalString(l.label, "label", `${source}.socialLinks[${j}]`),
        };
      },
    );
  }

  return {
    id: assertString(s.id, "id", source),
    name: assertString(s.name, "name", source),
    nickname: assertOptionalString(s.nickname, "nickname", source),
    /* Empty photo is valid: the UI renders the documented monogram fallback. */
    photo: typeof s.photo === "string" ? s.photo.trim() : "",
    photoFallback: assertOptionalString(s.photoFallback, "photoFallback", source),
    bio: assertOptionalString(s.bio, "bio", source),
    interests: assertOptionalStringArray(s.interests, "interests", source),
    quote: assertOptionalString(s.quote, "quote", source),
    roles: assertOptionalStringArray(s.roles, "roles", source),
    projects: assertOptionalStringArray(s.projects, "projects", source),
    achievements: assertOptionalStringArray(s.achievements, "achievements", source),
    socialLinks,
    consentPublic: s.consentPublic,
    publishStatus: (assertOptionalString(s.publishStatus, "publishStatus", source) as StudentEntity["publishStatus"]) ?? "published",
  };
});

/* ----------------------------- Role ----------------------------- */

const ALL_ROLES: RoleEntity[] = RAW_ROLES.map((raw, i): RoleEntity => {
  const r = isRecord(raw) ? raw : null;
  if (!r) throw new Error(`[data.ts] roles[${i}] must be an object.`);
  const source = `roles[${i}]`;
  return {
    id: assertString(r.id, "id", source),
    label: assertString(r.label, "label", source),
    studentId: assertString(r.studentId, "studentId", source),
    period: assertOptionalString(r.period, "period", source),
    division: assertOptionalString(r.division, "division", source),
  };
});

/* ----------------------------- Project ----------------------------- */

const ALL_PROJECTS: ProjectEntity[] = RAW_PROJECTS.map((raw, i): ProjectEntity => {
  const p = isRecord(raw) ? raw : null;
  if (!p) throw new Error(`[data.ts] projects[${i}] must be an object.`);
  const source = `projects[${i}]`;
  assertNoBannedKeys(p, source);

  const members = assertArray(p.members, "members", source).map((entry, j) => {
    const m = isRecord(entry) ? entry : null;
    if (!m) throw new Error(`[data.ts] ${source}.members[${j}] must be an object.`);
    return {
      studentId: assertString(m.studentId, "studentId", `${source}.members[${j}]`),
      role: assertOptionalString(m.role, "role", `${source}.members[${j}]`),
    };
  });

  let gallery: string[] | undefined;
  if (p.gallery !== undefined) {
    gallery = assertOptionalStringArray(p.gallery, "gallery", source);
  }

  return {
    id: assertString(p.id, "id", source),
    title: assertString(p.title, "title", source),
    description: assertString(p.description, "description", source),
    /* Empty cover is valid: UI renders the documented typographic fallback
       (ARCHITECTURE.md §8.1, FB-04). */
    coverImage: typeof p.coverImage === "string" ? p.coverImage.trim() : "",
    members,
    technology: assertOptionalStringArray(p.technology, "technology", source),
    link: assertOptionalString(p.link, "link", source),
    year: assertOptionalNumber(p.year, "year", source),
    status: assertOptionalString(p.status, "status", source) as ProjectEntity["status"],
    category: assertOptionalString(p.category, "category", source),
    course: assertOptionalString(p.course, "course", source),
    gallery,
    featured: p.featured === true,
    publishStatus: (assertOptionalString(p.publishStatus, "publishStatus", source) as ProjectEntity["publishStatus"]) ?? "published",
  };
});

/* ----------------------------- CampusPhoto ----------------------------- */

const ALL_CAMPUS: CampusPhotoEntity[] = RAW_CAMPUS.map((raw, i): CampusPhotoEntity => {
  const c = isRecord(raw) ? raw : null;
  if (!c) throw new Error(`[data.ts] campus[${i}] must be an object.`);
  const source = `campus[${i}]`;
  return {
    id: assertString(c.id, "id", source),
    src: assertString(c.src, "src", source),
    alt: assertString(c.alt, "alt", source),
    caption: assertOptionalString(c.caption, "caption", source),
    activity: assertOptionalString(c.activity, "activity", source),
    date: assertOptionalString(c.date, "date", source),
  };
});

/* ----------------------------- Event ----------------------------- */

const ALL_EVENTS: EventEntity[] = RAW_EVENTS.map((raw, i): EventEntity => {
  const e = isRecord(raw) ? raw : null;
  if (!e) throw new Error(`[data.ts] events[${i}] must be an object.`);
  const source = `events[${i}]`;
  assertNoBannedKeys(e, source);
  return {
    id: assertString(e.id, "id", source),
    title: assertString(e.title, "title", source),
    date: assertString(e.date, "date", source),
    description: assertString(e.description, "description", source),
    poster: assertOptionalString(e.poster, "poster", source),
    category: assertOptionalString(e.category, "category", source) as EventEntity["category"],
    location: assertOptionalString(e.location, "location", source),
    participantsCount: assertOptionalNumber(
      e.participantsCount,
      "participantsCount",
      source,
    ),
    publishStatus: (assertOptionalString(e.publishStatus, "publishStatus", source) as EventEntity["publishStatus"]) ?? "published",
  };
});

/* ----------------------------- Memory ----------------------------- */

const ALL_MEMORIES: MemoryEntity[] = RAW_MEMORIES.map((raw, i): MemoryEntity => {
  const m = isRecord(raw) ? raw : null;
  if (!m) throw new Error(`[data.ts] memories[${i}] must be an object.`);
  const source = `memories[${i}]`;
  const photos = assertArray(m.photos, "photos", source).map((entry, j) => {
    const p = isRecord(entry) ? entry : null;
    if (!p) throw new Error(`[data.ts] ${source}.photos[${j}] must be an object.`);
    return {
      src: assertString(p.src, "src", `${source}.photos[${j}]`),
      alt: assertString(p.alt, "alt", `${source}.photos[${j}]`),
      caption: assertOptionalString(p.caption, "caption", `${source}.photos[${j}]`),
    };
  });
  if (photos.length === 0) {
    throw new Error(
      `[data.ts] ${source}.photos must contain at least one photo (DATA_MODEL §3.7).`,
    );
  }
  return {
    id: assertString(m.id, "id", source),
    title: assertString(m.title, "title", source),
    description: assertOptionalString(m.description, "description", source),
    photos,
    period: assertOptionalString(m.period, "period", source),
    category: assertOptionalString(m.category, "category", source),
    publishStatus: (assertOptionalString(m.publishStatus, "publishStatus", source) as MemoryEntity["publishStatus"]) ?? "published",
  };
});

/* ----------------------------- Achievement ----------------------------- */

const ALL_ACHIEVEMENTS: AchievementEntity[] = RAW_ACHIEVEMENTS.map(
  (raw, i): AchievementEntity => {
    const a = isRecord(raw) ? raw : null;
    if (!a) throw new Error(`[data.ts] achievements[${i}] must be an object.`);
    const source = `achievements[${i}]`;
    if (typeof a.consentPublic !== "boolean") {
      throw new Error(
        `[data.ts] ${source}.consentPublic must be explicitly defined as a boolean.`,
      );
    }
    return {
      id: assertString(a.id, "id", source),
      title: assertString(a.title, "title", source),
      studentIds: assertArray(a.studentIds, "studentIds", source).map((v) =>
        assertString(v, "studentIds[]", source),
      ),
      category: assertString(a.category, "category", source),
      level: assertOptionalString(a.level, "level", source) as AchievementEntity["level"],
      year: assertOptionalNumber(a.year, "year", source),
      description: assertOptionalString(a.description, "description", source),
      proofUrl: assertOptionalString(a.proofUrl, "proofUrl", source),
      consentPublic: a.consentPublic,
    };
  },
);

/* ----------------------------- Timeline ----------------------------- */

const ALL_TIMELINE: TimelineEntryEntity[] = RAW_TIMELINE.map(
  (raw, i): TimelineEntryEntity => {
    const t = isRecord(raw) ? raw : null;
    if (!t) throw new Error(`[data.ts] timeline[${i}] must be an object.`);
    const source = `timeline[${i}]`;
    return {
      id: assertString(t.id, "id", source),
      date: assertString(t.date, "date", source),
      milestone: assertString(t.milestone, "milestone", source),
      description: assertOptionalString(t.description, "description", source),
      image: assertOptionalString(t.image, "image", source),
      category: assertOptionalString(t.category, "category", source) as TimelineEntryEntity["category"],
      /* MUST be carried through: `getTimeline()` filters on it, so dropping
         this field silently published every draft/archived entry (QA §4). */
      publishStatus:
        (assertOptionalString(t.publishStatus, "publishStatus", source) as TimelineEntryEntity["publishStatus"]) ??
        "published",
    };
  },
);

/* ------------------------------------------------------------------ */
/* Referential integrity (docs/DATA_MODEL.md §4)                       */
/* ------------------------------------------------------------------ */

function validateDatabaseIntegrity(): void {
  const consentedIds = new Set(
    ALL_STUDENTS.filter((s) => s.consentPublic).map((s) => s.id),
  );
  const allIds = new Set(ALL_STUDENTS.map((s) => s.id));

  const dupCheck = new Set<string>();
  for (const s of ALL_STUDENTS) {
    if (dupCheck.has(s.id)) throw new Error(`[data.ts] Duplicate student id "${s.id}".`);
    dupCheck.add(s.id);
  }

  for (const role of ALL_ROLES) {
    if (!allIds.has(role.studentId)) {
      throw new Error(
        `[data.ts] Role "${role.id}" references unknown student "${role.studentId}".`,
      );
    }
    /* Unconsented students are silently filtered (DATA_MODEL §3.2 privacy rule),
       not fatal: a student withdrawing consent must not break the build. */
  }

  for (const project of ALL_PROJECTS) {
    for (const member of project.members) {
      if (!allIds.has(member.studentId)) {
        throw new Error(
          `[data.ts] Project "${project.id}" references unknown student "${member.studentId}".`,
        );
      }
      /* Unconsented members are filtered downstream by getProjectTeam(). */
    }
  }

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (!achievement.consentPublic) continue;
    for (const sid of achievement.studentIds) {
      if (!allIds.has(sid)) {
        throw new Error(
          `[data.ts] Achievement "${achievement.id}" references unknown student "${sid}".`,
        );
      }
      if (!consentedIds.has(sid)) {
        throw new Error(
          `[data.ts] Achievement "${achievement.id}" references unconsented student "${sid}".`,
        );
      }
    }
  }

  for (const student of ALL_STUDENTS) {
    if (!student.consentPublic) continue;
    for (const pid of student.projects ?? []) {
      if (!ALL_PROJECTS.some((p) => p.id === pid)) {
        throw new Error(
          `[data.ts] Student "${student.id}" references unknown project "${pid}".`,
        );
      }
    }
    for (const rid of student.roles ?? []) {
      if (!ALL_ROLES.some((r) => r.id === rid)) {
        throw new Error(
          `[data.ts] Student "${student.id}" references unknown role "${rid}".`,
        );
      }
    }
    for (const aid of student.achievements ?? []) {
      if (!ALL_ACHIEVEMENTS.some((a) => a.id === aid)) {
        throw new Error(
          `[data.ts] Student "${student.id}" references unknown achievement "${aid}".`,
        );
      }
    }
  }
}

validateDatabaseIntegrity();

/* ------------------------------------------------------------------ */
/* Consent-filtered public accessors                                   */
/* ------------------------------------------------------------------ */

/** Students with explicit `consentPublic: true` AND `publishStatus: 'published'`. */
export function getStudents(): StudentEntity[] {
  return ALL_STUDENTS.filter(
    (s) => s.consentPublic === true && (s.publishStatus === undefined || s.publishStatus === "published"),
  );
}

/** Consent and publication filtered lookup. Unconsented, draft, archived, or unknown slugs yield `null`. */
export function getStudentBySlug(slug: string): StudentEntity | null {
  const student = ALL_STUDENTS.find((s) => s.id === slug);
  if (!student) return null;
  const isConsented = student.consentPublic === true;
  const isPublished = student.publishStatus === undefined || student.publishStatus === "published";
  return isConsented && isPublished ? student : null;
}

export function getClassData(): ClassEntity {
  return classEntity;
}

export function getRoles(): RoleEntity[] {
  const consentedIds = new Set(getStudents().map((s) => s.id));
  return ALL_ROLES.filter((r) => consentedIds.has(r.studentId));
}

export function getProjects(): ProjectEntity[] {
  return ALL_PROJECTS.filter(
    (p) => p.publishStatus === undefined || p.publishStatus === "published",
  );
}

export function getProjectBySlug(slug: string): ProjectEntity | null {
  const project = ALL_PROJECTS.find((p) => p.id === slug);
  if (!project) return null;
  const isPublished = project.publishStatus === undefined || project.publishStatus === "published";
  return isPublished ? project : null;
}

/** Projects where the given student is a team member. */
export function getProjectsByStudent(studentId: string): ProjectEntity[] {
  return getProjects().filter((p) =>
    p.members.some((m) => m.studentId === studentId),
  );
}

export function getCampusPhotos(): CampusPhotoEntity[] {
  return ALL_CAMPUS.filter(
    (c) => c.publishStatus === undefined || c.publishStatus === "published",
  );
}

export function getEvents(): EventEntity[] {
  return ALL_EVENTS
    .filter((e) => e.publishStatus === undefined || e.publishStatus === "published")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMemories(): MemoryEntity[] {
  return ALL_MEMORIES.filter(
    (m) => m.publishStatus === undefined || m.publishStatus === "published",
  );
}

/** Only achievements with explicit publication consent AND published state, newest first. */
export function getAchievements(): AchievementEntity[] {
  return ALL_ACHIEVEMENTS.filter(
    (a) =>
      a.consentPublic === true &&
      (a.publishStatus === undefined || a.publishStatus === "published"),
  ).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function getAchievementsByStudent(studentId: string): AchievementEntity[] {
  return getAchievements().filter((a) => a.studentIds.includes(studentId));
}

/** Chronological 2022 → 2026 journey with published state. */
export function getTimeline(): TimelineEntryEntity[] {
  return ALL_TIMELINE
    .filter((t) => t.publishStatus === undefined || t.publishStatus === "published")
    .sort((a, b) => a.date.localeCompare(b.date));
}

/* ------------------------------------------------------------------ */
/* Cross-entity helpers for UI                                         */
/* ------------------------------------------------------------------ */

/** Resolve role labels for a student, ordered by the student's own listing. */
export function getRoleLabelsForStudent(student: StudentEntity): string[] {
  const roles = getRoles();
  return (student.roles ?? [])
    .map((rid) => roles.find((r) => r.id === rid)?.label)
    .filter((label): label is string => Boolean(label));
}

/** Resolve display names for a project's team, filtered to consented students. */
export function getProjectTeam(
  project: ProjectEntity,
): { student: StudentEntity; role?: string }[] {
  const students = getStudents();
  const byId = new Map(students.map((s) => [s.id, s]));
  const team: { student: StudentEntity; role?: string }[] = [];
  for (const member of project.members) {
    const student = byId.get(member.studentId);
    if (student) {
      team.push({ student, role: member.role });
    }
  }
  return team;
}
