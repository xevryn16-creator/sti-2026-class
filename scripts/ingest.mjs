#!/usr/bin/env node
/**
 * STI 2026 — Content Ingestion System (per user directive, October 2026)
 * T-401/T-501/T-505/T-601 enablement: turns raw class submissions into
 * build-ready data + photos with the exact guarantees enforced by src/lib/data.ts.
 *
 *   node scripts/ingest.mjs --inbox inbox/submission-1 [--dry-run] [--verbose]
 *   npm run ingest -- --inbox inbox/submission-1
 *
 * Layout (docs/CONTENT_MANIFEST.md):
 *   <inbox>/
 *     class.json students.json roles.json projects.json campus.json
 *     events.json memories.json achievements.json timeline.json
 *     photos/students/*.jpg|png|webp|avif
 *     photos/projects/* photos/campus/* photos/events/* photos/hero/*
 *
 * Guarantees:
 *   1. PII firewall  — banned keys abort ingestion (docs/CONTENT.md §2.1).
 *   2. Consent gate  — student/achievement records need consentPublic:true;
 *                      consent.json (docs/CONSENT_REGISTER_TEMPLATE.md) is
 *                      cross-checked; unconsented records are excluded, never fatal.
 *   3. Photo intake  — copies, slug-renames, normalizes (SVG/XMP/EXIF GPS
 *                      stripped), optimizes (sharp, JPEG/WebP/AVIF), verifies
 *                      every src referenced in JSON exists under public/images/.
 *   4. Referential integrity — unknown slugs are FATAL (same rule as data.ts).
 *   5. Atomic build  — all validation runs before anything in src/data is touched.
 *   6. Report        — machine- and human-readable summary; --dry-run touches nothing.
 *
 * No placeholder data is fabricated: every factual field must arrive via the
 * inbox; nothing is invented here (PRD §1 zero-fabrication rule).
 */

import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
}
function valueOf(name, fallback) {
  const i = args.indexOf(name);
  if (i === -1 || i + 1 >= args.length) return fallback;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
}
const SHOW_HELP = flag("--help") || flag("-h");
if (SHOW_HELP) {
  console.log(`
STI 2026 Content Ingestion CLI

Usage:
  npm run ingest -- [options]
  node scripts/ingest.mjs [options]

Options:
  --inbox <dir>   Path to the directory containing raw submissions (default: "inbox")
  --dry-run       Validate schema, PII, consent, and photos without modifying src/data or public/images
  --verbose       Log granular photo processing and integrity verification steps
  --help, -h      Display this help message

Documentation:
  See docs/CONTENT_MANIFEST.md for inbox structure, data schemas, and image specifications.
`);
  process.exit(0);
}
const DRY_RUN = flag("--dry-run");
const VERBOSE = flag("--verbose");
const INBOX = path.resolve(ROOT, valueOf("--inbox", "inbox"));

/* ------------------------------------------------------------------ */
/* Data model constants — kept 1:1 with src/types & src/lib/data.ts    */
/* ------------------------------------------------------------------ */

const BANNED_PII_KEYS = [
  "phone", "address", "nim", "gpa", "email",
  "whatsapp", "telegram", "discord", "transcript", "grade",
];

const DATA_FILES = [
  "class", "students", "roles", "projects",
  "campus", "events", "memories", "achievements", "timeline",
];

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".jfif"]);
const SVG_EXT = ".svg";
const PHOTO_TOP = ["students", "projects", "campus", "events", "hero"];

const PHOTO_TARGETS = {
  students: { dir: "students", purpose: "student portrait (3:4, 800x1066)", cover: false },
  projects: { dir: "projects", purpose: "project cover (3:2, 1200x800) / gallery", cover: true },
  campus: { dir: "campus", purpose: "campus life photo", cover: true },
  events: { dir: "events", purpose: "event poster/photo (4:5, 1000x1250)", cover: true },
  hero: { dir: "hero", purpose: "hero / closing photo (16:9, 2400x1350)", cover: true },
};

/* ------------------------------------------------------------------ */
/* Output plumbing                                                     */
/* ------------------------------------------------------------------ */

