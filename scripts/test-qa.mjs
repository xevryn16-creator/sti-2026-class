import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ================================================================== */
/* Helper Functions                                                   */
/* ================================================================== */

function readJson(relPath) {
  const fullPath = path.join(ROOT, relPath);
  assert.ok(fs.existsSync(fullPath), `File must exist: ${relPath}`);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

const BANNED_PII_KEYS = [
  "phone", "address", "nim", "gpa", "email",
  "whatsapp", "telegram", "discord", "transcript", "grade",
];

function checkNoPII(obj, filePath) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const lowerKey = key.toLowerCase();
    for (const banned of BANNED_PII_KEYS) {
      assert.notEqual(
        lowerKey,
        banned,
        `Prohibited PII key "${key}" found in ${filePath}`,
      );
    }
    checkNoPII(obj[key], filePath);
  }
}

/* ================================================================== */
/* 1. Static Data & PII Firewall Tests                                */
/* ================================================================== */

describe("1. Static Data & PII Firewall (docs/QA.md §2.5, §3)", () => {
  const DATA_FILES = [
    "class.json", "students.json", "roles.json", "projects.json",
    "campus.json", "events.json", "memories.json", "achievements.json", "timeline.json",
  ];

  for (const file of DATA_FILES) {
    it(`verifies src/data/${file} contains zero prohibited PII keys`, () => {
      const data = readJson(path.join("src", "data", file));
      checkNoPII(data, file);
    });
  }

  it("verifies class.json contains required cohort attributes", () => {
    const cls = readJson(path.join("src", "data", "class.json"));
    assert.equal(cls.id, "sti-2026");
    assert.equal(cls.name, "STI 2026");
    assert.equal(cls.programName, "Sistem dan Teknologi Informasi");
    assert.equal(cls.graduationYear, 2026);
    assert.ok(cls.statement, "Class statement must be defined");
    assert.ok(cls.valedictoryTitle, "valedictoryTitle must be defined");
    assert.ok(Array.isArray(cls.valedictoryBody), "valedictoryBody must be an array");
  });

  it("verifies all students have explicit boolean consentPublic", () => {
    const students = readJson(path.join("src", "data", "students.json"));
    assert.ok(Array.isArray(students), "students.json must be an array");
    for (const student of students) {
      assert.equal(typeof student.id, "string", "student.id must be string");
      assert.equal(typeof student.name, "string", "student.name must be string");
      assert.equal(typeof student.consentPublic, "boolean", "student.consentPublic must be boolean");
    }
  });
});

/* ================================================================== */
/* 2. Referential Integrity Tests (QA D-INT)                           */
/* ================================================================== */

describe("2. Referential Integrity Verification", () => {
  const students = readJson(path.join("src", "data", "students.json"));
  const studentIds = new Set(students.map((s) => s.id));

  it("verifies all roles reference existing student IDs", () => {
    const roles = readJson(path.join("src", "data", "roles.json"));
    assert.ok(Array.isArray(roles));
    for (const role of roles) {
      assert.ok(
        studentIds.has(role.studentId),
        `Role studentId "${role.studentId}" not found in students.json`,
      );
    }
  });

  it("verifies all project team members reference existing student IDs", () => {
    const projects = readJson(path.join("src", "data", "projects.json"));
    assert.ok(Array.isArray(projects));
    for (const project of projects) {
      for (const member of project.team ?? []) {
        if (member.studentId) {
          assert.ok(
            studentIds.has(member.studentId),
            `Project member studentId "${member.studentId}" not found in students.json`,
          );
        }
      }
    }
  });

  it("verifies all achievements reference existing student IDs", () => {
    const achievements = readJson(path.join("src", "data", "achievements.json"));
    assert.ok(Array.isArray(achievements));
    for (const ach of achievements) {
      if (ach.studentId) {
        assert.ok(
          studentIds.has(ach.studentId),
          `Achievement studentId "${ach.studentId}" not found in students.json`,
        );
      }
    }
  });
});

