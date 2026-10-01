"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireRole } from "@/lib/cms/auth";
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
  const session = await requireSession();

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

  revalidatePath("/memories");
  revalidatePath("/admin/memories");
  revalidatePath("/admin/dashboard");

  return { success: true, memory: memoryItem };
}

export async function deleteMemoryAction(id: string) {
  const session = await requireRole("admin");
  await deleteMemoryCMS(id, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/memories");
  revalidatePath("/admin/memories");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
