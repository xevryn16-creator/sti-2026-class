import fs from "node:fs";
import path from "node:path";

/**
 * Publishing model (docs/ARCHITECTURE.md §9, docs/ADMIN.md §7).
 *
 * STI 2026 is a **build-gated** publication: the public pages import
 * `src/data/*.json` at build time, exactly like any other static asset. The CMS
 * therefore stores editorial changes immediately, but the public site only
 * changes after the next `npm run build` (and deploy).
 *
 * That is why `revalidatePath()` is NOT used for public routes: it cannot
 * republish build-inlined JSON, and pretending otherwise would make the admin
 * UI lie about when content appears on the public site. Instead the admin UI
 * reads the state below and tells the editor the truth.
 *
 * The state is derived from the filesystem, so it is always accurate:
 * `pending-rebuild` means at least one published content file is newer than the
 * last Next.js build (`.next/BUILD_ID`).
 */

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const BUILD_MARKER = path.join(ROOT, ".next", "BUILD_ID");

/** Every file that feeds the public build. */
export const PUBLISHED_CONTENT_FILES = [
  "class.json",
  "students.json",
  "roles.json",
  "projects.json",
  "memories.json",
  "campus.json",
  "events.json",
  "achievements.json",
  "timeline.json",
  // Media library index; the uploaded binaries it points to live in public/uploads.
  "media-assets.json",
] as const;

export type PublishMode = "development" | "in-sync" | "pending-rebuild" | "unknown";

export interface PublishState {
  mode: PublishMode;
  /** Content files changed after the last build. */
  pendingFiles: string[];
  /** ISO timestamp of the last production build, when one exists on disk. */
  lastBuiltAt: string | null;
  /** ISO timestamp of the most recent content change. */
  lastChangeAt: string | null;
  /** Files that could not be inspected (should normally be empty). */
  unreadableFiles: string[];
}

function mtimeOf(file: string): number | null {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return null;
  }
}

export function getPublishState(): PublishState {
  const unreadableFiles: string[] = [];
  const changes: { file: string; mtime: number }[] = [];

  for (const file of PUBLISHED_CONTENT_FILES) {
    const mtime = mtimeOf(path.join(DATA_DIR, file));
    if (mtime === null) {
      // A file may legitimately not exist yet (e.g. no uploads recorded).
      if (file === "media-assets.json") continue;
      unreadableFiles.push(file);
      continue;
    }
    changes.push({ file, mtime });
  }

  const lastChangeAt = changes.length
    ? new Date(Math.max(...changes.map((c) => c.mtime))).toISOString()
    : null;

  // Development renders content live, so there is nothing to publish.
  if (process.env.NODE_ENV !== "production") {
    return {
      mode: "development",
      pendingFiles: [],
      lastBuiltAt: null,
      lastChangeAt,
      unreadableFiles,
    };
  }

  const builtAt = mtimeOf(BUILD_MARKER);
  if (builtAt === null) {
    return {
      mode: "unknown",
      pendingFiles: [],
      lastBuiltAt: null,
      lastChangeAt,
      unreadableFiles,
    };
  }

  const pendingFiles = changes.filter((c) => c.mtime > builtAt).map((c) => c.file);

  return {
    mode: pendingFiles.length > 0 ? "pending-rebuild" : "in-sync",
    pendingFiles,
    lastBuiltAt: new Date(builtAt).toISOString(),
    lastChangeAt,
    unreadableFiles,
  };
}

/** Human-readable Indonesian summary for the admin UI. */
export function describePublishState(state: PublishState): {
  tone: "info" | "warning" | "success";
  title: string;
  detail: string;
} {
  const when = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(iso))
      : "—";

  switch (state.mode) {
    case "pending-rebuild":
      return {
        tone: "warning",
        title: "Perubahan menunggu build & deploy",
        detail:
          `${state.pendingFiles.length} berkas konten berubah setelah build terakhir ` +
          `(build: ${when(state.lastBuiltAt)}, perubahan terakhir: ${when(state.lastChangeAt)}). ` +
          "Situs publik masih menayangkan versi build tersebut. Jalankan `npm run build` lalu deploy ulang untuk menerbitkan perubahan ini.",
      };
    case "in-sync":
      return {
        tone: "success",
        title: "Situs publik sesuai build terakhir",
        detail: `Build terakhir: ${when(state.lastBuiltAt)}. Semua perubahan konten sudah termasuk dalam build ini.`,
      };
    case "development":
      return {
        tone: "info",
        title: "Mode pengembangan",
        detail:
          "Server pengembangan memuat perubahan konten secara langsung. Perilaku publikasi yang sebenarnya (build-gated) hanya berlaku pada build produksi.",
      };
    default:
      return {
        tone: "info",
        title: "Status publikasi belum dapat dipastikan",
        detail:
          "Artefak build tidak ditemukan pada lingkungan produksi. Jalankan `npm run build` sebelum melakukan deploy.",
      };
  }
}