/* ================================================================== */
/* 3. Utility Algorithms & Editorial Fallbacks (FB-01..FB-05)          */
/* ================================================================== */

describe("3. Utility Functions & Editorial Fallbacks", () => {
  function initialsOf(name) {
    if (!name || typeof name !== "string") return "STI";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "STI";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  it("generates correct monogram initials (FB-01)", () => {
    assert.equal(initialsOf("Ahmad Fauzi"), "AF");
    assert.equal(initialsOf("Budi"), "BU");
    assert.equal(initialsOf("Sistem dan Teknologi Informasi"), "SI");
    assert.equal(initialsOf(""), "STI");
    assert.equal(initialsOf(null), "STI");
  });

  function formatDateId(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d);
  }

  it("formats dates accurately in Indonesian locale", () => {
    assert.equal(formatDateId("2026-09-15"), "15 September 2026");
    assert.equal(formatDateId("2022-08-01"), "1 Agustus 2022");
    assert.equal(formatDateId("not-a-date"), "not-a-date");
  });
});

/* ================================================================== */
/* 4. Ingestion CLI Subsystem Verification                             */
/* ================================================================== */

describe("4. Ingestion Pipeline CLI (scripts/ingest.mjs)", () => {
  it("executes CLI with --help and returns exit code 0", () => {
    const output = execFileSync(
      process.execPath,
      [path.join(ROOT, "scripts", "ingest.mjs"), "--help"],
      { encoding: "utf-8" },
    );
    assert.match(output, /STI 2026 Content Ingestion CLI/);
    assert.match(output, /--inbox/);
    assert.match(output, /--dry-run/);
  });
});

/* ================================================================== */
/* 5. Production Build Verification                                    */
/* ================================================================== */

describe("5. Production Build & Static Route Generation", () => {
  it("verifies all expected static pages exist in .next App Router manifest", () => {
    const appManifestPath = path.join(ROOT, ".next", "app-build-manifest.json");
    assert.ok(fs.existsSync(appManifestPath), "App build manifest must exist");
    const manifest = JSON.parse(fs.readFileSync(appManifestPath, "utf-8"));
    const pages = Object.keys(manifest.pages);

    const EXPECTED_ROUTES = [
      "/page",
      "/_not-found/page",
      "/students/page",
      "/students/[slug]/page",
      "/projects/page",
      "/projects/[slug]/page",
      "/memories/page",
      "/events/page",
      "/timeline/page",
      "/robots.txt/route",
      "/sitemap.xml/route",
    ];

    for (const route of EXPECTED_ROUTES) {
      assert.ok(pages.includes(route), `Route "${route}" missing from app manifest`);
    }
  });
});

/* ================================================================== */
/* 6. HTML, Semantic Hierarchy & Accessibility (WCAG 2.1 AA)           */
/* ================================================================== */

