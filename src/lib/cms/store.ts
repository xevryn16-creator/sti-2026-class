import fs from "fs";
import path from "path";
import type {
  CMSDashboardStats,
  CMSStudentItem,
  CMSProjectItem,
  CMSMemoryItem,
  CMSEventItem,
  CMSTimelineItem,
  MediaAssetEntity,
  AuditLogEntry,
  ContentReadinessItem,
  PublishStatus,
} from "@/types/cms";
import type {
  ClassEntity,
  StudentEntity,
  ProjectEntity,
  MemoryEntity,
  EventEntity,
  TimelineEntryEntity,
} from "@/types";
import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJsonFile<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Audit Logging                                                      */
/* ------------------------------------------------------------------ */

export async function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "createdAt">): Promise<void> {
  const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullEntry: AuditLogEntry = {
    ...entry,
    id,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("audit_logs").insert({
        actor_email: entry.actorEmail,
        actor_role: entry.actorRole,
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entityId,
        details: entry.details ?? {},
      });
      return;
    }
  }

  const logs = readJsonFile<AuditLogEntry[]>("audit-logs.json", []);
  logs.unshift(fullEntry);
  if (logs.length > 200) logs.pop();
  writeJsonFile("audit-logs.json", logs);
}

export async function getAuditLogs(limit = 20): Promise<AuditLogEntry[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          actorEmail: d.actor_email,
          actorRole: d.actor_role,
          action: d.action,
          entity: d.entity,
          entityId: d.entity_id,
          details: d.details,
          createdAt: d.created_at,
        }));
      }
    }
  }

  const logs = readJsonFile<AuditLogEntry[]>("audit-logs.json", []);
  return logs.slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Students CRUD                                                      */
/* ------------------------------------------------------------------ */

export async function getAllStudentsCMS(): Promise<CMSStudentItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          name: d.name,
          nickname: d.nickname ?? undefined,
          photo: d.photo,
          photoFallback: d.photo_fallback ?? undefined,
          bio: d.bio ?? undefined,
          interests: d.interests ?? [],
          quote: d.quote ?? undefined,
          roles: d.roles ?? [],
          projects: d.projects ?? [],
          achievements: d.achievements ?? [],
          socialLinks: d.social_links ?? [],
          consentPublic: d.consent_public,
          publishStatus: (d.publish_status as PublishStatus) ?? "published",
          sortOrder: d.sort_order ?? 0,
          updatedAt: d.updated_at,
        }));
      }
    }
  }

  const students = readJsonFile<CMSStudentItem[]>("students.json", []);
  return students.map((s) => ({
    ...s,
    publishStatus: s.publishStatus ?? "published",
  }));
}

export async function getStudentByIdCMS(id: string): Promise<CMSStudentItem | null> {
  const students = await getAllStudentsCMS();
  return students.find((s) => s.id === id) ?? null;
}

export async function saveStudentCMS(
  student: CMSStudentItem,
  actor: { email: string; role: "admin" | "editor" }
): Promise<CMSStudentItem> {
  // PII verification
  const banned = ["phone", "address", "nim", "gpa", "whatsapp", "telegram"];
  const rawObj = student as unknown as Record<string, unknown>;
  for (const b of banned) {
    if (b in rawObj) {
      throw new Error(`Violates PII policy: field '${b}' is strictly prohibited.`);
    }
  }

  const isNew = !(await getStudentByIdCMS(student.id));

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload = {
        id: student.id,
        name: student.name,
        nickname: student.nickname,
        photo: student.photo,
        photo_fallback: student.photoFallback,
        bio: student.bio,
        interests: student.interests,
        quote: student.quote,
        roles: student.roles,
        projects: student.projects,
        achievements: student.achievements,
        social_links: student.socialLinks,
        consent_public: student.consentPublic,
        publish_status: student.publishStatus ?? "published",
        sort_order: student.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("students").upsert(payload);
      if (error) throw new Error(error.message);

      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: isNew ? "create" : "update",
        entity: "students",
        entityId: student.id,
        details: { name: student.name, consentPublic: student.consentPublic, status: student.publishStatus },
      });

      return student;
    }
  }

  const students = readJsonFile<CMSStudentItem[]>("students.json", []);
  const index = students.findIndex((s) => s.id === student.id);
  const updatedStudent = {
    ...student,
    publishStatus: student.publishStatus ?? "published",
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    students[index] = updatedStudent;
  } else {
    students.push(updatedStudent);
  }

  writeJsonFile("students.json", students);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: isNew ? "create" : "update",
    entity: "students",
    entityId: student.id,
    details: { name: student.name, consentPublic: student.consentPublic, status: student.publishStatus },
  });

  return updatedStudent;
}

