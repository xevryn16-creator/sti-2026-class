"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireRole } from "@/lib/cms/auth";
import {
  getAllProjectsCMS,
  getProjectByIdCMS,
  saveProjectCMS,
  deleteProjectCMS,
} from "@/lib/cms/store";
import type { CMSProjectItem, PublishStatus } from "@/types/cms";
import type { ProjectStatus } from "@/types";

export async function getProjectsAction() {
  await requireSession();
  return await getAllProjectsCMS();
}

export async function saveProjectAction(formData: FormData) {
  const session = await requireSession();

  const id = (formData.get("id") as string) || `project-${Date.now()}`;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "Web Development";
  const year = parseInt((formData.get("year") as string) || "2024", 10);
  const course = (formData.get("course") as string) || undefined;
  const coverImage = (formData.get("coverImage") as string) || "/images/projects/default.webp";
  const featured = formData.get("featured") === "true";
  const status = (formData.get("status") as ProjectStatus) || "completed";
  const publishStatus = (formData.get("publishStatus") as PublishStatus) || "published";

  const membersRaw = (formData.get("members") as string) || "";
  const members = membersRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((studentId) => ({ studentId }));

  const technologyRaw = (formData.get("technology") as string) || "";
  const technology = technologyRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const projectItem: CMSProjectItem = {
    id: id.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    title,
    description,
    category,
    year,
    course,
    coverImage,
    members,
    technology,
    status,
    featured,
    publishStatus,
  };

  await saveProjectCMS(projectItem, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true, project: projectItem };
}

export async function deleteProjectAction(id: string) {
  const session = await requireRole("admin");
  await deleteProjectCMS(id, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