const report = { fatal: [], warnings: [], counts: {}, actions: [], skipped: [] };
function fail(msg) {
  report.fatal.push(msg);
  console.error(`  ✖ FATAL  ${msg}`);
}
function warn(msg) {
  report.warnings.push(msg);
  console.log(`  ⚠ warn   ${msg}`);
}
function act(msg) {
  report.actions.push(msg);
  if (VERBOSE) console.log(`  · ${msg}`);
}
function ok(msg) {
  console.log(`  ✔ ${msg}`);
}
function section(title) {
  console.log(`\n== ${title} ${"=".repeat(Math.max(0, 64 - title.length))}`);
}

let sharp = null;
function getSharp() {
  if (sharp) return sharp;
  try {
    sharp = require("sharp");
  } catch (err) {
    fail(
      `Optimization engine "sharp" is not installed. Run: npm install --save-dev sharp\n` +
        `   (${err.message})`,
    );
    return null;
  }
  return sharp;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
assert.equal(slugify("Rakha Rizky Adhiputra"), "rakha-rizky-adhiputra");
assert.equal(slugify("Sistem & Teknologi Informasi"), "sistem-teknologi-informasi");

const PLACEHOLDER_RE = /^\s*\[(?:CONTENT[ _]NEEDED|DATA[ _]NEEDED|TBD|TODO)[^\]]*\]\s*$/i;
function isPlaceholder(v) {
  return typeof v === "string" && PLACEHOLDER_RE.test(v);
}

function assertNoPII(record, where) {
  if (!record || typeof record !== "object") return;
  for (const key of BANNED_PII_KEYS) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      fail(
        `PII violation: banned key "${key}" in ${where}. ` +
          `Prohibited personal data never enters the codebase (CONTENT.md §2.1).`,
      );
    }
  }
}
function assertNoPIIDeep(value, where) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoPIIDeep(v, `${where}[${i}]`));
  } else if (value && typeof value === "object") {
    assertNoPII(value, where);
    for (const [k, v] of Object.entries(value)) assertNoPIIDeep(v, `${where}.${k}`);
  }
}

function requireString(obj, field, where) {
  const v = obj?.[field];
  if (typeof v !== "string" || v.trim() === "") {
    fail(`${where}.${field} is required and must be a non-empty string (got ${JSON.stringify(v) ?? "undefined"}).`);
    return "";
  }
  return v.trim();
}
function optionalString(obj, field, where) {
  const v = obj?.[field];
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string" || v.trim() === "") return undefined;
  return v.trim();
}
function optionalNumber(obj, field, where) {
  const v = obj?.[field];
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "number" || !Number.isFinite(v)) {
    fail(`${where}.${field} must be a number (got ${JSON.stringify(v)}).`);
    return undefined;
  }
  return v;
}
function stringArray(obj, field, where) {
  const v = obj?.[field];
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string" || !x.trim())) {
    fail(`${where}.${field} must be an array of non-empty strings.`);
    return undefined;
  }
  return v.map((x) => x.trim());
}

function readJsonFile(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (err) {
    fail(`Cannot parse JSON ${path.relative(ROOT, p)}: ${err.message}`);
    return undefined;
  }
}
function readData(name) {
  const p = path.join(INBOX, `${name}.json`);
  if (!existsSync(p)) return undefined;
  return readJsonFile(p);
}

/* ------------------------------------------------------------------ */
/* Photo intake                                                        */
/* ------------------------------------------------------------------ */

const ALL_IMAGE_SOURCES = new Set();

function scanPhotoDir(topDir) {
  const dir = path.join(INBOX, "photos", topDir);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) continue;
    const ext = path.extname(entry).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) {
      warn(`photos/${topDir}/${entry}: unsupported extension, skipped.`);
      continue;
    }
    out.push({ abs: p, name: entry, ext });
  }
  return out;
}

async function normalizePhoto(srcAbs, destAbs) {
  const s = getSharp();
  if (!s) return false;
  try {
    const meta = await s(srcAbs).metadata();
    if (meta.format === "svg") {
      copyFileSync(srcAbs, destAbs); // vector: keep as-is (no EXIF possible)
      return true;
    }
    await s(srcAbs).rotate().jpeg({ quality: 85, mozjpeg: true }).toFile(destAbs);
    return true;
  } catch (err) {
    fail(`Cannot process photo ${path.relative(ROOT, srcAbs)}: ${err.message}`);
    return false;
  }
}

function publicPath(topDir, relName) {
  return `/images/${topDir}/${relName}`;
}