export async function deleteStudentCMS(
  id: string,
  actor: { email: string; role: "admin" | "editor" }
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("students").delete().eq("id", id);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "delete",
        entity: "students",
        entityId: id,
      });
      return;
    }
  }

  const students = readJsonFile<CMSStudentItem[]>("students.json", []);
  const filtered = students.filter((s) => s.id !== id);
  writeJsonFile("students.json", filtered);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "delete",
    entity: "students",
    entityId: id,
  });
}

/* ------------------------------------------------------------------ */
/* Projects CRUD                                                      */
/* ------------------------------------------------------------------ */

export async function getAllProjectsCMS(): Promise<CMSProjectItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          year: d.year,
          course: d.course ?? undefined,
          coverImage: d.cover_image,
          gallery: d.gallery ?? [],
          members: d.members ?? [],
          link: d.link ?? undefined,
          technology: d.technology ?? [],
          featured: d.featured ?? false,
          publishStatus: (d.publish_status as PublishStatus) ?? "published",
          sortOrder: d.sort_order ?? 0,
          updatedAt: d.updated_at,
        }));
      }
    }
  }

  const projects = readJsonFile<CMSProjectItem[]>("projects.json", []);
  return projects.map((p) => ({
    ...p,
    publishStatus: p.publishStatus ?? "published",
  }));
}

export async function getProjectByIdCMS(id: string): Promise<CMSProjectItem | null> {
  const projects = await getAllProjectsCMS();
  return projects.find((p) => p.id === id) ?? null;
}

export async function saveProjectCMS(
  project: CMSProjectItem,
  actor: { email: string; role: "admin" | "editor" }
): Promise<CMSProjectItem> {
  const isNew = !(await getProjectByIdCMS(project.id));

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload = {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        year: project.year,
        course: project.course,
        cover_image: project.coverImage,
        gallery: project.gallery,
        members: project.members,
        link: project.link,
        technology: project.technology,
        featured: project.featured,
        publish_status: project.publishStatus ?? "published",
        sort_order: project.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("projects").upsert(payload);
      if (error) throw new Error(error.message);

      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: isNew ? "create" : "update",
        entity: "projects",
        entityId: project.id,
        details: { title: project.title, status: project.publishStatus },
      });

      return project;
    }
  }

  const projects = readJsonFile<CMSProjectItem[]>("projects.json", []);
  const index = projects.findIndex((p) => p.id === project.id);
  const updatedProject = {
    ...project,
    publishStatus: project.publishStatus ?? "published",
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }

  writeJsonFile("projects.json", projects);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: isNew ? "create" : "update",
    entity: "projects",
    entityId: project.id,
    details: { title: project.title, status: project.publishStatus },
  });

  return updatedProject;
}

export async function deleteProjectCMS(
  id: string,
  actor: { email: string; role: "admin" | "editor" }
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("projects").delete().eq("id", id);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "delete",
        entity: "projects",
        entityId: id,
      });
      return;
    }
  }

  const projects = readJsonFile<CMSProjectItem[]>("projects.json", []);
  const filtered = projects.filter((p) => p.id !== id);
  writeJsonFile("projects.json", filtered);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "delete",
    entity: "projects",
    entityId: id,
  });
}

/* ------------------------------------------------------------------ */
/* Memories CRUD                                                      */
/* ------------------------------------------------------------------ */

