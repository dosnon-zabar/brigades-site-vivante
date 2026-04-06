"use server";

import { redirect } from "next/navigation";
import { loginUser, setSession, clearSession } from "@/lib/auth";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  const result = await loginUser(email, password);

  if (!result.success) {
    return { error: result.error };
  }

  await setSession(result.user);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
