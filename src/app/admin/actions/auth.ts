"use server";

import { redirect } from "next/navigation";
import { login, logout, getSession } from "@/lib/cms/auth";

export async function loginAction(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/admin/dashboard";

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const result = await login(email, password);
  if (!result.success) {
    return { error: result.error ?? "Autentikasi gagal." };
  }

  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

export async function checkSessionAction() {
  return await getSession();
}