export async function getAllMemoriesCMS(): Promise<CMSMemoryItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description ?? undefined,
          photos: d.photos ?? [],
          period: d.period ?? undefined,
          category: d.category ?? undefined,
          publishStatus: (d.publish_status as PublishStatus) ?? "published",
          sortOrder: d.sort_order ?? 0,
          updatedAt: d.updated_at,
        }));
      }
    }
  }

  const memories = readJsonFile<CMSMemoryItem[]>("memories.json", []);
  return memories.map((m) => ({
    ...m,
    publishStatus: m.publishStatus ?? "published",
  }));
}

export async function getMemoryByIdCMS(id: string): Promise<CMSMemoryItem | null> {
  const memories = await getAllMemoriesCMS();
  return memories.find((m) => m.id === id) ?? null;
}

export async function saveMemoryCMS(
  memory: CMSMemoryItem,
  actor: { email: string; role: "admin" | "editor" }
): Promise<CMSMemoryItem> {
  const isNew = !(await getMemoryByIdCMS(memory.id));

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload = {
        id: memory.id,
        title: memory.title,
        description: memory.description,
        photos: memory.photos,
        period: memory.period,
        category: memory.category,
        publish_status: memory.publishStatus ?? "published",
        sort_order: memory.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("memories").upsert(payload);
      if (error) throw new Error(error.message);

      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: isNew ? "create" : "update",
        entity: "memories",
        entityId: memory.id,
        details: { title: memory.title, status: memory.publishStatus },
      });

      return memory;
    }
  }

  const memories = readJsonFile<CMSMemoryItem[]>("memories.json", []);
  const index = memories.findIndex((m) => m.id === memory.id);
  const updatedMemory = {
    ...memory,
    publishStatus: memory.publishStatus ?? "published",
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    memories[index] = updatedMemory;
  } else {
    memories.push(updatedMemory);
  }

  writeJsonFile("memories.json", memories);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: isNew ? "create" : "update",
    entity: "memories",
    entityId: memory.id,
    details: { title: memory.title, status: memory.publishStatus },
  });

  return updatedMemory;
}

export async function deleteMemoryCMS(
  id: string,
  actor: { email: string; role: "admin" | "editor" }
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("memories").delete().eq("id", id);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "delete",
        entity: "memories",
        entityId: id,
      });
      return;
    }
  }

  const memories = readJsonFile<CMSMemoryItem[]>("memories.json", []);
  const filtered = memories.filter((m) => m.id !== id);
  writeJsonFile("memories.json", filtered);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "delete",
    entity: "memories",
    entityId: id,
  });
}

/* ------------------------------------------------------------------ */
/* Events CRUD                                                        */
/* ------------------------------------------------------------------ */

export async function getAllEventsCMS(): Promise<CMSEventItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          title: d.title,
          date: d.date,
          description: d.description,
          category: d.category,
          location: d.location ?? undefined,
          poster: d.poster ?? undefined,
          participantsCount: d.participants_count ?? undefined,
          publishStatus: (d.publish_status as PublishStatus) ?? "published",
          updatedAt: d.updated_at,
        }));
      }
    }
  }

  const events = readJsonFile<CMSEventItem[]>("events.json", []);
  return events.map((e) => ({
    ...e,
    publishStatus: e.publishStatus ?? "published",
  }));
}

export async function getEventByIdCMS(id: string): Promise<CMSEventItem | null> {
  const events = await getAllEventsCMS();
  return events.find((e) => e.id === id) ?? null;
}

export async function saveEventCMS(
  event: CMSEventItem,
  actor: { email: string; role: "admin" | "editor" }
): Promise<CMSEventItem> {
  const isNew = !(await getEventByIdCMS(event.id));

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload = {
        id: event.id,
        title: event.title,
        date: event.date,
        description: event.description,
        category: event.category,
        location: event.location,
        poster: event.poster,
        participants_count: event.participantsCount,
        publish_status: event.publishStatus ?? "published",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("events").upsert(payload);
      if (error) throw new Error(error.message);

      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: isNew ? "create" : "update",
        entity: "events",
        entityId: event.id,
        details: { title: event.title, status: event.publishStatus },
      });

      return event;
    }
  }

  const events = readJsonFile<CMSEventItem[]>("events.json", []);
  const index = events.findIndex((e) => e.id === event.id);
  const updatedEvent = {
    ...event,
    publishStatus: event.publishStatus ?? "published",
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    events[index] = updatedEvent;
  } else {
    events.push(updatedEvent);
  }

  writeJsonFile("events.json", events);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: isNew ? "create" : "update",
    entity: "events",
    entityId: event.id,
    details: { title: event.title, status: event.publishStatus },
  });

  return updatedEvent;
}