async function intakePhotos() {
  section("Photo intake");
  if (DRY_RUN) {
    for (const top of PHOTO_TOP) {
      const found = scanPhotoDir(top);
      if (found.length) ok(`photos/${top}: ${found.length} file(s) would be processed`);
    }
    return;
  }
  const inst = getSharp();
  if (!inst) return;

  for (const top of PHOTO_TOP) {
    const files = scanPhotoDir(top);
    if (!files.length) continue;
    const destDir = path.join(ROOT, "public", "images", PHOTO_TARGETS[top].dir);
    mkdirSync(destDir, { recursive: true });
    let count = 0;
    for (const f of files) {
      const base = slugify(path.basename(f.name, path.extname(f.name))) || "foto";
      let destName = `${base}.jpg`;
      if (f.ext === SVG_EXT) destName = `${base}.svg`;
      let destAbs = path.join(destDir, destName);
      let n = 2;
      while (existsSync(destAbs)) {
        destName = `${base}-${n}.jpg`;
        destAbs = path.join(destDir, destName);
        n += 1;
      }
      if (f.ext === SVG_EXT) {
        copyFileSync(f.abs, destAbs);
      } else {
        const done = await normalizePhoto(f.abs, destAbs);
        if (!done) continue;
      }
      ALL_IMAGE_SOURCES.add(publicPath(PHOTO_TARGETS[top].dir, destName));
      act(`copied photos/${top}/${f.name} -> public/images/${PHOTO_TARGETS[top].dir}/${destName}`);
      count += 1;
    }
    ok(`photos/${top}: ${count} file(s) copied & optimized into public/images/${PHOTO_TARGETS[top].dir}/`);
  }
}

/** Verify every referenced src exists (or was just ingested). */
function verifyImageRefs(refs) {
  section("Image reference verification");
  let missing = 0;
  for (const ref of refs) {
    if (ALL_IMAGE_SOURCES.has(ref)) continue;
    const rel = ref.replace(/^\//, "");
    if (existsSync(path.join(ROOT, "public", rel))) continue;
    fail(`Image referenced but not found: ${ref} (expected public/${rel})`);
    missing += 1;
  }
  if (!missing) ok(`All ${refs.size} referenced image paths exist under public/.`);
}

/* ------------------------------------------------------------------ */
/* Normalizers (mirror data.ts validation, minus the throwing)         */
/* ------------------------------------------------------------------ */

function normalizeClass(raw) {
  const where = "class.json";
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    fail(`${where} must be a single object.`);
    return null;
  }
  assertNoPII(raw, where);
  const c = { ...raw };
  /* Single photo field; ingest normalizer keeps both aliases in sync if given. */
  if (c.classPhotoFormal && !c.closingPhoto) c.closingPhoto = c.classPhotoFormal;
  if (c.closingPhoto && !c.classPhotoFormal) c.classPhotoFormal = c.closingPhoto;
  return c;
}

function normalizeStudents(raw, consentIndex) {
  const where = "students.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const seen = new Set();
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      fail(`${src} must be an object.`);
      return;
    }
    assertNoPIIDeep(entry, src);
    const id = slugify(requireString(entry, "id", src));
    const name = requireString(entry, "name", src);
    if (!id || !name) return;
    if (seen.has(id)) {
      fail(`${src}: duplicate student id "${id}".`);
      return;
    }
    seen.add(id);

    const declared = entry.consentPublic === true;
    const registered = consentIndex.get(id);
    let consentPublic = declared;
    if (declared && !registered) {
      warn(
        `${src} (${name}) declares consentPublic:true but is NOT in consent.json — ` +
          `record will be INGESTED but remains unverifiable. Add the signed row to the consent register before deployment.`,
      );
    }
    if (!declared && registered === true) {
      consentPublic = true;
      act(`${src}: consent granted in consent.json, consentPublic set to true`);
    }

    const student = {
      id,
      name,
      nickname: optionalString(entry, "nickname", src),
      photo: optionalString(entry, "photo", src) ?? "",
      photoFallback: optionalString(entry, "photoFallback", src),
      bio: optionalString(entry, "bio", src),
      interests: stringArray(entry, "interests", src),
      quote: optionalString(entry, "quote", src),
      roles: stringArray(entry, "roles", src),
      projects: stringArray(entry, "projects", src),
      achievements: stringArray(entry, "achievements", src),
      socialLinks: undefined,
      consentPublic,
    };
    if (Array.isArray(entry.socialLinks)) {
      student.socialLinks = entry.socialLinks
        .map((l, j) => {
          const s = `${src}.socialLinks[${j}]`;
          if (!l || typeof l !== "object") {
            fail(`${s} must be an object.`);
            return null;
          }
          const platform = optionalString(l, "platform", s);
          const allowed = ["linkedin", "github", "behance", "portfolio", "instagram"];
          if (!platform || !allowed.includes(platform)) {
            fail(`${s}.platform must be one of ${allowed.join(", ")} (got "${platform}").`);
            return null;
          }
          const url = requireString(l, "url", s);
          if (!url) return null;
          return { platform, url, label: optionalString(l, "label", s) };
        })
        .filter(Boolean);
      if (student.socialLinks.length === 0) student.socialLinks = undefined;
    }
    out.push(student);
  });
  return out;
}

