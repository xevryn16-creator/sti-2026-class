import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = "http://localhost:3000";

describe("E2E Local System Integration Flow (docs/QA.md)", () => {
  const STUDENTS_FILE = path.join(ROOT, "src", "data", "students.json");
  let originalStudentsJson = "";

  before(() => {
    assert.ok(fs.existsSync(STUDENTS_FILE), "students.json must exist");
    originalStudentsJson = fs.readFileSync(STUDENTS_FILE, "utf-8");
  });

  after(() => {
    // Restore original students.json to keep repository clean
    if (originalStudentsJson) {
      fs.writeFileSync(STUDENTS_FILE, originalStudentsJson, "utf-8");
    }
  });

  it("1. Verifies unauthenticated access to /admin redirects to /admin/login", async () => {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    assert.ok([307, 308].includes(res.status), `Expected redirect status, got ${res.status}`);
    const location = res.headers.get("location");
    assert.ok(
      location?.includes("/admin/login"),
      `Expected redirect to /admin/login, got ${location}`,
    );
  });

  it("2. Verifies unauthenticated access to /admin/dashboard redirects to /admin/login with redirect param", async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: "manual" });
    assert.ok([307, 308].includes(res.status), `Expected redirect status, got ${res.status}`);
    const location = res.headers.get("location");
    assert.ok(
      location?.includes("/admin/login?redirect=%2Fadmin%2Fdashboard"),
      `Expected redirect with param, got ${location}`,
    );
  });

  /*
   * R1 (build-gated publication, docs/ADMIN.md §7): public routes are prerendered
   * from JSON inlined at build time. Mutating src/data/*.json while a production
   * server is running must NOT change what the public site serves until the next
   * `npm run build` — the admin CMS surfaces this as the "PERLU BUILD" banner.
   * These tests therefore assert the publish lifecycle against the *build
   * snapshot*, not against live file edits.
   */
  it("3. Verifies build-gated lifecycle: Draft hidden -> Published stored but NOT public until rebuild -> Cleanup", async () => {
    const syntheticStudentId = "e2e-synthetic-test-student";
    const syntheticStudent = {
      id: syntheticStudentId,
      name: "E2E Synthetic Student",
      role: "Software Engineer",
      bio: "Synthetic bio for automated verification",
      interests: ["AI", "Web"],
      consentPublic: true,
      publishStatus: "draft",
    };

    // Step A: Save student as DRAFT into store
    const currentStudents = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));
    // Remove if already exists
    const filtered = currentStudents.filter((s) => s.id !== syntheticStudentId);
    filtered.push(syntheticStudent);
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");

    // Step B: Verify NOT visible on public directory
    const publicDirRes = await fetch(`${BASE_URL}/students`);
    assert.equal(publicDirRes.status, 200);
    const publicHtml = await publicDirRes.text();
    assert.equal(
      publicHtml.includes("E2E Synthetic Student"),
      false,
      "Draft student must NOT appear on public directory /students",
    );

    // Step C: Verify direct slug access returns 404
    const directSlugRes = await fetch(`${BASE_URL}/students/${syntheticStudentId}`);
    assert.equal(
      directSlugRes.status,
      404,
      "Draft student slug must return 404 on public route",
    );

    // Step D: Update student to PUBLISHED
    const updatedStudents = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));
    const target = updatedStudents.find((s) => s.id === syntheticStudentId);
    assert.ok(target, "Synthetic student must exist");
    target.publishStatus = "published";
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(updatedStudents, null, 2), "utf-8");

    // Step E: Verify STILL hidden on public directory after publishing to the
    // store — publication is build-gated, so no runtime JSON edit may leak
    // through to the already-prerendered public site.
    const publicDirRes2 = await fetch(`${BASE_URL}/students`);
    assert.equal(publicDirRes2.status, 200);
    const publicHtml2 = await publicDirRes2.text();
    assert.equal(
      publicHtml2.includes("E2E Synthetic Student"),
      false,
      "Published student must NOT appear on public site until the next build (build-gated publication)",
    );

    // Step F: Verify direct slug also still serves the build snapshot (404),
    // matching the draft behaviour — no partial runtime publication.
    const directSlugRes2 = await fetch(`${BASE_URL}/students/${syntheticStudentId}`);
    assert.equal(
      directSlugRes2.status,
      404,
      "Direct slug of a newly published student must remain 404 until the next build",
    );

    // Step G: Cleanup synthetic student
    const cleanedStudents = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8")).filter(
      (s) => s.id !== syntheticStudentId,
    );
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(cleanedStudents, null, 2), "utf-8");

    // Verify removed
    const verifyRemovedRes = await fetch(`${BASE_URL}/students`);
    const verifyRemovedHtml = await verifyRemovedRes.text();
    assert.equal(
      verifyRemovedHtml.includes("E2E Synthetic Student"),
      false,
      "Student must be completely removed from public site after cleanup",
    );
  });

  it("4. Verifies Consent Firewall: Published with consentPublic=false remains hidden", async () => {
    const unconsentedStudentId = "e2e-unconsented-test-student";
    const unconsentedStudent = {
      id: unconsentedStudentId,
      name: "Unconsented Test Student",
      role: "Security Analyst",
      consentPublic: false,
      publishStatus: "published", // Published BUT consent is false!
    };

    const currentStudents = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));
    const filtered = currentStudents.filter((s) => s.id !== unconsentedStudentId);
    filtered.push(unconsentedStudent);
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");

    try {
      // Must NOT appear on directory
      const dirRes = await fetch(`${BASE_URL}/students`);
      const dirHtml = await dirRes.text();
      assert.equal(
        dirHtml.includes("Unconsented Test Student"),
        false,
        "Student with consentPublic=false must NEVER appear on public directory",
      );

      // Direct slug lookup must return 404
      const slugRes = await fetch(`${BASE_URL}/students/${unconsentedStudentId}`);
      assert.equal(
        slugRes.status,
        404,
        "Direct slug lookup for unconsented student must return 404",
      );
    } finally {
      // Always cleanup
      const cleaned = JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8")).filter(
        (s) => s.id !== unconsentedStudentId,
      );
      fs.writeFileSync(STUDENTS_FILE, JSON.stringify(cleaned, null, 2), "utf-8");
    }
  });
});