export async function deleteEventCMS(
  id: string,
  actor: { email: string; role: "admin" | "editor" }
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("events").delete().eq("id", id);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "delete",
        entity: "events",
        entityId: id,
      });
      return;
    }
  }

  const events = readJsonFile<CMSEventItem[]>("events.json", []);
  const filtered = events.filter((e) => e.id !== id);
  writeJsonFile("events.json", filtered);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "delete",
    entity: "events",
    entityId: id,
  });
}

/* ------------------------------------------------------------------ */
/* Timeline CRUD                                                      */
/* ------------------------------------------------------------------ */

export async function getAllTimelineCMS(): Promise<CMSTimelineItem[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("timeline")
        .select("*")
        .order("date", { ascending: true });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          date: d.date,
          milestone: d.milestone,
          description: d.description ?? undefined,
          image: d.image ?? undefined,
          category: d.category ?? undefined,
          publishStatus: (d.publish_status as PublishStatus) ?? "published",
          sortOrder: d.sort_order ?? 0,
        }));
      }
    }
  }

  const timeline = readJsonFile<CMSTimelineItem[]>("timeline.json", []);
  return timeline.map((t) => ({
    ...t,
    publishStatus: t.publishStatus ?? "published",
  }));
}

export async function saveTimelineCMS(
  entry: CMSTimelineItem,
  actor: { email: string; role: "admin" | "editor" }
): Promise<CMSTimelineItem> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload = {
        id: entry.id,
        date: entry.date,
        milestone: entry.milestone,
        description: entry.description,
        image: entry.image,
        category: entry.category,
        publish_status: entry.publishStatus ?? "published",
        sort_order: entry.sortOrder ?? 0,
      };

      await supabase.from("timeline").upsert(payload);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "update",
        entity: "timeline",
        entityId: entry.id,
        details: { milestone: entry.milestone },
      });
      return entry;
    }
  }

  const timeline = readJsonFile<CMSTimelineItem[]>("timeline.json", []);
  const idx = timeline.findIndex((t) => t.id === entry.id);
  if (idx >= 0) {
    timeline[idx] = entry;
  } else {
    timeline.push(entry);
  }
  writeJsonFile("timeline.json", timeline);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "update",
    entity: "timeline",
    entityId: entry.id,
    details: { milestone: entry.milestone },
  });

  return entry;
}

/* ------------------------------------------------------------------ */
/* Media Library Store                                                */
/* ------------------------------------------------------------------ */

export async function getAllMediaCMS(): Promise<MediaAssetEntity[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        return (data as any[]).map((d) => ({
          id: d.id,
          filename: d.filename,
          url: d.url,
          mimeType: d.mime_type,
          sizeBytes: d.size_bytes,
          width: d.width ?? undefined,
          height: d.height ?? undefined,
          type: d.type as "image" | "video",
          altText: d.alt_text ?? undefined,
          createdAt: d.created_at,
          createdBy: d.created_by ?? undefined,
        }));
      }
    }
  }

  return readJsonFile<MediaAssetEntity[]>("media-assets.json", []);
}

export async function saveMediaAssetCMS(
  asset: MediaAssetEntity,
  actor: { email: string; role: "admin" | "editor" }
): Promise<MediaAssetEntity> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("media_assets").insert({
        id: asset.id,
        filename: asset.filename,
        url: asset.url,
        mime_type: asset.mimeType,
        size_bytes: asset.sizeBytes,
        width: asset.width,
        height: asset.height,
        type: asset.type,
        alt_text: asset.altText,
        created_at: asset.createdAt,
        created_by: asset.createdBy,
      });

      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "upload",
        entity: "media_assets",
        entityId: asset.id,
        details: { filename: asset.filename, sizeBytes: asset.sizeBytes },
      });

      return asset;
    }
  }

  const assets = readJsonFile<MediaAssetEntity[]>("media-assets.json", []);
  assets.unshift(asset);
  writeJsonFile("media-assets.json", assets);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "upload",
    entity: "media_assets",
    entityId: asset.id,
    details: { filename: asset.filename, sizeBytes: asset.sizeBytes },
  });

  return asset;
}

