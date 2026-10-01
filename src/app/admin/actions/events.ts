"use server";

import { authorize, requireSession } from "@/lib/cms/auth";
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
  const auth = await authorize();
  if (!auth.ok) return { success: false as const, error: auth.error };
  const session = auth.session;

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

  /* Public routes are build-gated (src/lib/cms/publish.ts); no runtime revalidation. */

  return { success: true as const, event: eventItem };
}

export async function deleteEventAction(id: string) {
  const auth = await authorize("admin");
  if (!auth.ok) return { success: false as const, error: auth.error };

  await deleteEventCMS(id, {
    email: auth.session.user.email,
    role: auth.session.user.role,
  });

  return { success: true as const };
}

export async function getTimelineAction() {
  await requireSession();
  return await getAllTimelineCMS();
}

export async function saveTimelineAction(entry: CMSTimelineItem) {
  const auth = await authorize();
  if (!auth.ok) return { success: false as const, error: auth.error };

  await saveTimelineCMS(entry, {
    email: auth.session.user.email,
    role: auth.session.user.role,
  });

  /* Public routes are build-gated (src/lib/cms/publish.ts); no runtime revalidation. */
  return { success: true as const };
}