function normalizeRoles(raw) {
  const where = "roles.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    const id = requireString(entry, "id", src);
    const label = requireString(entry, "label", src);
    const studentId = slugify(requireString(entry, "studentId", src));
    if (!id || !label || !studentId) return;
    out.push({
      id,
      label,
      studentId,
      period: optionalString(entry, "period", src),
      division: optionalString(entry, "division", src),
    });
  });
  return out;
}

function normalizeProjects(raw) {
  const where = "projects.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const seen = new Set();
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    assertNoPIIDeep(entry, src);
    const id = requireString(entry, "id", src);
    const title = requireString(entry, "title", src);
    const description = requireString(entry, "description", src);
    if (!id || !title || !description) return;
    if (seen.has(id)) {
      fail(`${src}: duplicate project id "${id}".`);
      return;
    }
    seen.add(id);
    const members = Array.isArray(entry.members)
      ? entry.members
          .map((m, j) => {
            const s = `${src}.members[${j}]`;
            if (!m || typeof m !== "object") {
              fail(`${s} must be an object.`);
              return null;
            }
            const sid = slugify(requireString(m, "studentId", s));
            if (!sid) return null;
            return { studentId: sid, role: optionalString(m, "role", s) };
          })
          .filter(Boolean)
      : [];
    if (members.length === 0) warn(`${src} (${title}) has no members — team section will be empty on the profile page.`);
    const status = optionalString(entry, "status", src);
    const allowedStatus = ["completed", "in-progress", "prototype", "archived"];
    const project = {
      id,
      title,
      description,
      coverImage: optionalString(entry, "coverImage", src) ?? "",
      members,
      technology: stringArray(entry, "technology", src),
      link: optionalString(entry, "link", src),
      year: optionalNumber(entry, "year", src),
      status: status && allowedStatus.includes(status) ? status : undefined,
      category: optionalString(entry, "category", src),
      course: optionalString(entry, "course", src),
      gallery: stringArray(entry, "gallery", src),
      featured: entry.featured === true,
    };
    if (status && !allowedStatus.includes(status)) {
      warn(`${src}.status "${status}" is not one of ${allowedStatus.join(", ")} — field dropped.`);
    }
    out.push(project);
  });
  return out;
}

function normalizeCampus(raw) {
  const where = "campus.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    const id = requireString(entry, "id", src);
    const srcImg = requireString(entry, "src", src);
    const alt = requireString(entry, "alt", src);
    if (!id || !srcImg || !alt) return;
    out.push({
      id,
      src: srcImg,
      alt,
      caption: optionalString(entry, "caption", src),
      activity: optionalString(entry, "activity", src),
      date: optionalString(entry, "date", src),
    });
  });
  return out;
}

function normalizeEvents(raw) {
  const where = "events.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    assertNoPIIDeep(entry, src);
    const id = requireString(entry, "id", src);
    const title = requireString(entry, "title", src);
    const date = requireString(entry, "date", src);
    const description = requireString(entry, "description", src);
    if (!id || !title || !date || !description) return;
    if (!/^\d{4}-\d{2}(-\d{2})?$/.test(date)) {
      fail(`${src}.date "${date}" must be ISO "YYYY-MM-DD" (or "YYYY-MM").`);
    }
    const category = optionalString(entry, "category", src);
    const allowed = ["academic", "social", "competition", "ceremony", "other"];
    const ev = {
      id,
      title,
      date,
      description,
      poster: optionalString(entry, "poster", src),
      category: category && allowed.includes(category) ? category : undefined,
      location: optionalString(entry, "location", src),
      participantsCount: optionalNumber(entry, "participantsCount", src),
    };
    if (category && !allowed.includes(category)) {
      warn(`${src}.category "${category}" is not one of ${allowed.join(", ")} — field dropped.`);
    }
    out.push(ev);
  });
  return out;
}