export async function deleteMediaAssetCMS(
  id: string,
  actor: { email: string; role: "admin" | "editor" }
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("media_assets").delete().eq("id", id);
      await logAuditEvent({
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "delete",
        entity: "media_assets",
        entityId: id,
      });
      return;
    }
  }

  const assets = readJsonFile<MediaAssetEntity[]>("media-assets.json", []);
  const filtered = assets.filter((a) => a.id !== id);
  writeJsonFile("media-assets.json", filtered);

  await logAuditEvent({
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "delete",
    entity: "media_assets",
    entityId: id,
  });
}

/* ------------------------------------------------------------------ */
/* Dashboard Metrics & Content Readiness                              */
/* ------------------------------------------------------------------ */

export async function getCMSDashboardStats(): Promise<CMSDashboardStats> {
  const students = await getAllStudentsCMS();
  const projects = await getAllProjectsCMS();
  const memories = await getAllMemoriesCMS();
  const events = await getAllEventsCMS();
  const media = await getAllMediaCMS();
  const recentLogs = await getAuditLogs(10);

  const totalStudents = students.length;
  const consentedStudents = students.filter((s) => s.consentPublic === true).length;
  const totalProjects = projects.length;
  const totalMemories = memories.length;
  const totalEvents = events.length;
  const totalMedia = media.length;

  let draftsCount = 0;
  let publishedCount = 0;

  for (const s of students) {
    if (s.publishStatus === "draft") draftsCount++;
    else if (s.publishStatus === "published") publishedCount++;
  }
  for (const p of projects) {
    if (p.publishStatus === "draft") draftsCount++;
    else if (p.publishStatus === "published") publishedCount++;
  }
  for (const m of memories) {
    if (m.publishStatus === "draft") draftsCount++;
    else if (m.publishStatus === "published") publishedCount++;
  }
  for (const e of events) {
    if (e.publishStatus === "draft") draftsCount++;
    else if (e.publishStatus === "published") publishedCount++;
  }

  const classObj = readJsonFile<ClassEntity>("class.json", {} as ClassEntity);
  const heroImageReady = !!classObj.classPhotoFormal && classObj.classPhotoFormal.length > 0;

  const readiness: ContentReadinessItem[] = [
    {
      key: "hero",
      label: "Foto Angkatan Formal",
      ready: heroImageReady,
      detail: heroImageReady ? classObj.classPhotoFormal : "Belum diisi",
    },
    {
      key: "students",
      label: "Direktori Mahasiswa",
      ready: totalStudents > 0,
      count: totalStudents,
      detail: `${totalStudents} terdaftar`,
    },
    {
      key: "consent",
      label: "Persetujuan Publik (Consent)",
      ready: totalStudents > 0 && consentedStudents === totalStudents,
      count: consentedStudents,
      total: totalStudents,
      detail: `${consentedStudents} dari ${totalStudents} mahasiswa`,
    },
    {
      key: "projects",
      label: "Katalog Proyek",
      ready: totalProjects > 0,
      count: totalProjects,
      detail: `${totalProjects} proyek tersimpan`,
    },
    {
      key: "memories",
      label: "Arsip Kenangan (Memories)",
      ready: totalMemories > 0,
      count: totalMemories,
      detail: `${totalMemories} cerita memori`,
    },
    {
      key: "events",
      label: "Agenda & Kegiatan",
      ready: totalEvents > 0,
      count: totalEvents,
      detail: `${totalEvents} kegiatan`,
    },
    {
      key: "media",
      label: "Media Library Assets",
      ready: totalMedia > 0,
      count: totalMedia,
      detail: `${totalMedia} berkas terunggah`,
    },
  ];

  return {
    totalStudents,
    consentedStudents,
    totalProjects,
    totalMemories,
    totalEvents,
    totalMedia,
    draftsCount,
    publishedCount,
    readiness,
    recentLogs,
  };
}
