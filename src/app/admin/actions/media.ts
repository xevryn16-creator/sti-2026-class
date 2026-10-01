"use server";

import { authorize, requireSession } from "@/lib/cms/auth";
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
  const auth = await authorize();
  if (!auth.ok) return { success: false as const, error: auth.error };
  const session = auth.session;

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false as const, error: "Berkas tidak ditemukan." };
  }

  const result = await uploadMediaFile(file, session.user.email);
  if (!result.success) {
    return { success: false as const, error: result.error };
  }

  await saveMediaAssetCMS(result.asset, {
    email: session.user.email,
    role: session.user.role,
  });

  /* Uploaded binaries land in public/uploads and join the next build
     (src/lib/cms/publish.ts) — the admin UI states this explicitly. */
  return { success: true as const, asset: result.asset };
}

export async function deleteMediaAction(id: string) {
  const auth = await authorize("admin");
  if (!auth.ok) return { success: false as const, error: auth.error };

  await deleteMediaAssetCMS(id, {
    email: auth.session.user.email,
    role: auth.session.user.role,
  });

  return { success: true as const };
}
