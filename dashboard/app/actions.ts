"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, isAuthed, setSession, updateOrderStatus } from "@/lib/orders";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== process.env.DASHBOARD_PASSWORD) {
    redirect("/?erreur=1");
  }
  await setSession();
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export async function saveStatus(formData: FormData) {
  if (!(await isAuthed())) redirect("/");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  await updateOrderStatus(id, status);
  revalidatePath("/");
}
