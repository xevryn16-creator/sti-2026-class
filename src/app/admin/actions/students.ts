"use server";

import { authorize, requireSession } from "@/lib/cms/auth";
import {
  getAllStudentsCMS,
  getStudentByIdCMS,
  saveStudentCMS,
  deleteStudentCMS,
} from "@/lib/cms/store";
import type { CMSStudentItem, PublishStatus } from "@/types/cms";

export async function getStudentsAction() {
  await requireSession();
  return await getAllStudentsCMS();
}

export async function saveStudentAction(formData: FormData) {
  const auth = await authorize();
  if (!auth.ok) return { success: false as const, error: auth.error };
  const session = auth.session;

  const id = (formData.get("id") as string) || `student-${Date.now()}`;
  const name = formData.get("name") as string;
  const nickname = (formData.get("nickname") as string) || undefined;
  const photo = (formData.get("photo") as string) || "/images/students/placeholder.webp";
  const photoFallback = (formData.get("photoFallback") as string) || undefined;
  const bio = (formData.get("bio") as string) || undefined;
  const quote = (formData.get("quote") as string) || undefined;
  const consentPublic = formData.get("consentPublic") === "true";
  const publishStatus = (formData.get("publishStatus") as PublishStatus) || "published";

  const interestsRaw = (formData.get("interests") as string) || "";
  const interests = interestsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const studentItem: CMSStudentItem = {
    id: id.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    name,
    nickname,
    photo,
    photoFallback,
    bio,
    quote,
    interests,
    consentPublic,
    publishStatus,
  };

  await saveStudentCMS(studentItem, {
    email: session.user.email,
    role: session.user.role,
  });

  /*
   * No `revalidatePath()` here on purpose: public routes are prerendered from
   * build-inlined JSON, so revalidating them at runtime would silently do
   * nothing (src/lib/cms/publish.ts). Publishing happens on the next build.
   */

  return { success: true as const, student: studentItem };
}

export async function deleteStudentAction(id: string) {
  // Non-throwing gate: a denied editor gets a message, not an error page.
  const auth = await authorize("admin");
  if (!auth.ok) return { success: false as const, error: auth.error };

  await deleteStudentCMS(id, {
    email: auth.session.user.email,
    role: auth.session.user.role,
  });

  return { success: true as const };
}