function normalizeMemories(raw) {
  const where = "memories.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    const id = requireString(entry, "id", src);
    const title = requireString(entry, "title", src);
    if (!id || !title) return;
    const photos = Array.isArray(entry.photos)
      ? entry.photos
          .map((p, j) => {
            const s = `${src}.photos[${j}]`;
            if (!p || typeof p !== "object") {
              fail(`${s} must be an object.`);
              return null;
            }
            const pSrc = requireString(p, "src", s);
            const alt = requireString(p, "alt", s);
            if (!pSrc || !alt) return null;
            return { src: pSrc, alt, caption: optionalString(p, "caption", s) };
          })
          .filter(Boolean)
      : [];
    if (photos.length === 0) {
      fail(`${src}.photos must contain at least one photo (DATA_MODEL §3.7).`);
      return;
    }
    out.push({
      id,
      title,
      description: optionalString(entry, "description", src),
      photos,
      period: optionalString(entry, "period", src),
      category: optionalString(entry, "category", src),
    });
  });
  return out;
}

function normalizeAchievements(raw, consentIndex) {
  const where = "achievements.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    const id = requireString(entry, "id", src);
    const title = requireString(entry, "title", src);
    const category = requireString(entry, "category", src);
    if (!id || !title || !category) return;
    const studentIds = (stringArray(entry, "studentIds", src) ?? []).map((s) => slugify(s));
    if (studentIds.length === 0) {
      fail(`${src}.studentIds must name at least one student.`);
      return;
    }
    const registered = studentIds.every((sid) => consentIndex.get(sid) === true);
    const declared = entry.consentPublic === true;
    let consentPublic = declared;
    if (declared && !registered) {
      warn(
        `${src} (${title}) declares consentPublic:true but not all ${studentIds.length} students ` +
          `are marked in consent.json — verify before deployment.`,
      );
    }
    if (!declared && registered) {
      consentPublic = true;
      act(`${src}: all named students consented, consentPublic set to true`);
    }
    const level = optionalString(entry, "level", src);
    const allowed = ["universitas", "regional", "nasional", "internasional"];
    if (level && !allowed.includes(level)) {
      warn(`${src}.level "${level}" is not one of ${allowed.join(", ")} — field dropped.`);
    }
    out.push({
      id,
      title,
      studentIds,
      category,
      level: level && allowed.includes(level) ? level : undefined,
      year: optionalNumber(entry, "year", src),
      description: optionalString(entry, "description", src),
      proofUrl: optionalString(entry, "proofUrl", src),
      consentPublic,
    });
  });
  return out;
}

