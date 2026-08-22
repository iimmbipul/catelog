"use server";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const u = String(formData.get("username") ?? "");
  const p = String(formData.get("password") ?? "");
  const res = await signIn(u, p);
  if (!res.ok) {
    redirect("/admin/login?error=1");
  }
  redirect("/admin");
}
