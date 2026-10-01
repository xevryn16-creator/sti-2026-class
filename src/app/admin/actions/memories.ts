"use server";

import { authorize, requireSession } from "@/lib/cms/auth";
import {
  getAllMemoriesCMS,
  saveMemoryCMS,
  deleteMemoryCMS,
} from "@/lib/cms/store";
import type { CMSMemoryItem, PublishStatus } from "@/types/cms";

export async function getMemoriesAction() {
  await requireSession();
  return await getAllMemoriesCMS();
}

export async function saveMemoryAction(formData: FormData) {
  const auth = await authorize();
  if (!auth.ok) return { success: false as const, error: auth.error };
  const session = auth.session;

  const id = (formData.get("id") as string) || `memory-${Date.now()}`;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const period = (formData.get("period") as string) || "2024";
  const category = (formData.get("category") as string) || "social";
  const publishStatus = (formData.get("publishStatus") as PublishStatus) || "published";

  const photoSrc = (formData.get("photoSrc") as string) || "/images/memories/default.webp";
  const photoAlt = (formData.get("photoAlt") as string) || title;
  const photoCaption = (formData.get("photoCaption") as string) || undefined;

  const memoryItem: CMSMemoryItem = {
    id: id.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    title,
    description,
    period,
    category,
    photos: [
      {
        src: photoSrc,
        alt: photoAlt,
        caption: photoCaption,
      },
    ],
    publishStatus,
  };

  await saveMemoryCMS(memoryItem, {
    email: session.user.email,
    role: session.user.role,
  });

  /* Public routes are build-gated (src/lib/cms/publish.ts); no runtime revalidation. */

  return { success: true as const, memory: memoryItem };
}

export async function deleteMemoryAction(id: string) {
  const auth = await authorize("admin");
  if (!auth.ok) return { success: false as const, error: auth.error };

  await deleteMemoryCMS(id, {
    email: auth.session.user.email,
    role: auth.session.user.role,
  });

  return { success: true as const };
}