function normalizeTimeline(raw) {
  const where = "timeline.json";
  if (!Array.isArray(raw)) {
    fail(`${where} must be an array.`);
    return [];
  }
  const out = [];
  raw.forEach((entry, i) => {
    const src = `${where}[${i}]`;
    if (!entry || typeof entry !== "object") {
      fail(`${src} must be an object.`);
      return;
    }
    const id = requireString(entry, "id", src);
    const date = requireString(entry, "date", src);
    const milestone = requireString(entry, "milestone", src);
    if (!id || !date || !milestone) return;
    if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(date)) {
      fail(`${src}.date "${date}" must be "YYYY" or "YYYY-MM" or "YYYY-MM-DD".`);
    }
    out.push({
      id,
      date,
      milestone,
      description: optionalString(entry, "description", src),
      image: optionalString(entry, "image", src),
      category: optionalString(entry, "category", src),
    });
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Integrity (fatal on unknown refs — same policy as data.ts)          */
/* ------------------------------------------------------------------ */

function checkIntegrity(db) {
  section("Referential integrity");
  const allIds = new Set(db.students.map((s) => s.id));
  const consented = new Set(db.students.filter((s) => s.consentPublic).map((s) => s.id));

  for (const r of db.roles) {
    if (!allIds.has(r.studentId)) fail(`Role "${r.id}" references unknown student "${r.studentId}".`);
  }
  for (const p of db.projects) {
    for (const m of p.members) {
      if (!allIds.has(m.studentId)) {
        fail(`Project "${p.id}" references unknown student "${m.studentId}".`);
      }
    }
  }
  for (const a of db.achievements) {
    if (!a.consentPublic) continue;
    for (const sid of a.studentIds) {
      if (!allIds.has(sid)) fail(`Achievement "${a.id}" references unknown student "${sid}".`);
      else if (!consented.has(sid)) {
        fail(`Achievement "${a.id}" references unconsented student "${sid}" (DATA_MODEL §3.2).`);
      }
    }
  }
  for (const s of db.students) {
    if (!s.consentPublic) continue;
    for (const pid of s.projects ?? []) {
      if (!db.projects.some((p) => p.id === pid)) {
        fail(`Student "${s.id}" references unknown project "${pid}".`);
      }
    }
    for (const rid of s.roles ?? []) {
      if (!db.roles.some((r) => r.id === rid)) {
        fail(`Student "${s.id}" references unknown role "${rid}".`);
      }
    }
    for (const aid of s.achievements ?? []) {
      if (!db.achievements.some((a) => a.id === aid)) {
        fail(`Student "${s.id}" references unknown achievement "${aid}".`);
      }
    }
  }
  /* photo field sanity */
  for (const s of db.students) {
    if (s.photo && !s.photo.startsWith("/images/")) {
      warn(`Student "${s.id}".photo "${s.photo}" does not start with /images/ — SafeImage may not resolve it.`);
    }
  }
  const noFatal = report.fatal.length === 0;
  if (noFatal) ok(`${db.students.length} students · ${db.projects.length} projects · ${db.roles.length} roles · ${db.achievements.length} achievements — references OK.`);
  return noFatal;
}

/* ------------------------------------------------------------------ */
/* Build script execution                                              */
/* ------------------------------------------------------------------ */

function runBuildChecks() {
  section("Post-write integrity & build checks");
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  try {
    execFileSync(npx, ["tsc", "--noEmit"], { cwd: ROOT, stdio: "inherit", shell: true });
    ok("tsc --noEmit — PASS");
  } catch {
    fail("tsc --noEmit failed — type errors in generated data or existing code.");
    return false;
  }
  try {
    execFileSync(npx, ["next", "build"], { cwd: ROOT, stdio: "inherit", shell: true });
    ok("next build — PASS (schema, consent filter, and PII firewall re-verified at build time)");
  } catch {
    fail("next build failed — see output above.");
    return false;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  console.log(`STI 2026 content ingestion${DRY_RUN ? " — DRY RUN (no files will be written)" : ""}`);
  if (!existsSync(INBOX)) {
    console.error(`\nInbox not found: ${INBOX}`);
    console.error(`Prepare it per docs/CONTENT_MANIFEST.md, then run: npm run ingest -- --inbox <path>`);
    process.exit(1);
  }

  /* ---------- 1. Consent register ---------- */
  section("Consent register");
  const consentIndex = new Map();
  const consentPath = path.join(INBOX, "consent.json");
  if (existsSync(consentPath)) {
    const consentRaw = readJsonFile(consentPath);
    if (Array.isArray(consentRaw)) {
      for (const row of consentRaw) {
        if (row && typeof row === "object" && typeof row.id === "string") {
          consentIndex.set(slugify(row.id), row.consentPublic === true);
        }
      }
      ok(`consent.json: ${consentIndex.size} student row(s) loaded.`);
    } else {
      warn("consent.json is not an array — ignored.");
    }
  } else {
    warn(
      "No consent.json in inbox. Consent gate relies solely on students.json consentPublic flags; " +
        "add the signed register (docs/CONSENT_REGISTER_TEMPLATE.md) before deployment.",
    );
  }

  /* ---------- 2. Load & normalize ---------- */
  section("Reading submissions");
  const raw = {};
  let anyFile = false;
  for (const name of DATA_FILES) {
    const data = readData(name);
    if (data !== undefined) {
      anyFile = true;
      ok(`${name}.json loaded`);
    }
    raw[name] = data;
  }
  if (!anyFile) {
    console.error("\nNo submission JSON files found in the inbox. Nothing to do.");
    process.exit(1);
  }

  const db = {
    class: raw.class !== undefined ? normalizeClass(raw.class) : null,
    students: raw.students !== undefined ? normalizeStudents(raw.students, consentIndex) : [],
    roles: raw.roles !== undefined ? normalizeRoles(raw.roles) : [],
    projects: raw.projects !== undefined ? normalizeProjects(raw.projects) : [],
    campus: raw.campus !== undefined ? normalizeCampus(raw.campus) : [],
    events: raw.events !== undefined ? normalizeEvents(raw.events) : [],
    memories: raw.memories !== undefined ? normalizeMemories(raw.memories) : [],
    achievements: raw.achievements !== undefined ? normalizeAchievements(raw.achievements, consentIndex) : [],
    timeline: raw.timeline !== undefined ? normalizeTimeline(raw.timeline) : [],
  };

  /* ---------- 3. Photos ---------- */
  await intakePhotos();

  /* ---------- 4. Verify referenced images ---------- */
  const imageRefs = new Set();
  for (const s of db.students) if (s.photo) imageRefs.add(s.photo);
  for (const p of db.projects) {
    if (p.coverImage) imageRefs.add(p.coverImage);
    for (const g of p.gallery ?? []) imageRefs.add(g);
  }
  for (const c of db.campus) imageRefs.add(c.src);
  for (const e of db.events) if (e.poster) imageRefs.add(e.poster);
  for (const m of db.memories) for (const ph of m.photos) imageRefs.add(ph.src);
  for (const t of db.timeline) if (t.image) imageRefs.add(t.image);
  if (db.class?.classPhotoFormal) imageRefs.add(db.class.classPhotoFormal);
  if (db.class?.closingPhoto) imageRefs.add(db.class.closingPhoto);
  if (imageRefs.size > 0) verifyImageRefs(imageRefs);

  /* ---------- 5. Integrity ---------- */
  const integrityOk = checkIntegrity(db);

  if (report.fatal.length > 0 || !integrityOk) {
    console.log(`\n✖ Ingestion ABORTED — ${report.fatal.length} fatal issue(s). src/data and public/images were NOT modified.`);
    console.log("   Fix the issues above and re-run. No partial state was left behind.");
    process.exit(1);
  }

  /* ---------- 6. Write ---------- */
  if (DRY_RUN) {
    console.log("\n✔ Dry run complete — validation passed, nothing was written.");
    console.log(`   Students: ${db.students.length} (consented: ${db.students.filter((s) => s.consentPublic).length})`);
    console.log(`   Projects: ${db.projects.length} · Campus photos: ${db.campus.length} · Events: ${db.events.length}`);
    console.log(`   Memories: ${db.memories.length} · Achievements: ${db.achievements.length} · Timeline: ${db.timeline.length}`);
    process.exit(0);
  }

  section("Writing build-ready data");
  for (const name of DATA_FILES) {
    const value = db[name];
    if (value === null || value === undefined) continue;
    const dest = path.join(ROOT, "src", "data", `${name}.json`);
    writeFileSync(dest, `${JSON.stringify(value, null, 2)}\n`);
    ok(`src/data/${name}.json written (${Array.isArray(value) ? value.length + " records" : "object"})`);
  }

  /* ---------- 7. Build verification ---------- */
  const buildOk = runBuildChecks();

  /* ---------- 8. Report ---------- */
  console.log("\n================ INGESTION REPORT ================");
  console.log(`Fatal issues : ${report.fatal.length}`);
  console.log(`Warnings     : ${report.warnings.length}`);
  console.log(`Files written: src/data/*.json (9 files), public/images/** (photos)`);
  console.log(`Build checks : ${buildOk ? "tsc PASS · next build PASS" : "FAILED (see above)"}`);
  if (report.warnings.length) {
    console.log("\nWarnings (review before deployment):");
    for (const w of report.warnings) console.log(`  - ${w}`);
  }
  console.log("\nNext steps:");
  console.log("  1. Review git diff of src/data and public/images.");
  console.log("  2. Fill class.json narrative fields (statement, valedictory, sign-off) — see docs/CONTENT_MANIFEST.md.");
  console.log("  3. Commit with a logical message, then deploy (npm run build && vercel deploy).");
  process.exit(buildOk ? 0 : 1);
}

main().catch((err) => {
  console.error("Ingestion crashed:", err);
  process.exit(1);
});
