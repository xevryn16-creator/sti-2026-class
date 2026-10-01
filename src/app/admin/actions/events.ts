"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireRole } from "@/lib/cms/auth";
import {
  getAllEventsCMS,
  saveEventCMS,
  deleteEventCMS,
  getAllTimelineCMS,
  saveTimelineCMS,
} from "@/lib/cms/store";
import type { CMSEventItem, CMSTimelineItem, PublishStatus } from "@/types/cms";
import type { EventCategory } from "@/types";

export async function getEventsAction() {
  await requireSession();
  return await getAllEventsCMS();
}

export async function saveEventAction(formData: FormData) {
  const session = await requireSession();

  const id = (formData.get("id") as string) || `event-${Date.now()}`;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const location = (formData.get("location") as string) || undefined;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as EventCategory) || "academic";
  const poster = (formData.get("poster") as string) || undefined;
  const publishStatus = (formData.get("publishStatus") as PublishStatus) || "published";

  const eventItem: CMSEventItem = {
    id: id.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    title,
    date,
    location,
    description,
    category,
    poster,
    publishStatus,
  };

  await saveEventCMS(eventItem, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");

  return { success: true, event: eventItem };
}

export async function deleteEventAction(id: string) {
  const session = await requireRole("admin");
  await deleteEventCMS(id, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function getTimelineAction() {
  await requireSession();
  return await getAllTimelineCMS();
}

export async function saveTimelineAction(entry: CMSTimelineItem) {
  const session = await requireSession();
  await saveTimelineCMS(entry, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/timeline");
  revalidatePath("/admin/events");
  return { success: true };
}
