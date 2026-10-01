"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireRole } from "@/lib/cms/auth";
import { uploadMediaFile } from "@/lib/cms/media";
import {
  getAllMediaCMS,
  saveMediaAssetCMS,
  deleteMediaAssetCMS,
} from "@/lib/cms/store";

export async function getMediaAction() {
  await requireSession();
  return await getAllMediaCMS();
}

export async function uploadMediaAction(formData: FormData) {
  const session = await requireSession();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "Berkas tidak ditemukan." };
  }

  const result = await uploadMediaFile(file, session.user.email);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  await saveMediaAssetCMS(result.asset, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/admin/media");
  revalidatePath("/admin/dashboard");

  return { success: true, asset: result.asset };
}

export async function deleteMediaAction(id: string) {
  const session = await requireRole("admin");
  await deleteMediaAssetCMS(id, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/admin/media");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
