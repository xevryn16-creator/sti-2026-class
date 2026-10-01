"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireRole } from "@/lib/cms/auth";
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
  const session = await requireSession();

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

  revalidatePath("/students");
  revalidatePath("/admin/students");
  revalidatePath("/admin/dashboard");

  return { success: true, student: studentItem };
}

export async function deleteStudentAction(id: string) {
  const session = await requireRole("admin"); // Only admin can delete student
  await deleteStudentCMS(id, {
    email: session.user.email,
    role: session.user.role,
  });

  revalidatePath("/students");
  revalidatePath("/admin/students");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