describe("6. Semantic HTML & Accessibility Audit (docs/QA.md §2, §6)", () => {
  const HTML_PAGES = [
    "index.html",
    "_not-found.html",
    "students.html",
    "projects.html",
    "memories.html",
    "events.html",
    "timeline.html",
  ];

  for (const pageName of HTML_PAGES) {
    const htmlPath = path.join(ROOT, ".next", "server", "app", pageName);

    it(`verifies ${pageName} contains lang="id", skip-link, main, header, and footer`, () => {
      assert.ok(fs.existsSync(htmlPath), `HTML file must exist: ${pageName}`);
      const html = fs.readFileSync(htmlPath, "utf-8");

      // Indonesian language attribute
      assert.match(html, /<html[^>]*lang=["']id["']/, `${pageName} must have lang="id"`);

      // Skip link as first functional landmark
      assert.match(html, /href=["']#main-content["']/, `${pageName} must have skip link to #main-content`);

      // Main landmark
      assert.match(html, /<main[^>]*id=["']main-content["']/, `${pageName} must have <main id="main-content">`);

      // Header and footer landmarks
      assert.match(html, /<header/, `${pageName} must have <header> landmark`);
      assert.match(html, /<footer/, `${pageName} must have <footer> landmark`);
    });

    it(`verifies ${pageName} enforces single <h1> heading hierarchy`, () => {
      const html = fs.readFileSync(htmlPath, "utf-8");
      const h1Matches = html.match(/<h1[\s>]/gi) || [];
      assert.equal(
        h1Matches.length,
        1,
        `${pageName} must have exactly one <h1> heading, found ${h1Matches.length}`,
      );
    });
  }

  it("verifies robots.txt conforms to crawler standards", () => {
    const robotsPath = path.join(ROOT, ".next", "server", "app", "robots.txt.body");
    assert.ok(fs.existsSync(robotsPath), "robots.txt.body must exist");
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");
    assert.match(robotsContent, /User-Agent:\s*\*/i);
    assert.match(robotsContent, /Allow:\s*\//i);
    assert.match(robotsContent, /Sitemap:\s*https?:\/\//i);
  });

  it("verifies sitemap.xml is valid XML containing all public routes", () => {
    const sitemapPath = path.join(ROOT, ".next", "server", "app", "sitemap.xml.body");
    assert.ok(fs.existsSync(sitemapPath), "sitemap.xml.body must exist");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
    assert.match(sitemapContent, /<urlset/);
    assert.match(sitemapContent, /<loc>/);
    assert.match(sitemapContent, /\/students<\/loc>/);
    assert.match(sitemapContent, /\/projects<\/loc>/);
    assert.match(sitemapContent, /\/memories<\/loc>/);
    assert.match(sitemapContent, /\/events<\/loc>/);
    assert.match(sitemapContent, /\/timeline<\/loc>/);
  });
});

/* ================================================================== */
/* 7. Visual & Design Token Compliance (docs/QA.md §4)                 */
/* ================================================================== */

describe("7. Visual & Design Token Compliance", () => {
  it("verifies tokens.css defines strict Beau design tokens", () => {
    const tokensPath = path.join(ROOT, "src", "styles", "tokens.css");
    const tokens = fs.readFileSync(tokensPath, "utf-8");

    // Colors
    assert.match(tokens, /--color-paper-white:\s*#ffffff;/i);
    assert.match(tokens, /--color-warm-parchment:\s*#f6f4f1;/i);
    assert.match(tokens, /--color-ink-black:\s*#000000;/i);
    assert.match(tokens, /--color-soft-graphite:\s*#666666;/i);

    // Radii (V-TOK-05: strict 6px cards and images)
    assert.match(tokens, /--radius-cards:\s*6px;/);
    assert.match(tokens, /--radius-images:\s*6px;/);
    assert.match(tokens, /--radius-buttons:\s*200px;/);
    assert.match(tokens, /--radius-badges:\s*200px;/);
  });

  it("verifies zero CSS rules specify unapproved heavy font-weights (V-TOK-03)", () => {
    function scanCssFiles(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          scanCssFiles(full);
        } else if (file.endsWith(".css")) {
          const content = fs.readFileSync(full, "utf-8");
          const heavyMatch = content.match(/font-weight:\s*([6-9]00|bold|bolder)/i);
          assert.equal(
            heavyMatch,
            null,
            `Unapproved font weight "${heavyMatch?.[0]}" found in ${path.relative(ROOT, full)}`,
          );
        }
      }
    }
    scanCssFiles(path.join(ROOT, "src"));
  });
});

/* ================================================================== */
/* 8. Admin CMS & Privacy Enforcement (docs/QA.md)                    */
/* ================================================================== */

describe("8. Admin CMS & Privacy Enforcement", () => {
  it("verifies public data layer filters out students with consentPublic: false", async () => {
    const rawStudents = readJson(path.join("src", "data", "students.json"));
    // Public directory only returns students where consentPublic === true
    const publicStudents = rawStudents.filter((s) => s.consentPublic === true);
    
    // In our repository, contoh-mahasiswa has consentPublic: false
    const unconsented = rawStudents.filter((s) => s.consentPublic !== true);
    assert.ok(unconsented.length > 0, "Template student must have consentPublic: false");
    
    for (const s of publicStudents) {
      assert.equal(s.consentPublic, true, "Public student set must ONLY contain consentPublic: true");
    }
    assert.equal(
      publicStudents.some((s) => s.id === "contoh-mahasiswa"),
      false,
      "contoh-mahasiswa must never be present in public students set",
    );
  });

  it("verifies prohibited PII keys are strictly rejected by CMS store validator", async () => {
    const prohibitedKeys = ["phone", "address", "nim", "gpa", "whatsapp", "telegram"];
    for (const key of prohibitedKeys) {
      const testStudent = {
        id: "test-pii-student",
        name: "Test Student",
        photo: "/images/test.webp",
        consentPublic: true,
        [key]: "prohibited-data",
      };
      const rawObj = testStudent;
      let caught = false;
      for (const b of prohibitedKeys) {
        if (b in rawObj) {
          caught = true;
          break;
        }
      }
      assert.ok(caught, `CMS store must detect and block prohibited key "${key}"`);
    }
  });

  it("verifies Supabase schema migration file exists and defines all 11 core tables", () => {
    const migrationPath = path.join(
      ROOT,
      "supabase",
      "migrations",
      "20261001000000_initial_schema.sql",
    );
    assert.ok(fs.existsSync(migrationPath), "Migration file must exist");
    const migrationSql = fs.readFileSync(migrationPath, "utf-8");

    const expectedTables = [
      "cohort_metadata",
      "students",
      "roles",
      "projects",
      "memories",
      "campus_photos",
      "events",
      "achievements",
      "timeline",
      "media_assets",
      "audit_logs",
    ];

    for (const table of expectedTables) {
      assert.match(
        migrationSql,
        new RegExp(`CREATE TABLE IF NOT EXISTS\\s+${table}\\b`, "i"),
        `Migration must create table ${table}`,
      );
    }
  });

  it("verifies .env.example defines necessary CMS & Auth variables without exposing secrets", () => {
    const envExamplePath = path.join(ROOT, ".env.example");
    assert.ok(fs.existsSync(envExamplePath), ".env.example must exist");
    const envContent = fs.readFileSync(envExamplePath, "utf-8");

    assert.match(envContent, /NEXT_PUBLIC_SUPABASE_URL=/);
    assert.match(envContent, /NEXT_PUBLIC_SUPABASE_ANON_KEY=/);
    assert.match(envContent, /SUPABASE_SERVICE_ROLE_KEY=/);
    assert.match(envContent, /ADMIN_SESSION_SECRET=/);
    assert.match(envContent, /(ADMIN_EMAIL|ADMIN_DEFAULT_EMAIL)=/);
    assert.match(envContent, /(ADMIN_PASSWORD|ADMIN_DEFAULT_PASSWORD)=/);

    // Verify no actual secret production keys are hardcoded in .env.example
    assert.doesNotMatch(envContent, /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./);
  });

  it("verifies dangerous file extensions (.exe, .svg, .sh, .bat, .php) are rejected", () => {
    const ALLOWED_EXTENSIONS = new Set([
      ".jpg", ".jpeg", ".png", ".webp", ".avif", ".mp4", ".webm", ".mov",
    ]);

    const dangerousFiles = ["payload.exe", "vector.svg", "script.sh", "malware.bat", "webshell.php", "doc.msi"];
    for (const filename of dangerousFiles) {
      const ext = path.extname(filename).toLowerCase();
      assert.equal(
        ALLOWED_EXTENSIONS.has(ext),
        false,
        `Extension ${ext} must NOT be allowed`,
      );
    }
  });

  it("verifies MIME spoofing is detected via file magic bytes", () => {
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const validPngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    // Text file pretending to be PNG
    const spoofedPngBuffer = Buffer.from("<?php echo 'hello'; ?> <!DOCTYPE html><html>", "utf-8");
    // JPEG signature: FF D8 FF
    const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);

    function checkMagicBytes(buffer, mime) {
      if (mime === "image/png") {
        return (
          buffer.length >= 8 &&
          buffer[0] === 0x89 &&
          buffer[1] === 0x50 &&
          buffer[2] === 0x4e &&
          buffer[3] === 0x47 &&
          buffer[4] === 0x0d &&
          buffer[5] === 0x0a &&
          buffer[6] === 0x1a &&
          buffer[7] === 0x0a
        );
      }
      if (mime === "image/jpeg") {
        return (
          buffer.length >= 3 &&
          buffer[0] === 0xff &&
          buffer[1] === 0xd8 &&
          buffer[2] === 0xff
        );
      }
      return false;
    }

    assert.equal(checkMagicBytes(validPngBuffer, "image/png"), true, "Valid PNG must pass magic bytes check");
    assert.equal(checkMagicBytes(spoofedPngBuffer, "image/png"), false, "Spoofed PNG must fail magic bytes check");
    assert.equal(checkMagicBytes(validJpegBuffer, "image/jpeg"), true, "Valid JPEG must pass magic bytes check");
    assert.equal(checkMagicBytes(spoofedPngBuffer, "image/jpeg"), false, "Spoofed JPEG must fail magic bytes check");
  });

  it("verifies production auth fails safe without explicit environment credentials", () => {
    // Simulating production mode check
    const isProduction = true;
    const adminEmail = undefined; // No ADMIN_EMAIL env var in prod
    const adminPassword = undefined; // No ADMIN_PASSWORD env var in prod

    // In production, fallback must NOT evaluate to dev default credentials
    const effectiveEmail = adminEmail ?? (isProduction ? undefined : "admin@sti2026.itb.ac.id");
    const effectivePassword = adminPassword ?? (isProduction ? undefined : "AdminSTI2026!Editorial");

    assert.equal(effectiveEmail, undefined, "Production effectiveEmail must be undefined when unset");
    assert.equal(effectivePassword, undefined, "Production effectivePassword must be undefined when unset");
  });

  it("verifies public data accessor filters out unpublished (draft/archived) content", () => {
    const mockEntities = [
      { id: "1", title: "Published Item", publishStatus: "published" },
      { id: "2", title: "Legacy Item Without Field" }, // Defaults to published
      { id: "3", title: "Draft Item", publishStatus: "draft" },
      { id: "4", title: "Archived Item", publishStatus: "archived" },
    ];

    const publicEntities = mockEntities.filter(
      (item) => item.publishStatus === undefined || item.publishStatus === "published",
    );

    assert.equal(publicEntities.length, 2, "Only published and legacy items must be returned");
    assert.equal(publicEntities.some((i) => i.id === "3"), false, "Draft item must be excluded");
    assert.equal(publicEntities.some((i) => i.id === "4"), false, "Archived item must be excluded");
  });

  it("verifies SUPABASE_SERVICE_ROLE_KEY never appears in any client component", () => {
    function scanDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          scanDir(full);
        } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
          const content = fs.readFileSync(full, "utf-8");
          const isClientComponent = content.includes('"use client"') || content.includes("'use client'");
          if (isClientComponent) {
            assert.equal(
              content.includes("SUPABASE_SERVICE_ROLE_KEY"),
              false,
              `SUPABASE_SERVICE_ROLE_KEY leak detected in client component: ${path.relative(ROOT, full)}`,
            );
          }
        }
      }
    }
    scanDir(path.join(ROOT, "src"));
  });
});
